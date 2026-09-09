import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { SPEECH_RATES } from "@/shared/config";
import styles from "./SpeechSwitch.module.css";

/** Темп у кнопок «звук»: системный голос по умолчанию тараторит. */
export const SpeechSwitch = () => {
  const t = useT();
  const rate = useAppStore((s) => s.rate);
  const setRate = useAppStore((s) => s.setRate);

  return (
    <div className={styles.row} role="group" aria-label={t("темп озвучки")}>
      {SPEECH_RATES.map((r) => (
        <button
          key={r.value}
          type="button"
          title={t("темп озвучки")}
          className={[styles.button, rate === r.value && styles.active].filter(Boolean).join(" ")}
          onClick={() => setRate(r.value)}
        >
          {t(r.label)}
        </button>
      ))}
    </div>
  );
};
