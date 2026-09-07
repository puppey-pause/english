import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { STAGES } from "@/entities/stage";
import { MILES } from "@/shared/data/milestones";
import { LAYER_COLOR } from "@/shared/config";
import { Button, Card, Label, PageHead, ProgressBar, Tag } from "@/shared/ui";
import { TopicDetail } from "./TopicDetail";
import styles from "./LearnPage.module.css";

export const LearnPage = () => {
  const t = useT();
  const stageIndex = useAppStore((s) => s.stageIndex);
  const openTopic = useAppStore((s) => s.openTopic);
  const done = useAppStore((s) => s.done);
  const setView = useAppStore((s) => s.setView);
  const setOpenTopic = useAppStore((s) => s.setOpenTopic);

  const index = Math.min(Math.max(stageIndex, 0), STAGES.length - 1);
  const stage = STAGES[index];
  const stageDone = stage.topics.filter((tp) => done[tp.k]).length;
  const milestone = MILES[stage.num];

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("учёба")}
        lead={t("Этапы идут по порядку: сначала разбор темы, потом задание этапа.")}
        aside={
          <>
            <Button onClick={() => setView("learn", index - 1)} disabled={index === 0}>
              ←
            </Button>
            <Tag plain>{`${stage.num} / ${STAGES.length}`}</Tag>
            <Button onClick={() => setView("learn", index + 1)} disabled={index === STAGES.length - 1}>
              →
            </Button>
          </>
        }
      />

      <div className={styles.strip}>
        {STAGES.map((s, i) => {
          const full = s.topics.every((tp) => done[tp.k]);
          return (
            <button
              key={s.num}
              type="button"
              title={s.title}
              onClick={() => setView("learn", i)}
              className={[styles.tick, i === index && styles.tickActive, full && styles.tickFull]
                .filter(Boolean)
                .join(" ")}
            >
              {s.num}
            </button>
          );
        })}
      </div>

      <Card tone="accent">
        <Label>{`${t("этап")} ${stage.num} · ${t(stage.level)} · ${t(stage.time)}`}</Label>
        <h3 className={styles.title}>{t(stage.title)}</h3>
        <ProgressBar value={(stageDone / stage.topics.length) * 100} />
        <p className={styles.practice}>
          <strong>{t("задание этапа")}: </strong>
          {t(stage.practice)}
        </p>
      </Card>

      {milestone ? (
        <Card tone="warn">
          <Label>{t("рубеж")}</Label>
          <p className={styles.practice}>{t(milestone)}</p>
        </Card>
      ) : null}

      <div className={styles.topics}>
        {stage.topics.map((topic) => {
          const open = openTopic === topic.k;
          return (
            <Card key={topic.k} className={open ? styles.openCard : undefined}>
              <button
                type="button"
                className={styles.topicHead}
                onClick={() => setOpenTopic(open ? "" : topic.k)}
              >
                <span className={styles.dot} style={{ background: LAYER_COLOR[topic.layer] }} aria-hidden />
                <span className={styles.topicText}>
                  <Label>{t(topic.layer)}</Label>
                  <span className={styles.topicName}>
                    {t(topic.name)}
                    {done[topic.k] ? <span className={styles.check}>✓</span> : null}
                  </span>
                  <span className={styles.topicDesc}>{t(topic.desc)}</span>
                </span>
                <span className={styles.caret} aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>
              {open ? <TopicDetail topic={topic} /> : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
