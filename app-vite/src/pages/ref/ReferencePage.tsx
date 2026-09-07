import { useMemo, useState } from "react";
import { useT } from "@/shared/i18n/useT";
import { GLOSS, PAIRS, SHEETS } from "@/shared/data/reference";
import { SLANG, SLCATS, SLCOLOR } from "@/shared/data/slang";
import { speak } from "@/shared/lib/speech";
import { Card, Chip, Input, Label, PageHead } from "@/shared/ui";
import styles from "./ReferencePage.module.css";

type Section = "sheets" | "slang" | "pairs" | "gloss";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "sheets", label: "памятки" },
  { id: "slang", label: "сленг" },
  { id: "pairs", label: "пары слов" },
  { id: "gloss", label: "глоссарий" },
];

export const ReferencePage = () => {
  const t = useT();
  const [section, setSection] = useState<Section>("sheets");
  const [sheet, setSheet] = useState(0);
  const [slangCat, setSlangCat] = useState(SLCATS[0][0]);
  const [find, setFind] = useState("");

  const current = SHEETS[sheet];
  const slang = useMemo(() => SLANG.filter((s) => s.cat === slangCat), [slangCat]);
  const gloss = useMemo(() => {
    const q = find.trim().toLowerCase();
    return q ? GLOSS.filter((g) => `${g.t} ${g.d}`.toLowerCase().includes(q)) : GLOSS;
  }, [find]);

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("справочник")}
        lead={t("Всё, к чему возвращаются: таблицы, живой разговорный, пары похожих слов и термины.")}
      />

      <div className={styles.tabs}>
        {SECTIONS.map((s) => (
          <Chip key={s.id} label={t(s.label)} active={section === s.id} onClick={() => setSection(s.id)} />
        ))}
      </div>

      {section === "sheets" ? (
        <>
          <div className={styles.tabs}>
            {SHEETS.map((s, i) => (
              <Chip key={s.n} label={t(s.n)} active={i === sheet} onClick={() => setSheet(i)} />
            ))}
          </div>

          {current.notes?.length ? (
            <Card tone="warn">
              <Label>{t("как читать")}</Label>
              <ul className={styles.notes}>
                {current.notes.map((n) => (
                  <li key={n}>{t(n)}</li>
                ))}
              </ul>
            </Card>
          ) : null}

          {current.cards?.length ? (
            <div className={styles.cards}>
              {current.cards.map((card) => (
                <Card key={card.n}>
                  <Label>{card.f}</Label>
                  <h3 className={styles.cardName}>{t(card.n)}</h3>
                  <p className={styles.use}>{t(card.use)}</p>
                  <div className={styles.examples}>
                    {card.ex.map((ex, i) => (
                      <div key={`${i}-${ex}`} className={styles.example}>
                        <span>{ex}</span>
                        <button type="button" className={styles.speak} onClick={() => speak(ex)}>
                          {t("звук")}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className={styles.tr}>{t(card.tr)}</p>
                  <p className={styles.markers}>{card.mk}</p>
                  <p className={styles.nb}>{t(card.vs)}</p>
                </Card>
              ))}
            </div>
          ) : null}

          {current.rows?.length ? (
            <Card flat>
              <div className={styles.table}>
                {current.rows.map((row, i) => (
                  <div key={i} className={styles.tableRow}>
                    {row.map((cell, j) => (
                      <span key={`${j}-${cell}`} className={styles.cell}>
                        {cell}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </>
      ) : null}

      {section === "slang" ? (
        <>
          <div className={styles.tabs}>
            {SLCATS.map(([key, label]) => (
              <Chip key={key} label={t(label)} active={key === slangCat} onClick={() => setSlangCat(key)} />
            ))}
          </div>
          <div className={styles.cards}>
            {slang.map((s) => (
              <Card key={s.p}>
                <span className={styles.catDot} style={{ background: SLCOLOR[s.cat] }} aria-hidden />
                <div className={styles.phrase}>
                  <span>{s.p}</span>
                  <button type="button" className={styles.speak} onClick={() => speak(s.p)}>
                    {t("звук")}
                  </button>
                </div>
                <p className={styles.use}>{s.ru}</p>
                <p className={styles.nb}>{s.ex}</p>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {section === "pairs" ? (
        <div className={styles.cards}>
          {PAIRS.map((p) => (
            <Card key={`${p.a}-${p.b}`}>
              <div className={styles.pair}>
                <span>{p.a}</span>
                <span className={styles.vs}>vs</span>
                <span>{p.b}</span>
              </div>
              <p className={styles.use}>{t(p.w)}</p>
              <div className={styles.examples}>
                {p.e.map((ex, i) => (
                  <div key={`${i}-${ex}`} className={styles.example}>
                    <span>{ex}</span>
                    <button type="button" className={styles.speak} onClick={() => speak(ex)}>
                      {t("звук")}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {section === "gloss" ? (
        <>
          <Input value={find} placeholder={t("найти термин")} onChange={(e) => setFind(e.target.value)} />
          <Card flat>
            <div className={styles.glossList}>
              {gloss.map((g) => (
                <div key={g.t} className={styles.glossRow}>
                  <span className={styles.term}>{g.t}</span>
                  <p className={styles.def}>{t(g.d)}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
};
