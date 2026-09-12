import type { StateCreator } from "zustand";
import type { AppState, TestSlice } from "../types";

export const createTestSlice: StateCreator<AppState, [], [], TestSlice> = (set) => ({
  level: "",
  testMisses: {},
  testRuns: {},

  setLevel: (l) => set({ level: l }),

  /** промах копится: чем чаще, тем выше вопрос в тесте по ошибкам */
  noteTestMiss: (id) =>
    set((s) => ({ testMisses: { ...s.testMisses, [id]: (s.testMisses[id] ?? 0) + 1 } })),

  clearTestMiss: (id) =>
    set((s) => {
      if (!(id in s.testMisses)) return s;
      const testMisses = { ...s.testMisses };
      delete testMisses[id];
      return { testMisses };
    }),

  finishTest: (mode, right, total) =>
    set((s) => ({ testRuns: { ...s.testRuns, [mode]: { at: Date.now(), right, total } } })),
});
