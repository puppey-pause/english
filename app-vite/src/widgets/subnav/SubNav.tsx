import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { isSectionId, sectionById, sectionOf } from "@/shared/config";
import styles from "./SubNav.module.css";

/**
 * Второй уровень на телефоне: строка чипов с подразделами текущего раздела.
 * На широком экране не показывается — там всё дерево в боковом меню.
 */
export const SubNav = () => {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  const sectionId = isSectionId(view) ? view : sectionOf(view)?.id;
  const section = sectionId ? sectionById(sectionId) : undefined;
  if (!section) return null;

  return (
    <div className={styles.row} role="tablist" aria-label={t(section.label)}>
      <button
        type="button"
        role="tab"
        aria-selected={view === section.id}
        className={view === section.id ? styles.chipOn : styles.chip}
        onClick={() => setView(section.id)}
      >
        {t("обзор")}
      </button>
      {section.items.map((item) => (
        <button
          key={item.view}
          type="button"
          role="tab"
          aria-selected={view === item.view}
          className={view === item.view ? styles.chipOn : styles.chip}
          onClick={() => setView(item.view)}
        >
          {t(item.short ?? item.label)}
        </button>
      ))}
    </div>
  );
};
