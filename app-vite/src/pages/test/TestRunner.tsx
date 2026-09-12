import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import type { TestItem } from "@/shared/data/types";
import { BLOCK_PASS, poolFor, qid, type TestMode } from "@/shared/data/testModes";
import { shuffle } from "@/shared/lib/random";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Label, PageHead, ProgressBar } from "@/shared/ui";
import styles from "./TestPage.module.css";

/** Четыре типа — один и тот же выбор из вариантов, меняется только подсказка. */
const isChoice = (q: TestItem): q is Extract<TestItem, { k: "gap" | "tr" | "nat" | "mean" }> =>
  q.k === "gap" || q.k === "tr" || q.k === "nat" || q.k === "mean";

const prompt = (q: TestItem, t: (s: string) => string): string => {
  if (q.k === "gap") return q.s;
  if (q.k === "tr") return t(q.ru);
  if (q.k === "mean") return q.s;
  if (q.k === "nat") return t("Что звучит естественнее?");
  if (q.k === "err") return t("Нажми на слово, которое стоит неправильно.");
  return t("Собери фразу в правильном порядке.");
};

const correctText = (q: TestItem): string => {
  if (q.k === "gap") return q.s.replace("___", q.o[q.a]);
  if (q.k === "mean") return `${q.s} — ${q.o[q.a]}`;
  if (q.k === "tr" || q.k === "nat") return q.o[q.a];
  if (q.k === "err") return q.s.split(" ").map((w, i) => (i === q.a ? q.fix : w)).join(" ");
  return q.o.join(" ");
};

/** Что озвучивать: у «что это значит» верный ответ по-русски. */
const sayText = (q: TestItem): string => (q.k === "mean" ? q.s : correctText(q));

const givenText = (q: TestItem, answer: number | string): string => {
  if (q.k === "gap") return q.s.replace("___", q.o[Number(answer)]);
  if (q.k === "mean") return `${q.s} — ${q.o[Number(answer)]}`;
  if (q.k === "tr" || q.k === "nat") return q.o[Number(answer)];
  if (q.k === "err") return q.s;
  return String(answer);
};

const bare = (key: string) => key.replace(/-\d+$/, "");

interface Props {
  mode: TestMode;
  onExit: () => void;
}

