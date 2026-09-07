import type { ReactNode } from "react";
import styles from "./Label.module.css";

export const Label = ({ children, section }: { children: ReactNode; section?: boolean }) => (
  <div className={[styles.label, section && styles.section].filter(Boolean).join(" ")}>{children}</div>
);
