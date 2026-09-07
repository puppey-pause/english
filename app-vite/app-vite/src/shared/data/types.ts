export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "путь";
export type Layer = "грамматика" | "лексика" | "слух" | "речь" | "чтение" | "письмо";

/** [layer, name, description, completion criterion, resource link] */
export type RawTopic = [Layer, string, string, string, string];

/** [title, level, duration, stage practice task, topics] */
export type RawStage = [string, Level, string, string, RawTopic[]];

export interface Situation {
  id: string;
  n: string;
  intro: string;
  /** [english, russian] */
  say: [string, string][];
  hear: [string, string][];
  words: [string, string][];
  tips: string[];
}

export interface TopicInfo {
  /** explanation paragraphs */
  t: string[];
  /** [example, note] rows */
  rows?: [string, string][];
  /** the one thing to remember */
  nb?: string;
}

export interface SlangItem {
  cat: string;
  p: string;
  ru: string;
  ex: string;
  hot: number;
  /** readable category label, derived from SLCATS */
  catRu: string;
}

export interface RefCard {
  n: string;
  f: string;
  use: string;
  ex?: string[];
  nb?: string;
}

export interface Sheet {
  n: string;
  t?: string;
  notes?: string[];
  cards?: RefCard[];
  rows?: string[][];
}

export type TestItem =
  | { lvl: string; t: string; k: "gap"; s: string; o: string[]; a: number; w: string }
  | { lvl: string; t: string; k: "err"; s: string; a: number; fix: string; w: string }
  | { lvl: string; t: string; k: "ord"; o: string[]; a: number; w: string };

/** "найди ошибку": b — wrong sentence, g — good one, w — why */
export interface DrillMistake { t: string; b: string; g: string; w: string }
/** "вставь слово" */
export interface DrillPick { t: string; s: string; o: string[]; a: number; w: string }
/** "собери фразу" */
export interface DrillOrder { ru: string; s: string }

export interface GlossItem { t: string; d: string }
/** two english words one russian word maps to */
export interface WordPair { a: string; b: string; w: string; e: string[] }
