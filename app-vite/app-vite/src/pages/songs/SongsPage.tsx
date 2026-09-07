import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { SONGS } from "@/shared/data/songs";
import { speak } from "@/shared/lib/speech";
import { Button, Card, Chip, DashedInput, Input, Label, PageHead, Tag, Textarea } from "@/shared/ui";
import styles from "./SongsPage.module.css";

export const SongsPage = () => {
  const t = useT();
  const songWork = useAppStore((s) => s.songWork);
  const ownSongs = useAppStore((s) => s.ownSongs);
  const splitLyrics = useAppStore((s) => s.splitLyrics);
  const setSongLine = useAppStore((s) => s.setSongLine);
  const resetLyrics = useAppStore((s) => s.resetLyrics);
  const addOwnSong = useAppStore((s) => s.addOwnSong);

  const all = useMemo(() => [...SONGS, ...ownSongs], [ownSongs]);
  const [id, setId] = useState(all[0]?.id ?? "");
  const [raw, setRaw] = useState("");
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const song = all.find((s) => s.id === id) ?? all[0];
  const work = song ? songWork[song.id] : undefined;
  const lines = work?.lines ?? [];

  if (!song) return null;

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("песни")}
        lead={t("Разбор по строкам: свой перевод рядом с оригиналом застревает в памяти лучше готового.")}
        aside={<Tag plain>{`${all.length} ${t("в списке")}`}</Tag>}
      />

      <div className={styles.tabs}>
        {all.map((s) => (
          <Chip key={s.id} label={`${s.a} — ${s.t}`} active={s.id === song.id} onClick={() => setId(s.id)} />
        ))}
      </div>

      <Card tone="accent">
        <Label>{`${song.a}${song.y ? ` · ${song.y}` : ""}`}</Label>
        <h3 className={styles.title}>{song.t}</h3>
        {song.n ? <p className={styles.why}>{t(song.n)}</p> : null}
        {song.tags.length ? (
          <div className={styles.tags}>
            {song.tags.map((tag) => (
              <Tag key={tag} plain>
                {t(tag)}
              </Tag>
            ))}
          </div>
        ) : null}
      </Card>

      {!lines.length ? (
        <Card flat>
          <Label>{t("вставь текст песни")}</Label>
          <p className={styles.hint}>
            {t("Скопируй текст из любого источника — он разобьётся на строки, и у каждой появится поле для перевода.")}
          </p>
          <Textarea
            rows={6}
            value={raw}
            placeholder={t("одна строка песни — одна строка здесь")}
            onChange={(e) => setRaw(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={() => {
              splitLyrics(song.id, raw);
              setRaw("");
            }}
          >
            {t("разобрать по строкам")}
          </Button>
        </Card>
      ) : (
        <>
          <div className={styles.lineHead}>
            <Label section>{`${t("строк")}: ${lines.length}`}</Label>
            <Button onClick={() => resetLyrics(song.id)}>{t("другой текст")}</Button>
          </div>

          <Card flat>
            <div className={styles.lines}>
              {lines.map((line, i) => (
                <div key={`${line}-${i}`} className={styles.line}>
                  <div className={styles.original}>
                    <span className={styles.lineNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.lineText}>{line}</span>
                    <button type="button" className={styles.speak} onClick={() => speak(line)}>
                      {t("звук")}
                    </button>
                  </div>
                  <div className={styles.fields}>
                    <DashedInput
                      value={work?.tr[i] ?? ""}
                      placeholder={t("свой перевод")}
                      onChange={(e) => setSongLine(song.id, "tr", i, e.target.value)}
                    />
                    <DashedInput
                      value={work?.nb[i] ?? ""}
                      placeholder={t("заметка: сленг, время, слипание")}
                      onChange={(e) => setSongLine(song.id, "nb", i, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <Card flat>
        <Label>{t("своя песня")}</Label>
        <div className={styles.addForm}>
          <Input value={artist} placeholder={t("исполнитель")} onChange={(e) => setArtist(e.target.value)} />
          <Input value={title} placeholder={t("название")} onChange={(e) => setTitle(e.target.value)} />
          <Button
            variant="primary"
            onClick={() => {
              if (!artist.trim()) return;
              const newId = addOwnSong(artist, title);
              setArtist("");
              setTitle("");
              setId(newId);
            }}
          >
            {t("добавить")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
