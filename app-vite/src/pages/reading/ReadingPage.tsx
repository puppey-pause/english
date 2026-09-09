import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { READING } from "@/shared/data/reading";
import { CEFR6 } from "@/shared/config";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Chip, Label, PageHead, Tag, Textarea } from "@/shared/ui";
import styles from "./ReadingPage.module.css";

export const ReadingPage = () => {
  const t = useT();
  const notes = useAppStore((s) => s.notes);
  const setNote = useAppStore((s) => s.setNote);

  const [level, setLevel] = useState<string>("A1");
  const [id, setId] = useState<string>(READING[0].id);
  const [openAnswers, setOpenAnswers] = useState(false);

  const list = useMemo(() => READING.filter((r) => r.level === level), [level]);
  const text = list.find((r) => r.id === id) ?? list[0];
  const noteKey = `read:${text.id}`;

  const pick = (nextId: string) => {
    setId(nextId);
    setOpenAnswers(false);
  };

  const pickLevel = (next: string) => {
    setLevel(next);
    const first = READING.find((r) => r.level === next);
    if (first) pick(first.id);
  };

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("чтение")}
        lead={t("Тексты по уровням: сначала целиком без словаря, потом со словами внизу и вслух.")}
        aside={<Tag>{`${READING.length} ${t("текстов")}`}</Tag>}
      />

      <div className={styles.tabs}>
        {CEFR6.map((l) => (
          <Chip key={l} label={l} active={l === level} onClick={() => pickLevel(l)} />
        ))}
      </div>

      <div className={styles.tabs}>
        {list.map((r) => (
          <Chip key={r.id} label={r.title} active={r.id === text.id} onClick={() => pick(r.id)} />
        ))}
      </div>

      <Card tone="accent">
        <div className={styles.head}>
          <Label>{text.title}</Label>
          <span className={styles.meta}>{`${text.level} · ${text.words} ${t("слов")}`}</span>
        </div>
        <p className={styles.about}>{t(text.about)}</p>
      </Card>

      <div>
        <Label section>{t("до чтения")}</Label>
        <Card flat>
          <p className={styles.hint}>{t("Ответь на два вопроса своими словами — дальше текст читается вдвое легче.")}</p>
          <ul className={styles.pre}>
            {text.pre.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card flat>
        <div className={styles.body}>
          {text.body.map((p, i) => (
            <div key={i} className={styles.para}>
              <button type="button" className={styles.speak} onClick={() => speak(p)}>
                {t("звук")}
              </button>
              <p className={styles.p}>{p}</p>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <Label section>{t("слова из текста")}</Label>
        <Card flat>
          <div className={styles.lines}>
            {text.gloss.map(([w, ru]) => (
              <div key={w} className={styles.line}>
                <div className={styles.en}>
                  <span>{w}</span>
                  <button type="button" className={styles.speak} onClick={() => speak(w)}>
                    {t("звук")}
                  </button>
                </div>
                <p className={styles.ru}>{t(ru)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <Label section>{t("вопросы на понимание")}</Label>
        <Card flat>
          <ol className={styles.q}>
            {text.q.map(([question, model]) => (
              <li key={question}>
                <span className={styles.question}>{question}</span>
                {openAnswers ? <p className={styles.model}>{model}</p> : null}
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Button onClick={() => setOpenAnswers((v) => !v)}>
              {t(openAnswers ? "скрыть ответы" : "показать ответы")}
            </Button>
          </div>
        </Card>
      </div>

      <Card tone="warn">
        <Label>{t("после чтения")}</Label>
        <p className={styles.about}>{t(text.after)}</p>
        <div className={styles.field}>
          <Textarea
            rows={4}
            value={notes[noteKey] ?? ""}
            placeholder={t("твой ответ на задание")}
            onChange={(e) => setNote(noteKey, e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
};
