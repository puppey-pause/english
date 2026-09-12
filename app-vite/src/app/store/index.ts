import { create } from "zustand";
import { persist, createJSONStorage } from "./persist";
import type { AppState } from "./types";
import { createUiSlice } from "./slices/uiSlice";
import { createProgressSlice } from "./slices/progressSlice";
import { createDeckSlice } from "./slices/deckSlice";
import { createMistakeSlice } from "./slices/mistakeSlice";
import { createTestSlice } from "./slices/testSlice";

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUiSlice(...a),
      ...createProgressSlice(...a),
      ...createDeckSlice(...a),
      ...createMistakeSlice(...a),
      ...createTestSlice(...a),
    }),
    createJSONStorage()
  )
);

export type { AppState } from "./types";
