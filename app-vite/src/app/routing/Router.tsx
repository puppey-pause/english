import { Fragment, Suspense, lazy, useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { SECTION_TREE, pathOf, type ViewId } from "@/shared/config";
import { TodayPage } from "@/pages/today";
import { SectionPage } from "@/pages/section";
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

const PAGES: Record<string, ReactNode> = {
  learn: <LearnPage />,
  map: <MapPage />,
  review: <ReviewPage />,
  words: <WordsPage />,
  drills: <DrillsPage />,
  typing: <TypingPage />,
  test: <TestPage />,
  ref: <ReferencePage />,
  situ: <SituationsPage />,
  reading: <ReadingPage />,
  progress: <ProgressPage />,
  errors: <MistakesPage />,
};

/**
 * Обёртка экрана: адрес — источник правды, здесь он переносится в store,
 * чтобы подсветка меню и старый код с `view` продолжали работать.
 */
const Screen = ({ view, children }: { view: ViewId; children: ReactNode }) => {
  const applyRoute = useAppStore((s) => s.applyRoute);
  const { stage } = useParams();

  useEffect(() => {
    applyRoute(view, stage === undefined ? undefined : Number(stage));
  }, [view, stage, applyRoute]);

  return <Suspense fallback={<div className={styles.loading} aria-busy="true" />}>{children}</Suspense>;
};

/** Старый адрес с номером этапа: #learn/3 -> #/study/course/3. */
const LegacyStage = ({ view }: { view: ViewId }) => {
  const { stage } = useParams();
  return <Navigate to={pathOf(view, stage === undefined ? undefined : Number(stage))} replace />;
};

export const Router = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Screen view="today">
          <TodayPage />
        </Screen>
      }
    />
    {SECTION_TREE.map((section) => (
      <Fragment key={section.id}>
        <Route
          path={`/${section.id}`}
          element={
            <Screen view={section.id}>
              <SectionPage id={section.id} />
            </Screen>
          }
        />
        {section.items.map((item) => (
          <Fragment key={item.view}>
            <Route
              path={`/${section.id}/${item.slug}`}
              element={<Screen view={item.view}>{PAGES[item.view]}</Screen>}
            />
            {item.param ? (
              <Route
                path={`/${section.id}/${item.slug}/:${item.param}`}
                element={<Screen view={item.view}>{PAGES[item.view]}</Screen>}
              />
            ) : null}
          </Fragment>
        ))}
      </Fragment>
    ))}
    {/* старые адреса первой версии: #typing, #learn/3 — уводим на новые */}
    {SECTION_TREE.flatMap((section) =>
      section.items.map((item) => (
        <Fragment key={`legacy-${item.view}`}>
          <Route path={`/${item.view}`} element={<Navigate to={pathOf(item.view)} replace />} />
          {item.param ? (
            <Route path={`/${item.view}/:${item.param}`} element={<LegacyStage view={item.view} />} />
          ) : null}
        </Fragment>
      ))
    )}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
