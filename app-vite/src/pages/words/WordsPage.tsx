import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { isDue, INTERVALS } from "@/shared/lib/srs";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Input, Label, PageHead, Tag } from "@/shared/ui";
import styles from "./WordsPage.module.css";

export const WordsPage = () => {
  const t = useT();
  const words = useAppStore((s) => s.words);
  const addWord = useAppStore((s) => s.addWord);
  const removeWord = useAppStore((s) => s.removeWord);
  const gradeWord = useAppStore((s) => s.gradeWord);

  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);

  const due = useMemo(() => words.filter((w) => isDue(w.due)), [words]);
  const rest = useMemo(
    () => words.filter((w) => !isDue(w.due)).sort((a, b) => a.due - b.due),
    [words]
  );
  const card = due[0];

  const submit = () => {
    if (!word.trim()) return;
    addWord(word, translation);
    setWord("");
    setTranslation("");
  };

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("слова")}
        lead={t("Слово живёт в колоде вместе со своей фразой: в одиночку оно в речи не всплывает.")}
        aside={<Tag>{`${due.length} / ${words.length}`}</Tag>}
      />

      <Card flat>
        <Label>{t("новое слово")}</Label>
        <div className={styles.form}>
          <Input
            value={word}
            placeholder={t("слово или фраза")}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <Input
            value={translation}
            placeholder={t("свой перевод и пример")}
            onChange={(e) => setTranslation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <Button variant="primary" onClick={submit}>
            {t("добавить")}
          </Button>
        </div>
      </Card>

      {card ? (
        <Card tone="accent">
          <Label>{`${t("на повторение")} · ${t("шаг")} ${(card.box ?? 0) + 1}/${INTERVALS.length}`}</Label>
          <div className={styles.cardWord}>
            {card.w}
            <button type="button" className={styles.speak} onClick={() => speak(card.w)}>
              {t("звук")}
            </button>
          </div>
          {revealed === card.w ? (
            <p className={styles.translation}>{card.t || t("перевод не записан")}</p>
          ) : (
            <Button onClick={() => setRevealed(card.w)}>{t("показать перевод")}</Button>
          )}
          <div className={styles.actions}>
            <Button
              variant="positive"
              onClick={() => {
                gradeWord(card.w, true);
                setRevealed(null);
              }}
            >
              {t("помню")}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                gradeWord(card.w, false);
                setRevealed(null);
              }}
            >
              {t("забыл")}
            </Button>
          </div>
        </Card>
      ) : words.length ? (
        <Card flat>
          <p className={styles.empty}>{t("Колода повторена. Следующие слова вернутся по расписанию.")}</p>
        </Card>
      ) : null}

      {rest.length ? (
        <>
          <Label section>{t("в колоде")}</Label>
          <Card flat>
            <div className={styles.list}>
              {rest.map((w) => (
                <div key={w.w} className={styles.row}>
                  <span className={styles.rowWord}>{w.w}</span>
                  <span className={styles.rowTr}>{w.t}</span>
                  <span className={styles.box}>{`${(w.box ?? 0) + 1}/${INTERVALS.length}`}</span>
                  <button type="button" className={styles.remove} onClick={() => removeWord(w.w)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
