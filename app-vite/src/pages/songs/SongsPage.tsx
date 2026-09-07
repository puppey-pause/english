import { useT } from "@/shared/i18n/useT";
import { SONGS } from "@/shared/data/songs";
import { Card, Label, PageHead, Tag } from "@/shared/ui";
import styles from "./SongsPage.module.css";

const STEPS = [
  "Послушай целиком без текста. Задача одна: поймать общее настроение и пару знакомых фраз.",
  "Послушай второй раз с текстом перед глазами — найди места, где слова слипаются и ты их не расслышал.",
  "Выпиши три фразы, которые захотелось сказать самому, и занеси их в раздел «Слова» — они вернутся на повторение.",
];

const search = (q: string): string => `https://www.google.com/search?q=${encodeURIComponent(q)}`;

export const SongsPage = () => {
  const t = useT();

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("песни")}
        lead={t("Десять песен, по которым слышно живую речь. К каждой — зачем она и что в ней слушать.")}
        aside={<Tag plain>{`${SONGS.length} ${t("в списке")}`}</Tag>}
      />

      <Card tone="warn">
        <Label>{t("как слушать")}</Label>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step}>{t(step)}</li>
          ))}
        </ol>
      </Card>

      <div className={styles.grid}>
        {SONGS.map((song) => (
          <Card key={song.id}>
            <Label>{`${song.a}${song.y ? ` · ${song.y}` : ""}`}</Label>
            <h3 className={styles.title}>{song.t}</h3>
            <p className={styles.why}>{t(song.n)}</p>
            {song.tags.length ? (
              <div className={styles.tags}>
                {song.tags.map((tag) => (
                  <Tag key={tag} plain>
                    {t(tag)}
                  </Tag>
                ))}
              </div>
            ) : null}
            <div className={styles.links}>
              <a href={search(`${song.a} ${song.t}`)} target="_blank" rel="noreferrer">
                {t("послушать")}
              </a>
              <a href={search(`${song.a} ${song.t} lyrics`)} target="_blank" rel="noreferrer">
                {t("найти текст")}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
