import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { DRILLS, ORDERS, PICKS } from "@/shared/data/drills";
import { GRAMMAR_TOPICS } from "@/shared/config";
import { shuffle } from "@/shared/lib/random";
import { speak } from "@/shared/lib/speech";
import { daysAgo, freshness } from "@/shared/lib/freshness";
import { Button, Card, Chip, Input, Label, PageHead } from "@/shared/ui";
import styles from "./DrillsPage.module.css";

type Mode = "err" | "gap" | "ord";

const STATE_LABEL: Record<string, string> = {
  fresh: "свежо",
  soon: "пора повторить",
  stale: "давно не был",
};

const MODES: { id: Mode; label: string; lead: string }[] = [
  { id: "err", label: "найди ошибку", lead: "Скажи, что не так, и посмотри правильный вариант." },
  { id: "gap", label: "вставь слово", lead: "Выбери форму, которая подходит по смыслу." },
  { id: "ord", label: "собери фразу", lead: "Собери английскую фразу по русской подсказке." },
];

/** сколько заданий каждого типа лежит в теме */
const COUNTS = GRAMMAR_TOPICS.map((topic) => ({
  topic,
  err: DRILLS.filter((d) => d.gt === topic).length,
  gap: PICKS.filter((d) => d.gt === topic).length,
  ord: ORDERS.filter((d) => d.gt === topic).length,
})).map((x) => ({ ...x, total: x.err + x.gap + x.ord }));

