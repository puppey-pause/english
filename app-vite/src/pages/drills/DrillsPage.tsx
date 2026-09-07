import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { DRILLS, ORDERS, PICKS } from "@/shared/data/drills";
import { DRILL_TOPICS } from "@/shared/config";
import { shuffle } from "@/shared/lib/random";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Chip, Input, Label, PageHead } from "@/shared/ui";
import styles from "./DrillsPage.module.css";

type Mode = "err" | "gap" | "ord";

const MODES: { id: Mode; label: string; lead: string }[] = [
  { id: "err", label: "найди ошибку", lead: "Скажи, что не так, и посмотри правильный вариант." },
  { id: "gap", label: "вставь слово", lead: "Выбери форму, которая подходит по смыслу." },
  { id: "ord", label: "собери фразу", lead: "Собери английскую фразу по русской подсказке." },
];

export const DrillsPage = () => {
  const t = useT();
  const addMistake = useAppStore((s) => s.addMistake);

  const [mode, setMode] = useState<Mode>("err");
  const [topic, setTopic] = useState<string>("все");
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | number | null>(null);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState({ right: 0, total: 0 });

  const errPool = useMemo(
    () => shuffle(DRILLS.filter((d) => topic === "все" || d.t === topic)),
    [topic]
  );
  const gapPool = useMemo(
    () => shuffle(PICKS.filter((d) => topic === "все" || d.t === topic)),
    [topic]
  );
  const ordPool = useMemo(() => shuffle(ORDERS), []);

  const reset = (next: Partial<{ mode: Mode; topic: string }>) => {
    if (next.mode) setMode(next.mode);
    if (next.topic) setTopic(next.topic);
    setStep(0);
    setAnswer(null);
    setTyped("");
  };

  const advance = () => {
    setStep((s) => s + 1);
    setAnswer(null);
    setTyped("");
  };

  const err = errPool[step % Math.max(errPool.length, 1)];
  const gap = gapPool[step % Math.max(gapPool.length, 1)];
  const ord = ordPool[step % Math.max(ordPool.length, 1)];
  const scrambled = useMemo(() => (ord ? shuffle(ord.s.split(" ")) : []), [ord]);

  const record = (correct: boolean, said: string, right: string, why: string) => {
    setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
    if (!correct) addMistake(said, right, why);
  };

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("тренажёр")}
        lead={t(MODES.find((m) => m.id === mode)?.lead ?? "")}
        aside={<span className={styles.score}>{`${score.right} / ${score.total}`}</span>}
      />

      <div className={styles.filters}>
        {MODES.map((m) => (
          <Chip key={m.id} label={t(m.label)} active={mode === m.id} onClick={() => reset({ mode: m.id })} />
        ))}
      </div>

      {mode !== "ord" ? (
        <div className={styles.filters}>
          {DRILL_TOPICS.map((x) => (
            <Chip key={x} label={t(x)} active={topic === x} onClick={() => reset({ topic: x })} />
          ))}
        </div>
      ) : null}

      {mode === "err" && err ? (
        <Card tone="accent">
          <Label>{`${t(err.t)} · ${t("найди ошибку")}`}</Label>
          <div className={styles.sentence}>{err.b}</div>
          {answer === null ? (
            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={() => {
                  setAnswer("shown");
                  record(false, err.b, err.g, err.w);
                }}
              >
                {t("показать правильный вариант")}
              </Button>
              <Button
                variant="positive"
                onClick={() => {
                  setAnswer("knew");
                  record(true, err.b, err.g, err.w);
                }}
              >
                {t("я знал")}
              </Button>
            </div>
          ) : (
            <>
              <div className={styles.good}>
                {err.g}
                <button type="button" className={styles.speak} onClick={() => speak(err.g)}>
                  {t("звук")}
                </button>
              </div>
              <p className={styles.why}>{t(err.w)}</p>
              <Button variant="primary" onClick={advance}>
                {t("дальше")}
              </Button>
            </>
          )}
        </Card>
      ) : null}

      {mode === "gap" && gap ? (
        <Card tone="accent">
          <Label>{`${t(gap.t)} · ${t("вставь слово")}`}</Label>
          <div className={styles.sentence}>{gap.s}</div>
          <div className={styles.options}>
            {gap.o.map((option, i) => {
              const picked = answer !== null;
              const correct = i === gap.a;
              return (
                <button
                  key={option}
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

      {mode === "ord" && ord ? (
        <Card tone="accent">
          <Label>{t("собери фразу")}</Label>
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
          <Input
            value={typed}
            placeholder={t("твоя фраза")}
            onChange={(e) => setTyped(e.target.value)}
          />
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
