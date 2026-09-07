import type { StateCreator } from "zustand";
import type { AppState, DeckSlice } from "../types";
import { nextDue } from "@/shared/lib/srs";
import { DAY } from "@/shared/config";

export const createDeckSlice: StateCreator<AppState, [], [], DeckSlice> = (set) => ({
  words: [],

  addWord: (w, t) =>
    set((s) => {
      const word = w.trim();
      if (!word || s.words.some((x) => x.w === word)) return s;
      return {
        words: [{ w: word, t: t.trim(), box: 0, due: Date.now() + DAY, added: Date.now() }, ...s.words],
      };
    }),

  removeWord: (w) => set((s) => ({ words: s.words.filter((x) => x.w !== w) })),

  gradeWord: (w, remembered) =>
    set((s) => ({
      words: s.words.map((x) => {
        if (x.w !== w) return x;
        const box = remembered ? Math.min(x.box + 1, 5) : 0;
        return { ...x, box, due: nextDue(box) };
      }),
    })),
});
