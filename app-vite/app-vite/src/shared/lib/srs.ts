import { DAY } from "@/shared/config";

/** Spaced repetition intervals in days, indexed by how many times the item was recalled. */
export const INTERVALS = [1, 3, 7, 16, 35, 70] as const;

export const nextDue = (box: number, now = Date.now()): number =>
  now + INTERVALS[Math.min(box, INTERVALS.length - 1)] * DAY;

export const isDue = (due: number | undefined, now = Date.now()): boolean => (due ?? 0) <= now;