export const TestRunner = ({ mode, onExit }: Props) => {
  const t = useT();
  const addMistake = useAppStore((s) => s.addMistake);
  const noteTestMiss = useAppStore((s) => s.noteTestMiss);
  const clearTestMiss = useAppStore((s) => s.clearTestMiss);
  const finishTest = useAppStore((s) => s.finishTest);
  const setLevel = useAppStore((s) => s.setLevel);

  /** промахи фиксируются на входе, чтобы список не тасовался во время подхода */
  const [missKeys] = useState(() => {
    const m = useAppStore.getState().testMisses;
    return Object.keys(m).sort((a, b) => (m[b] ?? 0) - (m[a] ?? 0));
  });

  const [block, setBlock] = useState(0);
  const [seed, setSeed] = useState(0);
  const [step, setStep] = useState(0);
  const [right, setRight] = useState(0);
  const [tally, setTally] = useState({ right: 0, total: 0 });
  const [passed, setPassed] = useState<string[]>([]);
  const [answer, setAnswer] = useState<number | string | null>(null);
  const [assembled, setAssembled] = useState<string[]>([]);
  const [result, setResult] = useState<{ right: number; total: number; level?: string; stopped?: boolean } | null>(null);

  const queue = useMemo(() => {
    void seed;
    const pool = poolFor(mode, mode.blocks?.[block], missKeys);
    const order = mode.id === "errors" ? pool : shuffle(pool);
    return order.slice(0, mode.len);
  }, [mode, block, seed, missKeys]);

  const q = queue[step];
  const finished = step >= queue.length;
  const scramble = useMemo(() => (q && q.k === "ord" ? shuffle(q.o) : []), [q]);
  const said = assembled.map(bare).join(" ");

  const closeRound = () => {
    const total = queue.length;
    const sumRight = tally.right + right;
    const sumTotal = tally.total + total;
    setTally({ right: sumRight, total: sumTotal });

    if (!mode.blocks) {
      finishTest(mode.id, right, total);
      setResult({ right, total });
      return;
    }

    const levels = mode.blocks;
    const ok = right >= Math.ceil(total * BLOCK_PASS);
    if (ok) {
      const nextPassed = [...passed, levels[block]];
      setPassed(nextPassed);
      if (block + 1 >= levels.length) {
        setLevel(levels[block]);
        finishTest(mode.id, sumRight, sumTotal);
        setResult({ right: sumRight, total: sumTotal, level: levels[block] });
      } else {
        setBlock((b) => b + 1);
        setStep(0);
        setRight(0);
        setAnswer(null);
        setAssembled([]);
      }
    } else {
      const reached = passed.length ? passed[passed.length - 1] : levels[0];
      setLevel(reached);
      finishTest(mode.id, sumRight, sumTotal);
      setResult({ right: sumRight, total: sumTotal, level: reached, stopped: true });
    }
  };

  /** у теста без блоков итог наступает сразу после последнего вопроса */
  useEffect(() => {
    if (finished && !mode.blocks && !result && queue.length) closeRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const restart = () => {
    setBlock(0);
    setSeed((s) => s + 1);
    setStep(0);
    setRight(0);
    setTally({ right: 0, total: 0 });
    setPassed([]);
    setAnswer(null);
    setAssembled([]);
    setResult(null);
  };

  const grade = (value: number | string, ok: boolean) => {
    setAnswer(value);
    if (!q) return;
    if (ok) {
      setRight((r) => r + 1);
      clearTestMiss(qid(q));
    } else {
      addMistake(givenText(q, value), correctText(q), q.w);
      noteTestMiss(qid(q));
    }
  };

  const head = (
    <PageHead
      title={t(mode.n)}
      lead={t(mode.about)}
      aside={
        <button type="button" className={styles.back} onClick={onExit}>
          {t("к тестам")}
        </button>
      }
    />
  );

  if (!queue.length) {
    return (
      <div className={styles.wrap}>
        {head}
        <Card flat>
          <p className={styles.note}>
            {t(
              mode.id === "errors"
                ? "Промахов пока нет — этот тест наполняется сам, когда ты ошибаешься в других тестах."
                : "Для этого теста вопросов пока нет."
            )}
          </p>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className={styles.wrap}>
        {head}
        <Card tone="accent">
          <Label>{t("результат")}</Label>
          <div className={styles.result}>{`${result.right} ${t("из")} ${result.total}`}</div>
          <ProgressBar value={(result.right / result.total) * 100} />
          {result.level ? (
            <>
              <p className={styles.levelLine}>
                {`${t("Твой уровень по тесту:")} `}
                <strong className={styles.levelMark}>{result.level}</strong>
              </p>
              <p className={styles.note}>
                {t(
                  result.stopped
                    ? "Блок этого уровня взят не полностью — дальше тест не пошёл. Разбери промахи в журнале и вернись."
                    : "Все блоки пройдены до конца. Выше этого теста уровней нет."
                )}
              </p>
            </>
          ) : (
            <p className={styles.note}>
              {t("Разбор промахов уже в журнале ошибок: там же они вернутся на повторение.")}
            </p>
          )}
          <div className={styles.actions}>
            <Button variant="primary" onClick={restart}>
              {t("пройти заново")}
            </Button>
            <Button onClick={onExit}>{t("другие тесты")}</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (finished && mode.blocks) {
    return (
      <div className={styles.wrap}>
        {head}
        <Card tone="accent">
          <Label>{`${t("блок")} ${mode.blocks[block]} · ${t("закрыт")}`}</Label>
          <div className={styles.result}>{`${right} ${t("из")} ${queue.length}`}</div>
          <ProgressBar value={(right / queue.length) * 100} />
          <p className={styles.note}>
            {`${t("нужно для следующего блока:")} ${Math.ceil(queue.length * BLOCK_PASS)} ${t("из")} ${queue.length}`}
          </p>
          <Button variant="primary" onClick={closeRound}>
            {t("дальше")}
          </Button>
        </Card>
      </div>
    );
  }

  if (!q) return <div className={styles.wrap}>{head}</div>;

  return (
    <div className={styles.wrap}>
      {head}

      <Card tone="accent">
        <Label>
          {mode.blocks
            ? `${t("блок")} ${mode.blocks[block]} · ${step + 1}/${queue.length} · ${t(q.t)}`
            : `${q.lvl} · ${t(q.t)} · ${step + 1}/${queue.length}`}
        </Label>

        {isChoice(q) ? (
          <>
            <div className={q.k === "nat" ? styles.note : styles.sentence}>{prompt(q, t)}</div>
            <div className={styles.options}>
              {q.o.map((option, i) => {
                const picked = answer !== null;
                const isRight = i === q.a;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={picked}
                    onClick={() => grade(i, isRight)}
                    className={[
                      styles.option,
                      picked && isRight && styles.optionRight,
                      picked && !isRight && answer === i && styles.optionWrong,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {q.k === "err" ? (
          <>
            <p className={styles.note}>{prompt(q, t)}</p>
            <div className={styles.tokens}>
              {q.s.split(" ").map((word, i) => {
                const picked = answer !== null;
                const isRight = i === q.a;
                return (
                  <button
                    key={`${word}-${i}`}
                    type="button"
                    disabled={picked}
                    onClick={() => grade(i, isRight)}
                    className={[
                      styles.token,
                      picked && isRight && styles.optionRight,
                      picked && !isRight && answer === i && styles.optionWrong,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {q.k === "ord" ? (
          <>
            <p className={styles.note}>
              {`${prompt(q, t)} ${t("Нажми на слово в строке, чтобы вернуть его назад.")}`}
            </p>
            <div className={styles.tokens}>
              {scramble.map((word, i) => (
                <button
                  key={`${word}-${i}`}
                  type="button"
                  disabled={answer !== null || assembled.includes(`${word}-${i}`)}
                  className={styles.token}
                  onClick={() => setAssembled((prev) => [...prev, `${word}-${i}`])}
                >
                  {word}
                </button>
              ))}
            </div>
            <div className={styles.assembled}>
              {assembled.length ? (
                <div className={styles.tokens}>
                  {assembled.map((key) => (
                    <button
                      key={key}
                      type="button"
                      disabled={answer !== null}
                      className={styles.token}
                      onClick={() => setAssembled((prev) => prev.filter((x) => x !== key))}
                    >
                      {bare(key)}
                    </button>
                  ))}
                </div>
              ) : (
                <span className={styles.small}>{t("пока пусто")}</span>
              )}
            </div>
            {answer === null ? (
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  disabled={assembled.length !== q.o.length}
                  onClick={() => grade(said, said.toLowerCase() === q.o.join(" ").toLowerCase())}
                >
                  {t("проверить")}
                </Button>
                <Button onClick={() => setAssembled([])}>{t("очистить")}</Button>
                <span className={styles.small}>
                  {`${assembled.length}/${q.o.length} ${t("слов собрано")}`}
                </span>
              </div>
            ) : null}
          </>
        ) : null}

        {answer !== null ? (
          <>
            <div className={styles.answer}>
              {correctText(q)}
              <button type="button" className={styles.speak} onClick={() => speak(sayText(q))}>
                {t("звук")}
              </button>
            </div>
            <p className={styles.why}>{t(q.w)}</p>
            <Button
              variant="primary"
              onClick={() => {
                setStep((s) => s + 1);
                setAnswer(null);
                setAssembled([]);
              }}
            >
              {step + 1 === queue.length ? t("итог") : t("дальше")}
            </Button>
          </>
        ) : null}
      </Card>
    </div>
  );
};
