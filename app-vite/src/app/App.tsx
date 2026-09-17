import { useEffect } from "react";
import { HashRouter, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { Router } from "@/app/routing/Router";
import { Header } from "@/widgets/header/Header";
import { Nav } from "@/widgets/nav/Nav";
import { SubNav } from "@/widgets/subnav/SubNav";
import { TabBar } from "@/widgets/tabbar/TabBar";
import { SearchResults } from "@/features/search";
import { setActiveLang } from "@/shared/i18n";
import { setSpeechRate } from "@/shared/lib/speech";
import { setNavigator } from "@/shared/lib/nav";
import styles from "./App.module.css";

const Shell = () => {
  const theme = useAppStore((s) => s.theme);
  const lang = useAppStore((s) => s.lang);
  const query = useAppStore((s) => s.query);
  const rate = useAppStore((s) => s.rate);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // store переходит по адресам через этот navigate — хуки внутри слайса недоступны
  useEffect(() => {
    setNavigator((path) => navigate(path));
    return () => setNavigator(null);
  }, [navigate]);

  // новый экран открывается сверху, а не там, где бросили предыдущий
  useEffect(() => window.scrollTo(0, 0), [pathname]);

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
      <aside className={styles.side}>
        <Header />
        <Nav />
      </aside>
      <SubNav />
      <main className={styles.main}>{query.trim() ? <SearchResults /> : <Router />}</main>
      <TabBar />
    </div>
  );
};

export const App = () => (
  <HashRouter>
    <Shell />
  </HashRouter>
);
