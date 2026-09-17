import { useEffect, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { Input } from "@/shared/ui";
import { LanguageSwitch } from "@/features/language-switch";
import { ThemeSwitch } from "@/features/theme-switch";
import { SpeechSwitch } from "@/features/speech-switch";
import styles from "./ToolsSheet.module.css";

/** Поиск и настройки на телефоне: кнопка в шапке, лист снизу. */
export const ToolsSheet = () => {
  const t = useT();
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** во весь экран: браузерная строка уезжает и экрана становится больше */
  const fullscreen = () => {
    const el = document.documentElement;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) void el.requestFullscreen().catch(() => undefined);
    setOpen(false);
  };

  return (
    <div className={styles.host}>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)} aria-expanded={open}>
        {t("поиск и настройки")}
      </button>

      {open ? (
        <div className={styles.sheetWrap} role="dialog" aria-modal="true">
          <button type="button" className={styles.backdrop} aria-label={t("закрыть")} onClick={() => setOpen(false)} />
          <div className={styles.sheet}>
            <div className={styles.sheetHead}>
              <span className={styles.sheetTitle}>{t("поиск и настройки")}</span>
              <button type="button" className={styles.close} onClick={() => setOpen(false)}>
                {t("закрыть")}
              </button>
            </div>
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
        </div>
      ) : null}
    </div>
  );
};
