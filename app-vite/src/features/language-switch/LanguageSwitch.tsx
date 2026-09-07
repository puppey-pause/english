import { useAppStore } from "@/app/store";
import { LANGS } from "@/shared/i18n";
import styles from "./LanguageSwitch.module.css";

export const LanguageSwitch = () => {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);

  return (
    <div className={styles.row} role="group" aria-label="language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          className={[styles.button, lang === l.id && styles.active].filter(Boolean).join(" ")}
          onClick={() => setLang(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
