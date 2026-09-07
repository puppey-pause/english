import { useEffect } from "react";
import { useAppStore } from "@/app/store";
import { TABS, type ViewId } from "@/shared/config";
import { STAGES } from "@/entities/stage";

const VALID = new Set<string>([...TABS.map((t) => t.id), "journal", "data"]);

const parse = (hash: string): { view: ViewId; stageIndex?: number } | null => {
  const [view, sub] = hash.replace(/^#/, "").split("/");
  if (!VALID.has(view)) return null;
  const stageIndex = sub === undefined ? undefined : Math.min(STAGES.length - 1, Math.max(0, Number(sub) || 0));
  return { view: view as ViewId, stageIndex };
};

/**
 * Every view change is a real history entry, so the browser back button walks
 * between sections instead of leaving the site. The hash is the single source
 * of truth: the store follows it, never the other way round.
 */
export const useHashRoute = (): void => {
  const view = useAppStore((s) => s.view);
  const stageIndex = useAppStore((s) => s.stageIndex);
  const setView = useAppStore((s) => s.setView);

  // hash -> store
  useEffect(() => {
    const apply = () => {
      const next = parse(window.location.hash);
      if (next) setView(next.view, next.stageIndex);
    };
    apply();
    window.addEventListener("popstate", apply);
    window.addEventListener("hashchange", apply);
    return () => {
      window.removeEventListener("popstate", apply);
      window.removeEventListener("hashchange", apply);
    };
  }, [setView]);

  // store -> hash
  useEffect(() => {
    const target = `#${view}${view === "learn" ? `/${stageIndex}` : ""}`;
    if (window.location.hash === target) return;
    if (!window.location.hash) window.history.replaceState(null, "", target);
    else window.history.pushState(null, "", target);
  }, [view, stageIndex]);
};
