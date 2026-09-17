import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { TABS, type ViewId } from "@/shared/config";
import styles from "./Nav.module.css";

const GROUPS: { id: "main" | "learn" | "practice" | "ref" | "track"; label: string }[] = [
  { id: "main", label: "сегодня" },
  { id: "learn", label: "учёба" },
  { id: "practice", label: "практика" },
  { id: "ref", label: "справочник" },
  { id: "track", label: "прогресс" },
];

export const Nav = () => {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  const item = (id: ViewId, label: string) => (
    <button
      key={id}
      type="button"
      className={[styles.item, view === id && styles.active].filter(Boolean).join(" ")}
      onClick={() => setView(id)}
    >
      {t(label)}
    </button>
  );

  return (
    <nav className={styles.nav}>
      {GROUPS.map((group) => (
        <div key={group.id} className={styles.group}>
          <span className={styles.groupLabel}>{t(group.label)}</span>
          {TABS.filter((tab) => tab.group === group.id).map((tab) => item(tab.id, tab.label))}
        </div>
      ))}
    </nav>
  );
};
