import { useAppStore } from "@/app/store";
import { TodayPage } from "@/pages/today";
import { LearnPage } from "@/pages/learn";
import { MapPage } from "@/pages/map";
import { ReferencePage } from "@/pages/ref";
import { SituationsPage } from "@/pages/situ";
import { SongsPage } from "@/pages/songs";
import { ReviewPage } from "@/pages/review";
import { WordsPage } from "@/pages/words";
import { DrillsPage } from "@/pages/drills";
import { TestPage } from "@/pages/test";
import { ProgressPage } from "@/pages/progress";
import { MistakesPage } from "@/pages/mistakes";

export const Router = () => {
  const view = useAppStore((s) => s.view);

  switch (view) {
    case "learn":
      return <LearnPage />;
    case "map":
      return <MapPage />;
    case "ref":
      return <ReferencePage />;
    case "situ":
      return <SituationsPage />;
    case "songs":
      return <SongsPage />;
    case "review":
      return <ReviewPage />;
    case "words":
      return <WordsPage />;
    case "drills":
      return <DrillsPage />;
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
