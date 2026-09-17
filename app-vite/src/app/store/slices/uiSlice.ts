import type { StateCreator } from "zustand";
import type { AppState, UiSlice } from "../types";
import { setActiveLang } from "@/shared/i18n";
import { setSpeechRate } from "@/shared/lib/speech";
import { pathOf } from "@/shared/config";
import { STAGES } from "@/entities/stage";

const clampStage = (n: number): number => Math.min(STAGES.length - 1, Math.max(0, Number.isFinite(n) ? n : 0));

export const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set, get) => ({
  view: "today",
  stageIndex: 0,
  openTopic: "",
  query: "",
  theme: "violet",
  lang: "ru",
  rate: 0.95,

  /**
   * Переход по приложению: меняем адрес, состояние подтянет роутер.
   * Пишем хэш напрямую — HashRouter слушает его сам, посредники не нужны.
   */
  setView: (view, stageIndex) => {
    const stage = stageIndex === undefined ? get().stageIndex : clampStage(stageIndex);
    set({ query: "" });
    const target = `#${pathOf(view, stage)}`;
    if (window.location.hash !== target) window.location.hash = target;
  },

  /** Обратная сторона: адрес уже сменился — приводим состояние к нему. */
  applyRoute: (view, stageIndex) =>
    set((s) => ({ view, stageIndex: stageIndex === undefined ? s.stageIndex : clampStage(stageIndex) })),

  setQuery: (query) => set({ query }),
  setOpenTopic: (openTopic) => set((s) => ({ openTopic: s.openTopic === openTopic ? "" : openTopic })),
  setTheme: (theme) => set({ theme }),

  setRate: (rate) => {
    setSpeechRate(rate);
    set({ rate });
  },

  setLang: (lang) => {
    setActiveLang(lang);
    set({ lang });
  },
});