export const DrillsPage = () => {
  const t = useT();
  const addMistake = useAppStore((s) => s.addMistake);
  const runs = useAppStore((s) => s.drills);
  const finishDrill = useAppStore((s) => s.finishDrill);

  const [topic, setTopic] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("err");
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | number | null>(null);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState({ right: 0, total: 0 });

  const errPool = useMemo(() => shuffle(DRILLS.filter((d) => d.gt === topic)), [topic]);
  const gapPool = useMemo(() => shuffle(PICKS.filter((d) => d.gt === topic)), [topic]);
  const ordPool = useMemo(() => shuffle(ORDERS.filter((d) => d.gt === topic)), [topic]);

  const available = MODES.filter((m) =>
    m.id === "err" ? errPool.length : m.id === "gap" ? gapPool.length : ordPool.length
  );
  const active: Mode = available.some((m) => m.id === mode) ? mode : (available[0]?.id ?? "err");
  const pool = active === "err" ? errPool : active === "gap" ? gapPool : ordPool;

  const err = errPool[step];
  const gap = gapPool[step];
  const ord = ordPool[step];
  const scrambled = useMemo(() => (ord ? shuffle(ord.s.split(" ")) : []), [ord]);
  const finished = topic !== null && step >= pool.length;

  useEffect(() => {
    if (finished && topic && score.total) finishDrill(topic, score.right, score.total);
  }, [finished, topic, score.right, score.total, finishDrill]);

  const start = (next: string | null, nextMode?: Mode) => {
    setTopic(next);
    if (nextMode) setMode(nextMode);
    setStep(0);
    setAnswer(null);
    setTyped("");
    setScore({ right: 0, total: 0 });
  };

  const advance = () => {
    setStep((s) => s + 1);
    setAnswer(null);
    setTyped("");
  };

  const record = (correct: boolean, said: string, right: string, why: string) => {
    setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
    if (!correct) addMistake(said, right, why);
  };

  if (topic === null) {
    return (
      <div className={styles.wrap}>
        <PageHead
          title={t("тренажёр")}
          lead={t("Один заход — одна конструкция. Возьми тему и пройди её до конца.")}
        />
        <Label section>{t("выбери тему")}</Label>
        <div className={styles.topics}>
          {COUNTS.filter((x) => x.total).map((x) => {
            const run = runs[x.topic];
            const state = freshness(x.topic, run);
            return (
              <button
                key={x.topic}
                type="button"
                className={[styles.topicCard, styles[state]].filter(Boolean).join(" ")}
                onClick={() => start(x.topic)}
              >
                <span className={styles.topicHead}>
                  <span className={styles.topicName}>{t(x.topic)}</span>
                  {state !== "none" ? <span className={styles.mark} aria-hidden>✓</span> : null}
                </span>
                <span className={styles.topicCount}>{`${x.total} ${t("заданий")}`}</span>
                {run && state !== "none" ? (
                  <span className={styles.topicState}>
                    {`${t(STATE_LABEL[state])} · ${run.right}/${run.total} · ${daysAgo(run.at)} ${t("дн. назад")}`}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t(topic)}
        lead={t(MODES.find((m) => m.id === active)?.lead ?? "")}
        aside={<span className={styles.score}>{`${score.right} / ${score.total}`}</span>}
      />

      <div className={styles.topBar}>
        <Button onClick={() => start(null)}>{`← ${t("сменить тему")}`}</Button>
        <span className={styles.progress}>{`${Math.min(step + 1, pool.length)} / ${pool.length}`}</span>
      </div>

      <div className={styles.filters}>
        {available.map((m) => (
          <Chip
            key={m.id}
            label={t(m.label)}
            active={active === m.id}
            onClick={() => start(topic, m.id)}
          />
        ))}
      </div>

      {!pool.length ? (
        <Card flat>
          <p className={styles.why}>{t("В этой теме заданий такого типа нет.")}</p>
        </Card>
      ) : null}

      {finished ? (
        <Card tone="accent">
          <Label>{t("заход закончен")}</Label>
          <div className={styles.result}>{`${score.right} / ${score.total} ${t("верно")}`}</div>
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => start(topic, active)}>
              {t("пройти ещё раз")}
            </Button>
            <Button onClick={() => start(null)}>{t("сменить тему")}</Button>
          </div>
        </Card>
      ) : null}

      {!finished && active === "err" && err ? (
        <Card tone="accent">
          <Label>{`${t(err.gt)} · ${t("найди ошибку")}`}</Label>
          <div className={styles.sentence}>{err.b}</div>
          {answer === null ? (
            <Button variant="primary" onClick={() => setAnswer("shown")}>
              {t("показать правильный вариант")}
            </Button>
          ) : (
            <>
              <div className={styles.good}>
                {err.g}
                <button type="button" className={styles.speak} onClick={() => speak(err.g)}>
                  {t("звук")}
                </button>
              </div>
              <p className={styles.why}>{t(err.w)}</p>
              <div className={styles.actions}>
                <Button
                  variant="positive"
                  onClick={() => {
                    record(true, err.b, err.g, err.w);
                    advance();
                  }}
                >
                  {t("знал")}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    record(false, err.b, err.g, err.w);
                    advance();
                  }}
                >
                  {t("не знал")}
                </Button>
              </div>
            </>
          )}
        </Card>
      ) : null}

      {!finished && active === "gap" && gap ? (
        <Card tone="accent">
          <Label>{`${t(gap.gt)} · ${t("вставь слово")}`}</Label>
          <div className={styles.sentence}>{gap.s}</div>
          <div className={styles.options}>
            {gap.o.map((option, i) => {
              const picked = answer !== null;
              const correct = i === gap.a;
              return (
                <button
                  key={`${i}-${option}`}
                  type="button"
                  disabled={picked}
                  onClick={() => {
                    setAnswer(i);
                    record(correct, gap.s.replace("___", option), gap.s.replace("___", gap.o[gap.a]), gap.w);
                  }}
                  className={[
                    styles.option,
                    picked && correct && styles.optionRight,
                    picked && !correct && answer === i && styles.optionWrong,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {answer !== null ? (
            <>
              <p className={styles.why}>{t(gap.w)}</p>
              <Button variant="primary" onClick={advance}>
                {t("дальше")}
              </Button>
            </>
          ) : null}
        </Card>
      ) : null}

      {!finished && active === "ord" && ord ? (
        <Card tone="accent">
          <Label>{`${t(ord.gt)} · ${t("собери фразу")}`}</Label>
          <div className={styles.sentence}>{t(ord.ru)}</div>
          <div className={styles.chips}>
            {scrambled.map((w, i) => (
              <button
                key={`${w}-${i}`}
                type="button"
                className={styles.wordChip}
                onClick={() => setTyped((prev) => (prev ? `${prev} ${w}` : w))}
              >
                {w}
              </button>
            ))}
          </div>
          <Input value={typed} placeholder={t("твоя фраза")} onChange={(e) => setTyped(e.target.value)} />
          {answer === null ? (
            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={() => {
                  const ok = typed.trim().replace(/[.?!]$/, "").toLowerCase() === ord.s.toLowerCase();
                  setAnswer(ok ? "right" : "wrong");
                  record(ok, typed.trim() || t("нет ответа"), ord.s, t("Порядок слов: ") + ord.ru);
                }}
              >
                {t("проверить")}
              </Button>
              <Button onClick={() => setTyped("")}>{t("очистить")}</Button>
            </div>
          ) : (
            <>
              <div className={[styles.good, answer === "wrong" && styles.goodWrong].filter(Boolean).join(" ")}>
                {ord.s}
                <button type="button" className={styles.speak} onClick={() => speak(ord.s)}>
                  {t("звук")}
                </button>
              </div>
              <Button variant="primary" onClick={advance}>
                {t("дальше")}
              </Button>
            </>
          )}
        </Card>
      ) : null}
    </div>
  );
};
