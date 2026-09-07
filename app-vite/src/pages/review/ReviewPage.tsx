import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { TOPICS } from "@/entities/stage";
import { isDue, INTERVALS } from "@/shared/lib/srs";
import { LAYER_COLOR } from "@/shared/config";
import { Button, Card, Label, PageHead, Tag } from "@/shared/ui";
import styles from "./ReviewPage.module.css";

const dueLabel = (due: number | undefined, t: (s: string) => string): string => {
  if (!due) return t("не в расписании");
  const days = Math.round((due - Date.now()) / 86_400_000);
  if (days <= 0) return t("сегодня");
  if (days === 1) return t("завтра");
  return `${t("через")} ${days} ${t("дн.")}`;
};

export const ReviewPage = () => {
  const t = useT();
  const done = useAppStore((s) => s.done);
  const rev = useAppStore((s) => s.rev);
  const box = useAppStore((s) => s.box);
  const gradeTopic = useAppStore((s) => s.gradeTopic);
  const setView = useAppStore((s) => s.setView);
  const setOpenTopic = useAppStore((s) => s.setOpenTopic);

  const tracked = TOPICS.filter((tp) => done[tp.k]);
  const due = tracked.filter((tp) => isDue(rev[tp.k]));
  const later = tracked
    .filter((tp) => !isDue(rev[tp.k]))
    .sort((a, b) => (rev[a.k] ?? 0) - (rev[b.k] ?? 0))
    .slice(0, 12);

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("повторение")}
        lead={t("Пройденные темы возвращаются по расписанию: 1, 3, 7, 16, 35 и 70 дней.")}
        aside={<Tag>{`${due.length} ${t("сегодня")}`}</Tag>}
      />

      {!tracked.length ? (
        <Card flat>
          <p className={styles.empty}>{t("Пока нечего повторять — отметь первую тему пройденной в разделе «учёба».")}</p>
          <Button variant="primary" onClick={() => setView("learn")}>
            {t("перейти к учёбе")}
          </Button>
        </Card>
      ) : null}

      {due.map((topic) => (
        <Card key={topic.k} tone="accent">
          <div className={styles.row}>
            <span className={styles.dot} style={{ background: LAYER_COLOR[topic.layer] }} aria-hidden />
            <div className={styles.body}>
              <Label>{`${topic.snum} · ${t(topic.layer)} · ${t("шаг")} ${(box[topic.k] ?? 0) + 1}/${INTERVALS.length}`}</Label>
              <div className={styles.name}>{t(topic.name)}</div>
              <p className={styles.crit}>{t(topic.crit)}</p>
              <div className={styles.actions}>
                <Button variant="positive" onClick={() => gradeTopic(topic.k, true)}>
                  {t("помню")}
                </Button>
                <Button variant="danger" onClick={() => gradeTopic(topic.k, false)}>
                  {t("забыл")}
                </Button>
                <Button
                  onClick={() => {
                    setOpenTopic(topic.k);
                    setView("learn", Number(topic.snum) - 1);
                  }}
                >
                  {t("открыть разбор")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {later.length ? (
        <>
          <Label section>{t("дальше по расписанию")}</Label>
          <Card flat>
            <div className={styles.queue}>
              {later.map((topic) => (
                <div key={topic.k} className={styles.queueRow}>
                  <span className={styles.dot} style={{ background: LAYER_COLOR[topic.layer] }} aria-hidden />
                  <span className={styles.queueName}>{t(topic.name)}</span>
                  <span className={styles.when}>{dueLabel(rev[topic.k], t)}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
