import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { sectionById, type SectionId } from "@/shared/config";
import { Card, Label, PageHead } from "@/shared/ui";
import styles from "./SectionPage.module.css";

/** Обзор раздела: подразделы карточками — один клик до любого экрана внутри. */
export const SectionPage = ({ id }: { id: SectionId }) => {
  const t = useT();
  const setView = useAppStore((s) => s.setView);
  const section = sectionById(id);
  if (!section) return null;

  return (
    <div className={styles.wrap}>
      <PageHead title={t(section.label)} lead={t(section.lead)} />
      <div className={styles.grid}>
        {section.items.map((item, i) => (
          <Card key={item.view} onPress={() => setView(item.view)} className={styles.card}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <Label>{t(item.label)}</Label>
            <p className={styles.desc}>{t(item.desc)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
