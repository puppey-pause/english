import type { Lang } from "@/shared/i18n";
import type { ViewId } from "@/shared/config";
import type { DeckWord } from "@/entities/word";
import type { Mistake } from "@/entities/mistake";

export type ThemeId = "violet" | "dark" | "ocean" | "pink" | "mint" | "neon";

export interface UiSlice {
  view: ViewId;
  stageIndex: number;
  openTopic: string;
  query: string;
  theme: ThemeId;
  lang: Lang;
  /** темп озвучки: 0.6 медленно … 1.0 обычно */
  rate: number;
  setRate: (r: number) => void;
  setView: (view: ViewId, stageIndex?: number) => void;
  setQuery: (q: string) => void;
  setOpenTopic: (k: string) => void;
  setTheme: (t: ThemeId) => void;
  setLang: (l: Lang) => void;
}

export interface ProgressSlice {
  /** topic key -> completed */
  done: Record<string, boolean>;
  /** topic key -> next review timestamp */
  rev: Record<string, number>;
  /** topic key -> review box */
  box: Record<string, number>;
  /** topic key -> personal note */
  notes: Record<string, string>;
  /** stage num -> self-assessed level */
  levels: Record<string, string>;
  /** тема тренажёра -> когда прошёл и с каким счётом */
  drills: Record<string, { at: number; right: number; total: number }>;
  /** "ключ темы#номер шага" -> шаг отмечен */
  steps: Record<string, boolean>;
  toggleDone: (k: string) => void;
  finishDrill: (topic: string, right: number, total: number) => void;
  toggleStep: (k: string) => void;
  gradeTopic: (k: string, remembered: boolean) => void;
  setNote: (k: string, text: string) => void;
}

export interface DeckSlice {
  words: DeckWord[];
  addWord: (w: string, t: string) => void;
  removeWord: (w: string) => void;
  gradeWord: (w: string, remembered: boolean) => void;
}

export interface MistakeSlice {
  mistakes: Mistake[];
  addMistake: (said: string, right: string, why: string, category?: string) => void;
  removeMistake: (said: string) => void;
  gradeMistake: (said: string, remembered: boolean) => void;
}

export interface TestSlice {
  /** уровень, выставленный общим тестом: "" — тест ещё не пройден */
  level: string;
  /** ключ вопроса -> сколько раз промазал */
  testMisses: Record<string, number>;
  /** режим теста -> когда и с каким счётом */
  testRuns: Record<string, { at: number; right: number; total: number }>;
  setLevel: (l: string) => void;
  noteTestMiss: (id: string) => void;
  clearTestMiss: (id: string) => void;
  finishTest: (mode: string, right: number, total: number) => void;
}

export type AppState = UiSlice & ProgressSlice & DeckSlice & MistakeSlice & TestSlice;
