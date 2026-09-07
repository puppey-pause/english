import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { CATEGORIES, CATEGORY_LABEL, categorise } from "@/entities/mistake";
import type { MistakeCategory } from "@/entities/mistake";
import { isDue } from "@/shared/lib/srs";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Chip, Input, Label, PageHead, Tag } from "@/shared/ui";
import styles from "./MistakesPage.module.css";

export const MistakesPage = () => {
  const t = useT();
  const mistakes = useAppStore((s) => s.mistakes);
  const addMistake = useAppStore((s) => s.addMistake);
  const removeMistake = useAppStore((s) => s.removeMistake);
  const gradeMistake = useAppStore((s) => s.gradeMistake);

  const [said, setSaid] = useState("");
  const [right, setRight] = useState("");
  const [why, setWhy] = useState("");
  const [filter, setFilter] = useState<MistakeCategory | "все">("все");

  const due = useMemo(() => mistakes.filter((m) => isDue(m.due)), [mistakes]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const m of mistakes) {
      const c = m.c ?? categorise(m.n);
      acc[c] = (acc[c] ?? 0) + 1;
    }
    return acc;
  }, [mistakes]);

  const shown = useMemo(
    () => (filter === "все" ? mistakes : mistakes.filter((m) => (m.c ?? categorise(m.n)) === filter)),
    [mistakes, filter]
  );

  const submit = () => {
    if (!said.trim() || !right.trim()) return;
    addMistake(said, right, why);
    setSaid("");
    setRight("");
    setWhy("");
  };

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("журнал ошибок")}
        lead={t("Ошибка становится полезной, когда записана вместе с правильным вариантом и причиной.")}
        aside={<Tag>{`${due.length} ${t("на разбор")}`}</Tag>}
      />

      <Card flat>
        <Label>{t("новая запись")}</Label>
        <div className={styles.form}>
          <Input value={said} placeholder={t("как сказал")} onChange={(e) => setSaid(e.target.value)} />
          <Input value={right} placeholder={t("как правильно")} onChange={(e) => setRight(e.target.value)} />
          <Input value={why} placeholder={t("почему")} onChange={(e) => setWhy(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <Button variant="primary" onClick={submit}>
            {t("записать")}
          </Button>
        </div>
      </Card>

      {mistakes.length ? (
        <div className={styles.filters}>
          <Chip label={`${t("все")} ${mistakes.length}`} active={filter === "все"} onClick={() => setFilter("все")} />
          {CATEGORIES.filter((c) => counts[c.id]).map((c) => (
            <Chip
              key={c.id}
              label={`${t(c.label)} ${counts[c.id]}`}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            />
          ))}
        </div>
      ) : (
        <Card flat>
          <p className={styles.empty}>
            {t("Журнал пуст. Записи появятся сами, когда промахнёшься в тренажёре или в тесте.")}
          </p>
        </Card>
      )}

      <div className={styles.list}>
        {shown.map((m) => {
          const category = m.c ?? categorise(m.n);
          const ready = isDue(m.due);
          return (
            <Card key={m.s} tone={ready ? "accent" : "default"}>
              <div className={styles.head}>
                <Label>{`${t(CATEGORY_LABEL[category])} · ${m.date.slice(0, 10)}`}</Label>
                <button type="button" className={styles.remove} onClick={() => removeMistake(m.s)}>
                  ×
                </button>
              </div>
              <div className={styles.bad}>{m.s}</div>
              <div className={styles.good}>
                {m.r}
                <button type="button" className={styles.speak} onClick={() => speak(m.r)}>
                  {t("звук")}
                </button>
              </div>
              {m.n ? <p className={styles.why}>{t(m.n)}</p> : null}
              {ready ? (
                <div className={styles.actions}>
                  <Button variant="positive" onClick={() => gradeMistake(m.s, true)}>
                    {t("больше не путаю")}
                  </Button>
                  <Button variant="danger" onClick={() => gradeMistake(m.s, false)}>
                    {t("ещё путаю")}
                  </Button>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
