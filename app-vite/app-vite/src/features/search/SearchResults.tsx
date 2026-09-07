import { useMemo } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { TOPICS } from "@/entities/stage";
import { SECTIONS } from "@/shared/config/sections";
import { SLANG } from "@/shared/data/slang";
import { Card, Label } from "@/shared/ui";
import styles from "./SearchResults.module.css";

interface Hit {
  key: string;
  num: string;
  name: string;
  layer: string;
  desc: string;
  go: () => void;
}

export const SearchResults = () => {
  const t = useT();
  const query = useAppStore((s) => s.query);
  const setView = useAppStore((s) => s.setView);
  const setOpenTopic = useAppStore((s) => s.setOpenTopic);
  const setQuery = useAppStore((s) => s.setQuery);

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const sections: Hit[] = SECTIONS.filter((s) =>
      `${s.label} ${s.desc} ${s.keywords}`.toLowerCase().includes(q)
    ).map((s) => ({
      key: `section:${s.label}`,
      num: "→",
      name: t(s.label),
      layer: t("раздел"),
      desc: t(s.desc),
      go: () => {
        setQuery("");
        setView(s.view);
      },
    }));

    const slang: Hit[] = SLANG.filter((s) =>
      `${s.p} ${s.ru} ${s.ex} ${s.catRu}`.toLowerCase().includes(q)
    )
      .slice(0, 8)
      .map((s) => ({
        key: `slang:${s.p}`,
        num: "·",
        name: s.p,
        layer: t(s.catRu),
        desc: s.ru,
        go: () => {
          setQuery("");
          setView("ref");
        },
      }));

    const topics: Hit[] = TOPICS.filter((tp) =>
      `${tp.name} ${tp.desc} ${tp.crit} ${tp.layer}`.toLowerCase().includes(q)
    )
      .slice(0, 24)
      .map((tp) => ({
        key: `topic:${tp.k}`,
        num: tp.snum,
        name: t(tp.name),
        layer: t(tp.layer),
        desc: t(tp.desc),
        go: () => {
          setQuery("");
          setOpenTopic(tp.k);
          setView("learn", Number(tp.snum) - 1);
        },
      }));

    return [...sections, ...slang, ...topics];
  }, [query, t, setQuery, setView, setOpenTopic]);

  if (!hits.length) {
    return <p className={styles.empty}>{t("Ничего не нашлось. Попробуй другое слово.")}</p>;
  }

  return (
    <div className={styles.wrap}>
      {hits.map((hit) => (
        <Card key={hit.key} onPress={hit.go}>
          <div className={styles.row}>
            <span className={styles.num}>{hit.num}</span>
            <div>
              <Label>{hit.layer}</Label>
              <div className={styles.name}>{hit.name}</div>
              <div className={styles.desc}>{hit.desc}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
