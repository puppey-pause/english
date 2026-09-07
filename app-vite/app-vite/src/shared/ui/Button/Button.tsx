import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "positive" | "danger";
  block?: boolean;
  children: ReactNode;
}

export const Button = ({ variant = "ghost", block, children, className, ...rest }: ButtonProps) => (
  <button
    type="button"
    className={[styles.button, styles[variant], block && styles.block, className].filter(Boolean).join(" ")}
    {...rest}
  >
    {children}
  </button>
);
