import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { isDue, INTERVALS } from "@/shared/lib/srs";
import { speak } from "@/shared/lib/speech";
import { CARD_DECKS, cardKey, type FlipCard } from "@/shared/data/cards";
import { Button, Card, Input, Label, PageHead, Tag } from "@/shared/ui";
import styles from "./WordsPage.module.css";

export const WordsPage = () => {
  const t = useT();
  const words = useAppStore((s) => s.words);
  const addWord = useAppStore((s) => s.addWord);
  const removeWord = useAppStore((s) => s.removeWord);
  const gradeWord = useAppStore((s) => s.gradeWord);
  const cardBox = useAppStore((s) => s.cardBox);
  const cardDue = useAppStore((s) => s.cardDue);
  const gradeCard = useAppStore((s) => s.gradeCard);
  const resetDeck = useAppStore((s) => s.resetDeck);

  const [deckId, setDeckId] = useState("mine");
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

  const due = useMemo(() => words.filter((w) => isDue(w.due)), [words]);
  const rest = useMemo(
    () => words.filter((w) => !isDue(w.due)).sort((a, b) => a.due - b.due),
    [words]
  );
  const card = due[0];

  const deck = CARD_DECKS.find((d) => d.id === deckId);
  /** карточки набора, у которых подошёл срок; новые идут первыми */
  const deckQueue = useMemo<FlipCard[]>(() => {
    if (!deck) return [];
    return deck.cards.filter((c) => isDue(cardDue[cardKey(deck.id, c.f)]));
  }, [deck, cardDue]);
  const flip = deckQueue[0];
  const flipBox = flip && deck ? cardBox[cardKey(deck.id, flip.f)] ?? 0 : 0;
  const deckLearned = deck
    ? deck.cards.filter((c) => (cardBox[cardKey(deck.id, c.f)] ?? 0) > 0).length
    : 0;

  const submit = () => {
    if (!word.trim()) return;
    addWord(word, translation);
    setWord("");
    setTranslation("");
  };

  const mark = (remembered: boolean) => {
    if (!deck || !flip) return;
    gradeCard(cardKey(deck.id, flip.f), remembered);
    setFlipped(false);
  };

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("слова")}
        lead={t("Своя колода и готовые наборы карточек: смотришь на лицо, вспоминаешь, переворачиваешь и отмечаешь себя.")}
        aside={<Tag>{deck ? `${deckLearned}/${deck.cards.length}` : `${due.length} / ${words.length}`}</Tag>}
      />

      <div className={styles.decks}>
        <button
          type="button"
          className={deckId === "mine" ? styles.deckOn : styles.deck}
          onClick={() => setDeckId("mine")}
        >
          {`${t("мои слова")} · ${words.length}`}
        </button>
        {CARD_DECKS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={deckId === d.id ? styles.deckOn : styles.deck}
            onClick={() => {
              setDeckId(d.id);
              setFlipped(false);
            }}
          >
            {t(d.label)}
          </button>
        ))}
      </div>

      {deck ? (
        <>
          <p className={styles.deckDesc}>{t(deck.desc)}</p>

          {flip ? (
            <>
              <Card flat className={styles.flipCard} onPress={() => setFlipped((v) => !v)}>
                <div className={styles.flipHead}>
                  <Label>{`${t("шаг")} ${flipBox + 1}/${INTERVALS.length}`}</Label>
                  <span className={styles.counter}>{`${t("на повторение")}: ${deckQueue.length}`}</span>
                </div>

                <div className={styles.face}>{flip.f}</div>

                {flipped ? (
                  <>
                    <div className={styles.back}>{flip.b}</div>
                    {flip.ex ? <p className={styles.ex}>{flip.ex}</p> : null}
                  </>
                ) : (
                  <p className={styles.tapHint}>{t("нажми на карточку, чтобы перевернуть")}</p>
                )}

                <div className={styles.flipActions}>
                  <button
                    type="button"
                    className={styles.speak}
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(flip.f);
                    }}
                  >
                    {t("звук")}
                  </button>
                  {flipped ? (
                    <>
                      <Button
                        variant="positive"
                        onClick={(e) => {
                          e.stopPropagation();
                          mark(true);
                        }}
                      >
                        {t("помню")}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          mark(false);
                        }}
                      >
                        {t("не помню")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                    >
                      {t("перевернуть")}
                    </Button>
                  )}
                </div>
              </Card>
              <p className={styles.srsNote}>
                {t("«помню» отодвигает карточку дальше, «не помню» возвращает её на завтра.")}
              </p>
            </>
          ) : (
            <Card tone="accent">
              <Label>{t("набор пройден")}</Label>
              <p className={styles.empty}>
                {t("Карточки вернутся по расписанию: сначала через день, потом реже.")}
              </p>
              <div className={styles.actions}>
                <Button onClick={() => resetDeck(deck.id)}>{t("начать набор заново")}</Button>
              </div>
            </Card>
          )}
        </>
      ) : (
        <>
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
          ) : (
            <Card tone="accent">
              <Label>{t("колода пока пуста")}</Label>
              <p className={styles.empty}>
                {t("Добавляй сюда слова, которые встретил сам — с переводом и своим примером. А пока можно взять готовый набор карточек.")}
              </p>
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  onClick={() => {
                    setDeckId("verbs");
                    setFlipped(false);
                  }}
                >
                  {t("неправильные глаголы")}
                </Button>
                <Button
                  onClick={() => {
                    setDeckId("words");
                    setFlipped(false);
                  }}
                >
                  {t("слово → перевод")}
                </Button>
              </div>
            </Card>
          )}

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
        </>
      )}
    </div>
  );
};
