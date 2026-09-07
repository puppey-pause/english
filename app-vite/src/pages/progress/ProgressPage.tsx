import { useMemo } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { STAGES, TOPICS } from "@/entities/stage";
import { CATEGORIES, CATEGORY_LABEL, categorise } from "@/entities/mistake";
import { CEFR6, LAYERS, LAYER_COLOR } from "@/shared/config";
import { durationInWeeks, plural } from "@/shared/lib/format";
import { isDue } from "@/shared/lib/srs";
import { Card, Label, PageHead, ProgressBar, Tag } from "@/shared/ui";
import { Backup } from "@/features/backup";
import styles from "./ProgressPage.module.css";

export const ProgressPage = () => {
  const t = useT();
  const done = useAppStore((s) => s.done);
  const rev = useAppStore((s) => s.rev);
  const notes = useAppStore((s) => s.notes);
  const words = useAppStore((s) => s.words);
  const mistakes = useAppStore((s) => s.mistakes);
  const setView = useAppStore((s) => s.setView);

  const doneCount = TOPICS.filter((tp) => done[tp.k]).length;
  const percent = Math.round((doneCount / TOPICS.length) * 100);

  const byLayer = LAYERS.map((layer) => {
    const all = TOPICS.filter((tp) => tp.layer === layer);
    return { layer, all: all.length, done: all.filter((tp) => done[tp.k]).length };
  });

  const byLevel = CEFR6.map((level) => {
    const stages = STAGES.filter((s) => s.level === level);
    const all = stages.flatMap((s) => s.topics);
    return { level, all: all.length, done: all.filter((tp) => done[tp.k]).length };
  });

  /** weeks of the plan still ahead, from the stage durations */
  const weeksLeft = useMemo(
    () =>
      Math.round(
        STAGES.filter((s) => s.topics.some((tp) => !done[tp.k])).reduce(
          (acc, s) => acc + durationInWeeks(s.time),
          0
        )
      ),
    [done]
  );

  const mistakeCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const m of mistakes) {
      const c = m.c ?? categorise(m.n);
      acc[c] = (acc[c] ?? 0) + 1;
    }
    return acc;
  }, [mistakes]);

  const dueTopics = TOPICS.filter((tp) => done[tp.k] && isDue(rev[tp.k])).length;
  const noteCount = Object.values(notes).filter((n) => n.trim()).length;

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("прогресс")}
        lead={t("Цифры без украшений: сколько тем закрыто, где пусто и что ждёт повторения.")}
        aside={<Tag>{`${weeksLeft} ${t(plural(weeksLeft, "неделя", "недели", "недель"))} ${t("до конца пути")}`}</Tag>}
      />

      <Card tone="accent">
        <Label>{t("весь путь")}</Label>
        <div className={styles.big}>{`${percent}%`}</div>
        <ProgressBar value={percent} />
        <p className={styles.meta}>
          {`${doneCount} ${t("из")} ${TOPICS.length} ${t(plural(TOPICS.length, "тема", "темы", "тем"))} · ${STAGES.length} ${t(plural(STAGES.length, "этап", "этапа", "этапов"))}`}
        </p>
      </Card>

      <div className={styles.cards}>
        <Card onPress={() => setView("review")}>
          <Label>{t("к повторению")}</Label>
          <div className={styles.num}>{dueTopics}</div>
        </Card>
        <Card onPress={() => setView("words")}>
          <Label>{t("слов в колоде")}</Label>
          <div className={styles.num}>{words.length}</div>
        </Card>
        <Card onPress={() => setView("errors")}>
          <Label>{t("записей об ошибках")}</Label>
          <div className={styles.num}>{mistakes.length}</div>
        </Card>
        <Card onPress={() => setView("learn")}>
          <Label>{t("своих заметок")}</Label>
          <div className={styles.num}>{noteCount}</div>
        </Card>
      </div>

      <Label section>{t("по слоям")}</Label>
      <Card flat>
        <div className={styles.bars}>
          {byLayer.map((x) => (
            <div key={x.layer} className={styles.barRow}>
              <span className={styles.barName}>
                <span className={styles.dot} style={{ background: LAYER_COLOR[x.layer] }} aria-hidden />
                {t(x.layer)}
              </span>
              <span className={styles.bar}>
                <span
                  className={styles.barFill}
                  style={{ width: `${(x.done / Math.max(x.all, 1)) * 100}%`, background: LAYER_COLOR[x.layer] }}
                />
              </span>
              <span className={styles.barNum}>{`${x.done}/${x.all}`}</span>
            </div>
          ))}
        </div>
      </Card>

      <Label section>{t("по уровням")}</Label>
      <Card flat>
        <div className={styles.bars}>
          {byLevel.map((x) => (
            <div key={x.level} className={styles.barRow}>
              <span className={styles.barName}>{x.level}</span>
              <span className={styles.bar}>
                <span className={styles.barFill} style={{ width: `${(x.done / Math.max(x.all, 1)) * 100}%` }} />
              </span>
              <span className={styles.barNum}>{`${x.done}/${x.all}`}</span>
            </div>
          ))}
        </div>
      </Card>

      <Label section>{t("перенос и сброс")}</Label>
      <Backup />

      {mistakes.length ? (
        <>
          <Label section>{t("ошибки по видам")}</Label>
          <Card flat>
            <div className={styles.chips}>
              {CATEGORIES.filter((c) => mistakeCounts[c.id]).map((c) => (
                <span key={c.id} className={styles.chip}>
                  {`${t(CATEGORY_LABEL[c.id])} · ${mistakeCounts[c.id]}`}
                </span>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
