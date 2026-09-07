import type { StateCreator } from "zustand";
import type { AppState, SongSlice } from "../types";

const EMPTY = { lines: [] as string[], tr: {} as Record<number, string>, nb: {} as Record<number, string> };

export const createSongSlice: StateCreator<AppState, [], [], SongSlice> = (set) => ({
  songWork: {},
  ownSongs: [],

  splitLyrics: (songId, raw) =>
    set((s) => {
      const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return s;
      const prev = s.songWork[songId] ?? EMPTY;
      return { songWork: { ...s.songWork, [songId]: { ...prev, lines } } };
    }),

  setSongLine: (songId, field, index, value) =>
    set((s) => {
      const prev = s.songWork[songId] ?? EMPTY;
      return {
        songWork: {
          ...s.songWork,
          [songId]: { ...prev, [field]: { ...prev[field], [index]: value } },
        },
      };
    }),

  resetLyrics: (songId) =>
    set((s) => {
      const prev = s.songWork[songId] ?? EMPTY;
      return { songWork: { ...s.songWork, [songId]: { ...prev, lines: [] } } };
    }),

  addOwnSong: (artist, title) => {
    const id = `own${Date.now()}`;
    set((s) => ({
      ownSongs: [
        ...s.ownSongs,
        { id, a: artist.trim(), t: title.trim() || artist.trim(), y: "", n: "", tags: [], own: true },
      ],
    }));
    return id;
  },
});
