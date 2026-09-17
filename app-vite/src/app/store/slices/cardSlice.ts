import type { StateCreator } from "zustand";
import type { AppState, CardSlice } from "../types";
import { nextDue } from "@/shared/lib/srs";

/**
 * Готовые наборы карточек (неправильные глаголы, сленг и т.д.) не хранятся в
 * колоде целиком — запоминаем только шаг и срок по ключу «набор:лицо».
 */
export const createCardSlice: StateCreator<AppState, [], [], CardSlice> = (set) => ({
  cardBox: {},
  cardDue: {},

  gradeCard: (key, remembered) =>
    set((s) => {
      const box = remembered ? Math.min((s.cardBox[key] ?? 0) + 1, 5) : 0;
      return {
        cardBox: { ...s.cardBox, [key]: box },
        cardDue: { ...s.cardDue, [key]: nextDue(box) },
      };
    }),

  resetDeck: (deckId) =>
    set((s) => {
      const boxes = { ...s.cardBox };
      const dues = { ...s.cardDue };
      Object.keys(dues).forEach((k) => {
        if (k.startsWith(`${deckId}:`)) {
          delete boxes[k];
          delete dues[k];
        }
      });
      return { cardBox: boxes, cardDue: dues };
    }),
});
