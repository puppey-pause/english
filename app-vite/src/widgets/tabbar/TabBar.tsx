import { useEffect, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { PHONE_TABS, TABS, type ViewId } from "@/shared/config";
import styles from "./TabBar.module.css";

const GROUPS: { id: "learn" | "practice" | "ref" | "track"; label: string }[] = [
  { id: "learn", label: "учёба" },
  { id: "practice", label: "практика" },
  { id: "ref", label: "справочник" },
  { id: "track", label: "прогресс" },
];

/** Нижняя панель на телефоне: четыре раздела и «ещё» со всем остальным. */
export const TabBar = () => {
  const t = useT();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const [open, setOpen] = useState(false);

  // закрываем лист по Escape — на телефоне это кнопка «назад» в браузере
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: ViewId) => {
    setView(id);
    setOpen(false);
  };

  const label = (id: ViewId) => TABS.find((tab) => tab.id === id)?.label ?? id;
  const inSheet = !PHONE_TABS.includes(view);

  return (
    <>
      {open ? (
        <div className={styles.sheetWrap} role="dialog" aria-modal="true">
          <button type="button" className={styles.backdrop} aria-label={t("закрыть")} onClick={() => setOpen(false)} />
          <div className={styles.sheet}>
            <div className={styles.sheetHead}>
              <span className={styles.sheetTitle}>{t("все разделы")}</span>
              <button type="button" className={styles.close} onClick={() => setOpen(false)}>
                {t("закрыть")}
              </button>
            </div>
            {GROUPS.map((group) => (
              <div key={group.id} className={styles.group}>
                <span className={styles.groupLabel}>{t(group.label)}</span>
                <div className={styles.groupItems}>
                  {TABS.filter((tab) => tab.group === group.id).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={tab.id === view ? styles.sheetItemOn : styles.sheetItem}
                      onClick={() => go(tab.id)}
                    >
                      {t(tab.label)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <nav className={styles.bar} aria-label={t("разделы")}>
        {PHONE_TABS.map((id) => (
          <button
            key={id}
            type="button"
            className={id === view ? styles.itemOn : styles.item}
            onClick={() => go(id)}
          >
            {t(label(id))}
          </button>
        ))}
        <button
          type="button"
          className={open || inSheet ? styles.itemOn : styles.item}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {inSheet && !open ? t(label(view)) : t("ещё")}
        </button>
      </nav>
    </>
  );
};
