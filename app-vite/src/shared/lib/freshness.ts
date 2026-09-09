import { DAY, DRILL_DAYS } from "@/shared/config";

export type Freshness = "none" | "fresh" | "soon" | "stale";

export interface DrillRun {
  at: number;
  right: number;
  total: number;
}

/**
 * Свежесть темы тренажёра. Интервал у каждой темы свой: артикли забываются
 * за четыре дня, степени сравнения держатся две недели. Плохой счёт
 * укорачивает интервал вдвое — тема, которую завалил, возвращается раньше.
 */
export const freshness = (topic: string, run?: DrillRun): Freshness => {
  if (!run || !run.total) return "none";
  const base = DRILL_DAYS[topic] ?? 7;
  const share = run.right / run.total;
  const days = share < 0.6 ? base / 2 : base;
  const age = (Date.now() - run.at) / DAY;
  if (age < days) return "fresh";
  if (age < days * 2) return "soon";
  return "stale";
};

export const daysAgo = (at: number): number => Math.floor((Date.now() - at) / DAY);
