import styles from "./Chip.module.css";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const Chip = ({ label, active, onClick }: ChipProps) => (
  <button type="button" className={[styles.chip, active && styles.active].filter(Boolean).join(" ")} onClick={onClick}>
    {label}
  </button>
);
