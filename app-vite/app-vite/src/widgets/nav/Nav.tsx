import { Fragment } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { TABS } from "@/shared/config";
import { Chip } from "@/shared/ui";
import styles from "./Nav.module.css";

const GROUPS = ["main", "learn", "practice", "track"] as const;

export const Nav = () => {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);

  return (
    <nav className={styles.nav}>
      {GROUPS.map((group, i) => (
        <Fragment key={group}>
          {i > 0 && <div className={styles.rule} aria-hidden />}
          <div className={styles.group}>
            {TABS.filter((tab) => tab.group === group).map((tab) => (
              <Chip
                key={tab.id}
                label={t(tab.label)}
                active={view === tab.id}
                onClick={() => setView(tab.id)}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </nav>
  );
};
