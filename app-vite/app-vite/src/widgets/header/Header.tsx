import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { Input } from "@/shared/ui";
import { LanguageSwitch } from "@/features/language-switch";
import { ThemeSwitch } from "@/features/theme-switch";
import styles from "./Header.module.css";

export const Header = () => {
  const t = useT();
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);

  return (
    <header className={styles.header}>
      <div className={styles.kicker}>{t("американский английский · путь до свободной речи")}</div>
      <h1 className={styles.title}>{t("Английский по шагам")}</h1>
      <div className={styles.tools}>
        <Input
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("поиск по темам")}
          aria-label={t("поиск по темам")}
        />
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
};
