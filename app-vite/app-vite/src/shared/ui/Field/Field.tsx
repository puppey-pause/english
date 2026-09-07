import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

export const Input = ({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={[styles.input, className].filter(Boolean).join(" ")} {...rest} />
);

export const DashedInput = ({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={[styles.input, styles.dashed, className].filter(Boolean).join(" ")} {...rest} />
);

export const Textarea = ({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={[styles.textarea, className].filter(Boolean).join(" ")} {...rest} />
);
