import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { TEST } from "@/shared/data/testBank";
import type { TestItem } from "@/shared/data/types";
import { shuffle } from "@/shared/lib/random";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Chip, Label, PageHead, ProgressBar } from "@/shared/ui";
import styles from "./TestPage.module.css";

const QUIZ_LENGTH = 10;

const LEVELS = Array.from(new Set(TEST.map((q) => q.lvl)));
const TOPICS = Array.from(new Set(TEST.map((q) => q.t)));

const correctText = (q: TestItem): string => {
  if (q.k === "gap") return q.s.replace("___", q.o[q.a]);
  if (q.k === "err") return q.s.split(" ").map((w, i) => (i === q.a ? q.fix : w)).join(" ");
  return q.o.join(" ");
};

const givenText = (q: TestItem, answer: number | string): string => {
  if (q.k === "gap") return q.s.replace("___", q.o[Number(answer)]);
  if (q.k === "err") return q.s;
  return String(answer);
};

export const TestPage = () => {
  const t = useT();
  const addMistake = useAppStore((s) => s.addMistake);

  const [level, setLevel] = useState<string>("все");
  const [topic, setTopic] = useState<string>("все");
  const [seed, setSeed] = useState(0);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | string | null>(null);
  const [assembled, setAssembled] = useState<string[]>([]);
  const [right, setRight] = useState(0);

  const quiz = useMemo(() => {
    void seed;
    const pool = TEST.filter(
      (q) => (level === "все" || q.lvl === level) && (topic === "все" || q.t === topic)
    );
    return shuffle(pool).slice(0, QUIZ_LENGTH);
  }, [level, topic, seed]);

  const q = quiz[step];
  const scramble = useMemo(() => (q && q.k === "ord" ? shuffle(q.o) : []), [q]);
  const finished = step >= quiz.length;

  const restart = (next: Partial<{ level: string; topic: string }>) => {
    if (next.level) setLevel(next.level);
    if (next.topic) setTopic(next.topic);
    setSeed((s) => s + 1);
    setStep(0);
    setAnswer(null);
    setAssembled([]);
    setRight(0);
  };

  const grade = (value: number | string, ok: boolean) => {
    setAnswer(value);
    if (ok) setRight((r) => r + 1);
    else if (q) addMistake(givenText(q, value), correctText(q), q.w);
  };

  const next = () => {
    setStep((s) => s + 1);
    setAnswer(null);
    setAssembled([]);
  };

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("тесты")}
        lead={t("Десять вопросов за подход. Промахи уходят в журнал ошибок сами.")}
        aside={<span className={styles.score}>{`${right} / ${quiz.length}`}</span>}
      />

      <div className={styles.filters}>
        <Chip label={t("все уровни")} active={level === "все"} onClick={() => restart({ level: "все" })} />
        {LEVELS.map((l) => (
          <Chip key={l} label={l} active={level === l} onClick={() => restart({ level: l })} />
        ))}
      </div>

      <div className={styles.filters}>
        <Chip label={t("все темы")} active={topic === "все"} onClick={() => restart({ topic: "все" })} />
        {TOPICS.map((x) => (
          <Chip key={x} label={t(x)} active={topic === x} onClick={() => restart({ topic: x })} />
        ))}
      </div>

      {!quiz.length ? (
        <Card flat>
          <p className={styles.note}>{t("Для такой пары фильтров вопросов нет — выбери другой уровень или тему.")}</p>
        </Card>
      ) : finished ? (
        <Card tone="accent">
          <Label>{t("подход закрыт")}</Label>
          <div className={styles.result}>{`${right} ${t("из")} ${quiz.length}`}</div>
          <ProgressBar value={(right / quiz.length) * 100} />
          <p className={styles.note}>
            {t(
              right >= quiz.length - 1
                ? "Уровень взят. Поднимай планку — выбери уровень выше."
                : "Разбор промахов уже в журнале ошибок: там же они вернутся на повторение."
            )}
          </p>
          <Button variant="primary" onClick={() => restart({})}>
            {t("ещё подход")}
          </Button>
        </Card>
      ) : q ? (
        <Card tone="accent">
          <Label>{`${q.lvl} · ${t(q.t)} · ${step + 1}/${quiz.length}`}</Label>

          {q.k === "gap" ? (
            <>
              <div className={styles.sentence}>{q.s}</div>
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
              <p className={styles.note}>{t("Нажми на слово, которое стоит неправильно.")}</p>
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
              <p className={styles.note}>{t("Собери фразу в правильном порядке.")}</p>
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
                {assembled.map((k) => k.replace(/-\d+$/, "")).join(" ") || t("пока пусто")}
              </div>
              {answer === null ? (
                <div className={styles.actions}>
                  <Button
                    variant="primary"
                    disabled={!assembled.length}
                    onClick={() => {
                      const said = assembled.map((k) => k.replace(/-\d+$/, "")).join(" ");
                      grade(said, said.toLowerCase() === q.o.join(" ").toLowerCase());
                    }}
                  >
                    {t("проверить")}
                  </Button>
                  <Button onClick={() => setAssembled([])}>{t("очистить")}</Button>
                </div>
              ) : null}
            </>
          ) : null}

          {answer !== null ? (
            <>
              <div className={styles.answer}>
                {correctText(q)}
                <button type="button" className={styles.speak} onClick={() => speak(correctText(q))}>
                  {t("звук")}
                </button>
              </div>
              <p className={styles.why}>{t(q.w)}</p>
              <Button variant="primary" onClick={next}>
                {step + 1 === quiz.length ? t("итог") : t("дальше")}
              </Button>
            </>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
};
