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
  /** название формы */
  n: string;
  /** формула или подпись */
  f: string;
  /** когда так говорят */
  use: string;
  /** примеры */
  ex: string[];
  /** перевод первого примера */
  tr: string;
  /** слова-маркеры */
  mk: string;
  /** с чем путают */
  vs: string;
}

export interface Sheet {
  n: string;
  t?: string;
  notes?: string[];
  cards?: RefCard[];
  rows?: string[][];
}

/** Банк вопросов: шесть типов, каждый со своей формой. */
export type TestItem =
  /** вставить слово в пропуск */
  | { lvl: string; t: string; k: "gap"; s: string; o: string[]; a: number; w: string }
  /** перевести русскую фразу — выбрать верный вариант */
  | { lvl: string; t: string; k: "tr"; ru: string; o: string[]; a: number; w: string }
  /** что звучит естественнее для носителя */
  | { lvl: string; t: string; k: "nat"; o: string[]; a: number; w: string }
  /** найти неправильное слово в предложении */
  | { lvl: string; t: string; k: "err"; s: string; a: number; fix: string; w: string }
  /** собрать фразу в правильном порядке */
  | { lvl: string; t: string; k: "ord"; o: string[]; a: number; w: string }
  /** что значит выражение — показывают английское, выбираешь смысл */
  | { lvl: string; t: string; k: "mean"; s: string; o: string[]; a: number; w: string };

/** "найди ошибку": b — wrong sentence, g — good one, w — why */
export interface DrillMistake { t: string; gt: string; b: string; g: string; w: string }
/** "вставь слово" */
export interface DrillPick { t: string; gt: string; s: string; o: string[]; a: number; w: string }
/** "собери фразу" */
export interface DrillOrder { gt: string; ru: string; s: string }

export interface GlossItem { t: string; d: string }
/** two english words one russian word maps to */
export interface WordPair { a: string; b: string; w: string; e: string[] }
