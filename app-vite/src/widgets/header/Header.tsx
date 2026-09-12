import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { Input } from "@/shared/ui";
import { LanguageSwitch } from "@/features/language-switch";
import { ThemeSwitch } from "@/features/theme-switch";
import { SpeechSwitch } from "@/features/speech-switch";
import styles from "./Header.module.css";

export const Header = () => {
  const t = useT();
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);
  const level = useAppStore((s) => s.level);

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{t("Английский по шагам")}</h1>
        {level ? <span className={styles.level}>{`${t("уровень")} ${level}`}</span> : null}
      </div>
      <div className={styles.tools}>
        <Input
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("поиск по темам")}
          aria-label={t("поиск по темам")}
        />
        <SpeechSwitch />
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
};
