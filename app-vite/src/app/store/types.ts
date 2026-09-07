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
  toggleDone: (k: string) => void;
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

export type AppState = UiSlice & ProgressSlice & DeckSlice & MistakeSlice;
