import { useMemo } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { STAGES, TOPICS } from "@/entities/stage";
import { isDue } from "@/shared/lib/srs";
import { plural } from "@/shared/lib/format";
import { pick } from "@/shared/lib/random";
import { SLANG } from "@/shared/data/slang";
import { MILES } from "@/shared/data/milestones";
import { LAYER_COLOR } from "@/shared/config";
import { Button, Card, Label, PageHead, ProgressBar, Tag } from "@/shared/ui";
import styles from "./TodayPage.module.css";

export const TodayPage = () => {
  const t = useT();
  const done = useAppStore((s) => s.done);
  const rev = useAppStore((s) => s.rev);
  const words = useAppStore((s) => s.words);
  const mistakes = useAppStore((s) => s.mistakes);
  const setView = useAppStore((s) => s.setView);
  const setOpenTopic = useAppStore((s) => s.setOpenTopic);

  const doneCount = TOPICS.filter((tp) => done[tp.k]).length;
  const percent = Math.round((doneCount / TOPICS.length) * 100);

  /** the earliest stage that still has unfinished topics — where the learner actually is */
  const stage = useMemo(
    () => STAGES.find((s) => s.topics.some((tp) => !done[tp.k])) ?? STAGES[STAGES.length - 1],
    [done]
  );
  const next = stage.topics.find((tp) => !done[tp.k]) ?? stage.topics[0];
  const stageDone = stage.topics.filter((tp) => done[tp.k]).length;

  const dueTopics = TOPICS.filter((tp) => done[tp.k] && isDue(rev[tp.k])).length;
  const dueWords = words.filter((w) => isDue(w.due)).length;
  const dueMistakes = mistakes.filter((m) => isDue(m.due)).length;
  const phrase = useMemo(() => pick(SLANG), []);
  const milestone = MILES[stage.num];

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("на сегодня")}
        lead={t("Один заход в день: новая тема, потом повторение. Всё остальное — по желанию.")}
        aside={<Tag>{`${percent}% ${t("пути")}`}</Tag>}
      />

      <Card tone="accent">
        <Label>{`${t("этап")} ${stage.num} · ${t(stage.level)}`}</Label>
        <h3 className={styles.stageTitle}>{t(stage.title)}</h3>
        <ProgressBar value={(stageDone / stage.topics.length) * 100} />
        <p className={styles.meta}>
          {`${stageDone} ${t("из")} ${stage.topics.length} ${t(plural(stage.topics.length, "тема", "темы", "тем"))} · ${t(stage.time)}`}
        </p>

        <div className={styles.nextTopic}>
          <span className={styles.dot} style={{ background: LAYER_COLOR[next.layer] }} aria-hidden />
          <div>
            <Label>{t(next.layer)}</Label>
            <div className={styles.nextName}>{t(next.name)}</div>
            <p className={styles.nextDesc}>{t(next.desc)}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => {
              setOpenTopic(next.k);
              setView("learn", Number(stage.num) - 1);
            }}
          >
            {t("продолжить учёбу")}
          </Button>
          <Button onClick={() => setView("map")}>{t("карта слоёв")}</Button>
        </div>
      </Card>

      {milestone ? (
        <Card tone="warn">
          <Label>{t("рубеж этапа")}</Label>
          <p className={styles.miles}>{t(milestone)}</p>
        </Card>
      ) : null}

      <div className={styles.grid}>
        <Card onPress={() => setView("review")}>
          <Label>{t("повторение")}</Label>
          <div className={styles.big}>{dueTopics}</div>
          <p className={styles.small}>{t(dueTopics ? "тем ждут повторения" : "на сегодня чисто")}</p>
        </Card>
        <Card onPress={() => setView("words")}>
          <Label>{t("слова")}</Label>
          <div className={styles.big}>{dueWords}</div>
          <p className={styles.small}>{`${t("в колоде")} ${words.length}`}</p>
        </Card>
        <Card onPress={() => setView("errors")}>
          <Label>{t("журнал ошибок")}</Label>
          <div className={styles.big}>{dueMistakes}</div>
          <p className={styles.small}>{`${t("всего записей")} ${mistakes.length}`}</p>
        </Card>
        <Card onPress={() => setView("drills")}>
          <Label>{t("тренажёр")}</Label>
          <div className={styles.big}>5</div>
          <p className={styles.small}>{t("минут на разминку")}</p>
        </Card>
      </div>

      <Card flat>
        <Label>{t("фраза дня")}</Label>
        <div className={styles.phrase}>{phrase.p}</div>
        <p className={styles.small}>{phrase.ru}</p>
        <p className={styles.example}>{phrase.ex}</p>
      </Card>
    </div>
  );
};
