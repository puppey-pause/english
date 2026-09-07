import type { StateCreator } from "zustand";
import type { AppState, MistakeSlice } from "../types";
import { categorise, type MistakeCategory } from "@/entities/mistake";
import { nextDue } from "@/shared/lib/srs";
import { DAY } from "@/shared/config";

export const createMistakeSlice: StateCreator<AppState, [], [], MistakeSlice> = (set) => ({
  mistakes: [],

  addMistake: (said, right, why, category) =>
    set((s) => {
      const key = said.trim();
      if (!key || s.mistakes.some((m) => m.s === key)) return s;
      return {
        mistakes: [
          {
            s: key,
            r: right.trim(),
            n: why.trim(),
            c: (category as MistakeCategory) ?? categorise(why),
            date: new Date().toISOString(),
            due: Date.now() + DAY,
            box: 0,
          },
          ...s.mistakes,
        ],
      };
    }),

  removeMistake: (said) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.s !== said) })),

  gradeMistake: (said, remembered) =>
    set((s) => ({
      mistakes: s.mistakes.map((m) => {
        if (m.s !== said) return m;
        const box = remembered ? Math.min((m.box ?? 0) + 1, 5) : 0;
        return { ...m, box, due: nextDue(box) };
      }),
    })),
});
