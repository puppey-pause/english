import { useEffect, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { SECTION_TREE, isSectionId, sectionOf, type ViewId } from "@/shared/config";
import styles from "./TabBar.module.css";

/** Нижняя панель на телефоне: «сегодня» и четыре раздела. Подразделы — в строке чипов. */
export const TabBar = () => {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  /** панель прячется, пока листаешь вниз, и возвращается при движении вверх */
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 90);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: ViewId) => {
    setView(id);
    setHidden(false);
  };

  const openSection = isSectionId(view) ? view : sectionOf(view)?.id;

  return (
    <nav className={hidden ? styles.barHidden : styles.bar} aria-label={t("разделы")}>
      <button type="button" className={view === "today" ? styles.itemOn : styles.item} onClick={() => go("today")}>
        {t("сегодня")}
      </button>
      {SECTION_TREE.map((section) => (
        <button
          key={section.id}
          type="button"
          className={openSection === section.id ? styles.itemOn : styles.item}
          onClick={() => go(section.id)}
        >
          {t(section.short)}
        </button>
      ))}
    </nav>
  );
};
