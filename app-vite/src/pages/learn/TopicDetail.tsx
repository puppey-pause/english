import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import type { Topic } from "@/entities/stage";
import { INFO } from "@/shared/data/topicInfo";
import { STEPS } from "@/shared/data/steps";
import { speak } from "@/shared/lib/speech";
import { Button, Label, Textarea } from "@/shared/ui";
import styles from "./LearnPage.module.css";

export const TopicDetail = ({ topic }: { topic: Topic }) => {
  const t = useT();
  const done = useAppStore((s) => s.done);
  const notes = useAppStore((s) => s.notes);
  const stepsDone = useAppStore((s) => s.steps);
  const toggleStep = useAppStore((s) => s.toggleStep);
  const toggleDone = useAppStore((s) => s.toggleDone);
  const setNote = useAppStore((s) => s.setNote);

  const info = INFO[topic.name];
  const steps = STEPS[topic.layer] ?? [];
  const isDone = Boolean(done[topic.k]);
  const checked = steps.filter((_, i) => stepsDone[`${topic.k}#${i}`]).length;
  const ready = checked === steps.length;

  return (
    <div className={styles.detail}>
      {info?.t.map((para, i) => (
        <p key={i} className={styles.para}>{t(para)}</p>
      ))}

      {info?.rows?.length ? (
        <div className={styles.rows}>
          {info.rows.map(([example, note], i) => (
            <div key={i} className={styles.row}>
              <div className={styles.example}>
                <span>{example}</span>
                <button type="button" className={styles.speak} onClick={() => speak(example)}>
                  {t("звук")}
                </button>
              </div>
              <p className={styles.note}>{t(note)}</p>
            </div>
          ))}
        </div>
      ) : null}

      {info?.nb ? (
        <p className={styles.nb}>
          <strong>{t("главное")}: </strong>
          {t(info.nb)}
        </p>
      ) : null}

      {steps.length ? (
        <div className={styles.steps}>
          <Label section>{`${t("что сделать")} · ${checked}/${steps.length}`}</Label>
          <div className={styles.list}>
            {steps.map((step, i) => {
              const key = `${topic.k}#${i}`;
              const on = Boolean(stepsDone[key]);
              return (
                <label key={i} className={[styles.step, on && styles.stepOn].filter(Boolean).join(" ")}>
                  <input type="checkbox" checked={on} onChange={() => toggleStep(key)} />
                  <span>{t(step)}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className={styles.crit}>
        <strong>{t("готово, когда")}: </strong>
        {t(topic.crit)}
      </p>

      <Label section>{t("своя заметка")}</Label>
      <Textarea
        rows={3}
        value={notes[topic.k] ?? ""}
        placeholder={t("свои примеры, слова, что не понял")}
        onChange={(e) => setNote(topic.k, e.target.value)}
      />

      <div className={styles.detailActions}>
        <Button
          variant={isDone ? "positive" : "primary"}
          disabled={!isDone && !ready}
          onClick={() => toggleDone(topic.k)}
        >
          {t(isDone ? "тема пройдена" : "отметить пройденной")}
        </Button>
        {!isDone && !ready ? (
          <span className={styles.gate}>{`${t("осталось шагов:")} ${steps.length - checked}`}</span>
        ) : null}
        {topic.link ? (
          <a className={styles.link} href={topic.link} target="_blank" rel="noreferrer">
            {t("источник")}
          </a>
        ) : null}
      </div>
    </div>
  );
};
