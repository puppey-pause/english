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

/** Грамматические темы тренажёра: один заход — одна конструкция. */
export const GRAMMAR_TOPICS = [
  "Present Simple",
  "Present Continuous",
  "Present Perfect",
  "Past Simple",
  "Past Continuous",
  "Future и will",
  "Условные и wish",
  "Модальные глаголы",
  "Инфинитив и -ing",
  "Артикли",
  "Предлоги",
  "Исчисляемое и неисчисляемое",
  "Вопросы и порядок слов",
  "Степени сравнения",
  "Прилагательные и наречия",
  "Косвенная речь",
  "Be и связки",
  "Похожие слова",
] as const;

/**
 * Через сколько дней тема тренажёра считается несвежей. Артикли и предлоги
 * забываются быстрее всего, степени сравнения — медленнее всех.
 */
export const DRILL_DAYS: Record<string, number> = {
  "Артикли": 4,
  "Предлоги": 4,
  "Present Perfect": 5,
  "Условные и wish": 5,
  "Инфинитив и -ing": 5,
  "Вопросы и порядок слов": 5,
  "Present Simple": 7,
  "Past Simple": 7,
  "Модальные глаголы": 7,
  "Исчисляемое и неисчисляемое": 7,
  "Косвенная речь": 7,
  "Похожие слова": 7,
  "Present Continuous": 10,
  "Past Continuous": 10,
  "Future и will": 10,
  "Прилагательные и наречия": 10,
  "Be и связки": 10,
  "Степени сравнения": 14,
};

export const SPEECH_RATES = [
  { value: 0.65, tag: "×0.65", label: "медленно" },
  { value: 0.8, tag: "×0.8", label: "спокойно" },
  { value: 0.95, tag: "×1", label: "обычно" },
] as const;

/**
 * Экраны приложения. Четыре из них — обзоры разделов (study, practice,
 * library, track), остальные — конкретные подразделы.
 */
export type ViewId =
  | "today"
  | "study" | "practice" | "library" | "track"
  | "learn" | "map" | "review" | "words" | "drills"
  | "situ" | "ref" | "reading" | "progress" | "errors" | "test" | "typing";

export * from "./nav";
