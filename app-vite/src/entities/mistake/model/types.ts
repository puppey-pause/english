export type MistakeCategory = "tense" | "verb" | "prep" | "art" | "word" | "other";

export interface Mistake {
  /** what the learner said */
  s: string;
  /** the correct version */
  r: string;
  /** why — the explanation */
  n: string;
  /** category, derived on write */
  c?: MistakeCategory;
  date: string;
  due?: number;
  box?: number;
}
