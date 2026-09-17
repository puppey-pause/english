import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { SECTION_TREE, sectionOf, isSectionId, type ViewId } from "@/shared/config";
import styles from "./Nav.module.css";

/** Боковое меню: раздел — заголовок-кнопка, под ним подразделы. */
export const Nav = () => {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const openSection = isSectionId(view) ? view : sectionOf(view)?.id;

  const go = (id: ViewId) => () => setView(id);

  return (
    <nav className={styles.nav}>
      <button
        type="button"
        className={[styles.item, styles.home, view === "today" && styles.active].filter(Boolean).join(" ")}
        onClick={go("today")}
      >
        {t("на сегодня")}
      </button>

      {SECTION_TREE.map((section) => (
        <div key={section.id} className={styles.group}>
          <button
            type="button"
            className={[styles.sectionBtn, openSection === section.id && styles.sectionOn].filter(Boolean).join(" ")}
            onClick={go(section.id)}
          >
            {t(section.label)}
          </button>
          {section.items.map((item) => (
            <button
              key={item.view}
              type="button"
              className={[styles.item, view === item.view && styles.active].filter(Boolean).join(" ")}
              onClick={go(item.view)}
            >
              {t(item.label)}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
};
