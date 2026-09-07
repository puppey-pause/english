import styles from "./Tag.module.css";

export const Tag = ({ children, plain }: { children: string; plain?: boolean }) => (
  <span className={[styles.tag, plain && styles.plain].filter(Boolean).join(" ")}>{children}</span>
);
