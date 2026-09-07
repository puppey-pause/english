import { useCallback } from "react";
import { useAppStore } from "@/app/store";
import { translate } from "./index";

/** Component-facing translator. Re-renders on language change via the store subscription. */
export const useT = (): ((s: string) => string) => {
  const lang = useAppStore((s) => s.lang);
  return useCallback((s: string) => (lang === "ru" ? s : translate(s)), [lang]);
};
