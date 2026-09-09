import { useEffect } from "react";
import { useAppStore } from "@/app/store";
import { useHashRoute } from "@/app/routing/useHashRoute";
import { useHotkeys } from "@/app/routing/useHotkeys";
import { Router } from "@/app/routing/Router";
import { Header } from "@/widgets/header/Header";
import { Nav } from "@/widgets/nav/Nav";
import { SearchResults } from "@/features/search";
import { setActiveLang } from "@/shared/i18n";
import { setSpeechRate } from "@/shared/lib/speech";
import styles from "./App.module.css";

export const App = () => {
  const theme = useAppStore((s) => s.theme);
  const lang = useAppStore((s) => s.lang);
  const query = useAppStore((s) => s.query);
  const rate = useAppStore((s) => s.rate);

  useHashRoute();
  useHotkeys();

  // the dictionary lives at module level, so it must be primed after a rehydrate
  useEffect(() => setActiveLang(lang), [lang]);

  // same story for the speech rate: it is read at call time from a module variable
  useEffect(() => setSpeechRate(rate), [rate]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.dataset.lang = lang;
  }, [theme, lang]);

  return (
    <div className={styles.root}>
      <Header />
      <Nav />
      {query.trim() ? <SearchResults /> : <Router />}
    </div>
  );
};
