import { useEffect } from "react";
import { HashRouter, useLocation } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { Router } from "@/app/routing/Router";
import { ErrorBoundary } from "@/app/routing/ErrorBoundary";
import { Header } from "@/widgets/header/Header";
import { Nav } from "@/widgets/nav/Nav";
import { SubNav } from "@/widgets/subnav/SubNav";
import { TabBar } from "@/widgets/tabbar/TabBar";
import { SearchResults } from "@/features/search";
import { setActiveLang } from "@/shared/i18n";
import { setSpeechRate } from "@/shared/lib/speech";
import styles from "./App.module.css";

const Shell = () => {
  const theme = useAppStore((s) => s.theme);
  const lang = useAppStore((s) => s.lang);
  const query = useAppStore((s) => s.query);
  const rate = useAppStore((s) => s.rate);
  const { pathname } = useLocation();

  // новый экран открывается сверху, а не там, где бросили предыдущий
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // the dictionary lives at module level, so it must be primed after a rehydrate
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  // same story for the speech rate: it is read at call time from a module variable
  useEffect(() => {
    setSpeechRate(rate);
  }, [rate]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.body.dataset.lang = lang;
  }, [theme, lang]);

  return (
    <div className={styles.root}>
      <aside className={styles.side}>
        <Header />
        <Nav />
      </aside>
      <SubNav />
      <main className={styles.main}>
        <ErrorBoundary>{query.trim() ? <SearchResults /> : <Router />}</ErrorBoundary>
      </main>
      <TabBar />
    </div>
  );
};

export const App = () => (
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Shell />
  </HashRouter>
);
