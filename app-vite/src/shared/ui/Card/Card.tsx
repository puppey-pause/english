import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "accent" | "warn";
  flat?: boolean;
  onPress?: () => void;
  children: ReactNode;
}

export const Card = ({ tone = "default", flat, onPress, children, className, ...rest }: CardProps) => {
  const cls = [
    styles.card,
    tone === "accent" && styles.accent,
    tone === "warn" && styles.warn,
    flat && styles.flat,
    onPress && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cls}
      {...(onPress ? { role: "button", tabIndex: 0, onClick: onPress } : {})}
      {...rest}
    >
      {children}
    </div>
  );
};
