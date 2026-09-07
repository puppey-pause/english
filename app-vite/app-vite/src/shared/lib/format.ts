import { translate } from "@/shared/i18n";

export const dateKey = (t: number): string => new Date(t).toISOString().slice(0, 10);

export const formatMinutes = (min: number): string => {
  if (!min) return `0 ${translate("ч")}`;
  const h = Math.floor(min / 60);
  const rest = min % 60;
  if (!h) return `${min} ${translate("м")}`;
  return `${h} ${translate("ч")}${rest ? ` ${rest} ${translate("м")}` : ""}`;
};

/** "3 дня" | "2 недели" | "1 месяц" -> weeks */
export const durationInWeeks = (s: string | undefined): number => {
  if (!s) return 1;
  const m = String(s).match(/(\d+)\s*(дн|ден|недел|месяц)/i);
  if (!m) return 4;
  const n = Number(m[1]);
  if (/дн|ден/i.test(m[2])) return n / 7;
  if (/недел/i.test(m[2])) return n;
  return n * 4.3;
};

export const plural = (n: number, one: string, few: string, many: string): string => {
  const a = n % 100;
  const b = n % 10;
  if (a > 10 && a < 20) return many;
  if (b === 1) return one;
  if (b >= 2 && b <= 4) return few;
  return many;
};
