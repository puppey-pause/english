import { useEffect } from "react";
import { useAppStore } from "@/app/store";
import { HOTKEYS } from "@/shared/config";

/** Single-letter jumps between sections; ignored while typing in a field. */
export const useHotkeys = (): void => {
  const setView = useAppStore((s) => s.setView);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const view = HOTKEYS[e.key.toLowerCase()];
      if (view) {
        e.preventDefault();
        setView(view);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setView]);
};
