import { useState } from "react";
import { useT } from "@/shared/i18n/useT";
import { SITU } from "@/shared/data/situations";
import { speak } from "@/shared/lib/speech";
import { Card, Chip, Label, PageHead } from "@/shared/ui";
import styles from "./SituationsPage.module.css";

type Block = { key: "say" | "hear" | "words"; label: string };

const BLOCKS: Block[] = [
  { key: "say", label: "что сказать" },
  { key: "hear", label: "что услышишь" },
  { key: "words", label: "слова" },
];

export const SituationsPage = () => {
  const t = useT();
  const [id, setId] = useState(SITU[0].id);
  const situation = SITU.find((s) => s.id === id) ?? SITU[0];

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("ситуации")}
        lead={t("Готовые фразы для мест, где думать некогда: отель, кафе, врач, аэропорт.")}
      />

      <div className={styles.tabs}>
        {SITU.map((s) => (
          <Chip key={s.id} label={t(s.n)} active={s.id === id} onClick={() => setId(s.id)} />
        ))}
      </div>

      <Card tone="accent">
        <Label>{t(situation.n)}</Label>
        <p className={styles.intro}>{t(situation.intro)}</p>
      </Card>

      {BLOCKS.map((block) => (
        <div key={block.key}>
          <Label section>{t(block.label)}</Label>
          <Card flat>
            <div className={styles.lines}>
              {situation[block.key].map(([en, ru], i) => (
                <div key={`${i}-${en}`} className={styles.line}>
                  <div className={styles.en}>
                    <span>{en}</span>
                    <button type="button" className={styles.speak} onClick={() => speak(en)}>
                      {t("звук")}
                    </button>
                  </div>
                  <p className={styles.ru}>{t(ru)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}

      {situation.tips.length ? (
        <Card tone="warn">
          <Label>{t("на что смотреть")}</Label>
          <ul className={styles.tips}>
            {situation.tips.map((tip) => (
              <li key={tip}>{t(tip)}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
};
