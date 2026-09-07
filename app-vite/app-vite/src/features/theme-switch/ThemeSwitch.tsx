import { useAppStore } from "@/app/store";
import type { ThemeId } from "@/app/store/types";
import styles from "./ThemeSwitch.module.css";

const THEMES: { id: ThemeId; swatch: string; label: string }[] = [
  { id: "violet", swatch: "#5b3df5", label: "violet" },
  { id: "dark", swatch: "#0f0c24", label: "dark" },
  { id: "ocean", swatch: "#0b7fd4", label: "ocean" },
  { id: "pink", swatch: "#e0248a", label: "pink" },
  { id: "mint", swatch: "#0f9e6e", label: "mint" },
  { id: "neon", swatch: "#22e0c8", label: "neon" },
];

export const ThemeSwitch = () => {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <div className={styles.row} role="group" aria-label="theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={t.label}
          title={t.label}
          style={{ background: t.swatch }}
          className={[styles.dot, theme === t.id && styles.active].filter(Boolean).join(" ")}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  );
};
