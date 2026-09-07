import { en } from "./dictionaries/en";

export type Lang = "ru" | "en";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "ru", label: "RU" },
  { id: "en", label: "EN" },
];

const DICTS: Record<Lang, Record<string, string> | null> = { ru: null, en };

let active: Record<string, string> | null = null;

/** Called by the language store on every change; keeps module-level helpers in sync. */
export const setActiveLang = (lang: Lang): void => {
  active = DICTS[lang] ?? null;
};

/** Translate a russian source string. Unknown strings pass through unchanged. */
export const translate = (s: string): string => (active ? active[s] ?? s : s);

/** Deep-translate every string inside a plain value tree. */
export const translateDeep = <T,>(value: T): T => {
  if (!active) return value;
  const walk = (x: unknown): unknown => {
    if (typeof x === "string") return active![x] ?? x;
    if (Array.isArray(x)) return x.map(walk);
    if (x && typeof x === "object" && (x as object).constructor === Object) {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(x as object)) out[k] = walk((x as Record<string, unknown>)[k]);
      return out;
    }
    return x;
  };
  return walk(value) as T;
};
