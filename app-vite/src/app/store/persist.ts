import { persist as zustandPersist } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware";
import type { AppState } from "./types";
import { STORAGE_KEY } from "@/shared/config";

export const persist = zustandPersist;

/**
 * Only learner-owned data is persisted; transient UI (query, open topic) is not,
 * so a reload never restores a half-typed search.
 */
export const createJSONStorage = (): PersistOptions<AppState, Partial<AppState>> => ({
  name: STORAGE_KEY,
  version: 3,
  partialize: (s) => ({
    theme: s.theme,
    lang: s.lang,
    rate: s.rate,
    view: s.view,
    stageIndex: s.stageIndex,
    done: s.done,
    rev: s.rev,
    box: s.box,
    notes: s.notes,
    levels: s.levels,
    drills: s.drills,
    steps: s.steps,
    words: s.words,
    mistakes: s.mistakes,
  }),
  /**
   * v1 stored the same data under russian-ish short keys written by the HTML build.
   * v3 dropped the دارجة locale, so a saved "dz" has to fall back to russian.
   */
  migrate: (persisted, version) => {
    if (version >= 2) {
      const saved = persisted as Partial<AppState> & { lang?: string };
      if (saved.lang !== "ru" && saved.lang !== "en") return { ...saved, lang: "ru" };
      return saved as Partial<AppState>;
    }
    const v1 = persisted as Record<string, unknown>;
    return {
      theme: (v1.th as AppState["theme"]) ?? "violet",
      lang: v1.lang === "en" ? "en" : "ru",
      done: (v1.done as AppState["done"]) ?? {},
      rev: (v1.rev as AppState["rev"]) ?? {},
      box: (v1.tt as AppState["box"]) ?? {},
      notes: (v1.notes as AppState["notes"]) ?? {},
      levels: (v1.lvl as AppState["levels"]) ?? {},
      words: (v1.words as AppState["words"]) ?? [],
      mistakes: (v1.errs as AppState["mistakes"]) ?? [],
    };
  },
});
