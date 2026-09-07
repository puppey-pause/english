import type { StateCreator } from "zustand";
import type { AppState, ProgressSlice } from "../types";
import { nextDue } from "@/shared/lib/srs";
import { DAY } from "@/shared/config";

export const createProgressSlice: StateCreator<AppState, [], [], ProgressSlice> = (set) => ({
  done: {},
  rev: {},
  box: {},
  notes: {},
  levels: {},

  toggleDone: (k) =>
    set((s) => {
      const isDone = !s.done[k];
      const done = { ...s.done, [k]: isDone };
      if (!isDone) delete done[k];
      const rev = { ...s.rev };
      const box = { ...s.box };
      if (isDone) {
        box[k] = 0;
        rev[k] = Date.now() + DAY;
      } else {
        delete rev[k];
        delete box[k];
      }
      return { done, rev, box };
    }),

  gradeTopic: (k, remembered) =>
    set((s) => {
      const box = remembered ? Math.min((s.box[k] ?? 0) + 1, 5) : 0;
      return {
        box: { ...s.box, [k]: box },
        rev: { ...s.rev, [k]: nextDue(box) },
      };
    }),

  setNote: (k, text) => set((s) => ({ notes: { ...s.notes, [k]: text } })),
});
