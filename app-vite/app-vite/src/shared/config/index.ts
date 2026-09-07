import type { Layer, Level } from "@/shared/data/types";

export const STORAGE_KEY = "en-roadmap-us-v1";
export const DAY = 86_400_000;

export const LAYERS: Layer[] = ["грамматика", "лексика", "слух", "речь", "чтение", "письмо"];

export const LAYER_COLOR: Record<Layer, string> = {
  "грамматика": "var(--l0)",
  "лексика": "var(--l1)",
  "слух": "var(--l2)",
  "речь": "var(--l3)",
  "чтение": "var(--l4)",
  "письмо": "var(--l5)",
};

export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "путь"];
export const CEFR6 = ["A1", "A2", "B1", "B2", "C1"] as const;

export const DRILL_TOPICS = ["все", "времена", "глаголы", "предлоги", "артикли", "слова"] as const;

export type ViewId =
  | "today" | "learn" | "map" | "review" | "words" | "drills"
  | "situ" | "ref" | "progress" | "errors" | "songs" | "test"
  | "journal" | "data";

export const TABS: { id: ViewId; label: string; group: "main" | "learn" | "practice" | "track" }[] = [
  { id: "today", label: "на сегодня", group: "main" },
  { id: "learn", label: "учёба", group: "learn" },
  { id: "map", label: "карта слоёв", group: "learn" },
  { id: "ref", label: "справочник", group: "learn" },
  { id: "situ", label: "ситуации", group: "learn" },
  { id: "songs", label: "песни", group: "learn" },
  { id: "review", label: "повторение", group: "practice" },
  { id: "words", label: "слова", group: "practice" },
  { id: "drills", label: "тренажёр", group: "practice" },
  { id: "test", label: "тесты", group: "practice" },
  { id: "progress", label: "прогресс", group: "track" },
  { id: "errors", label: "журнал ошибок", group: "track" },
];

export const HOTKEYS: Record<string, ViewId> = {
  t: "today", l: "learn", m: "map", r: "review", w: "words",
  d: "drills", i: "situ", g: "ref", p: "progress", e: "errors", s: "songs",
};
