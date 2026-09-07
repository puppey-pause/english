import type { StateCreator } from "zustand";
import type { AppState, UiSlice } from "../types";
import { setActiveLang } from "@/shared/i18n";

export const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set) => ({
  view: "today",
  stageIndex: 0,
  openTopic: "",
  query: "",
  theme: "violet",
  lang: "ru",

  setView: (view, stageIndex) =>
    set((s) => ({ view, query: "", stageIndex: stageIndex ?? s.stageIndex })),

  setQuery: (query) => set({ query }),
  setOpenTopic: (openTopic) => set((s) => ({ openTopic: s.openTopic === openTopic ? "" : openTopic })),
  setTheme: (theme) => set({ theme }),

  setLang: (lang) => {
    setActiveLang(lang);
    set({ lang });
  },
});
