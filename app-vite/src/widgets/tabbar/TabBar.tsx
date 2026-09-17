import { useEffect, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { PHONE_TABS, TABS, type ViewId } from "@/shared/config";
import { Input } from "@/shared/ui";
import { LanguageSwitch } from "@/features/language-switch";
import { ThemeSwitch } from "@/features/theme-switch";
import { SpeechSwitch } from "@/features/speech-switch";
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
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);
  const [open, setOpen] = useState(false);
  /** панель прячется, пока листаешь вниз, и возвращается при движении вверх */
  const [hidden, setHidden] = useState(false);

  // закрываем лист по Escape — на телефоне это кнопка «назад» в браузере
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
    setOpen(false);
    setHidden(false);
  };

  /** во весь экран: браузерная строка уезжает и экрана становится больше */
  const fullscreen = () => {
    const el = document.documentElement;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) void el.requestFullscreen().catch(() => undefined);
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
            <div className={styles.tools}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("поиск по темам")}
                aria-label={t("поиск по темам")}
              />
              <div className={styles.toolRow}>
                <SpeechSwitch />
                <LanguageSwitch />
                <button type="button" className={styles.close} onClick={fullscreen}>
                  {t("во весь экран")}
                </button>
              </div>
              <ThemeSwitch />
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

      <nav className={hidden && !open ? styles.barHidden : styles.bar} aria-label={t("разделы")}>
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
