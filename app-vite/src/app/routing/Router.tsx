import { Suspense, lazy } from "react";
import { useAppStore } from "@/app/store";
import { TodayPage } from "@/pages/today";
import styles from "./Router.module.css";

/**
 * «Сегодня» — первый экран, он в основном бандле. Остальные разделы грузятся
 * отдельными файлами при первом заходе: первая загрузка сайта заметно легче.
 */
const LearnPage = lazy(() => import("@/pages/learn").then((m) => ({ default: m.LearnPage })));
const MapPage = lazy(() => import("@/pages/map").then((m) => ({ default: m.MapPage })));
const ReferencePage = lazy(() => import("@/pages/ref").then((m) => ({ default: m.ReferencePage })));
const SituationsPage = lazy(() => import("@/pages/situ").then((m) => ({ default: m.SituationsPage })));
const ReadingPage = lazy(() => import("@/pages/reading").then((m) => ({ default: m.ReadingPage })));
const ReviewPage = lazy(() => import("@/pages/review").then((m) => ({ default: m.ReviewPage })));
const WordsPage = lazy(() => import("@/pages/words").then((m) => ({ default: m.WordsPage })));
const DrillsPage = lazy(() => import("@/pages/drills").then((m) => ({ default: m.DrillsPage })));
const TypingPage = lazy(() => import("@/pages/typing").then((m) => ({ default: m.TypingPage })));
const TestPage = lazy(() => import("@/pages/test").then((m) => ({ default: m.TestPage })));
const ProgressPage = lazy(() => import("@/pages/progress").then((m) => ({ default: m.ProgressPage })));
const MistakesPage = lazy(() => import("@/pages/mistakes").then((m) => ({ default: m.MistakesPage })));

const page = (view: string) => {
  switch (view) {
    case "learn":
      return <LearnPage />;
    case "map":
      return <MapPage />;
    case "ref":
      return <ReferencePage />;
    case "situ":
      return <SituationsPage />;
    case "reading":
      return <ReadingPage />;
    case "review":
      return <ReviewPage />;
    case "words":
      return <WordsPage />;
    case "drills":
      return <DrillsPage />;
    case "typing":
      return <TypingPage />;
    case "test":
      return <TestPage />;
    case "progress":
      return <ProgressPage />;
    case "errors":
      return <MistakesPage />;
    default:
      return <TodayPage />;
  }
};

export const Router = () => {
  const view = useAppStore((s) => s.view);
  return <Suspense fallback={<div className={styles.loading} aria-busy="true" />}>{page(view)}</Suspense>;
};
