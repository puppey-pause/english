import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { SPEECH_RATES } from "@/shared/config";
import styles from "./SpeechSwitch.module.css";

/**
 * Темп у кнопок «звук». Одна кнопка вместо трёх: в шапке и так тесно,
 * а переключают темп редко — по клику идёт следующий из трёх.
 */
export const SpeechSwitch = () => {
  const t = useT();
  const rate = useAppStore((s) => s.rate);
  const setRate = useAppStore((s) => s.setRate);

  const i = Math.max(0, SPEECH_RATES.findIndex((r) => r.value === rate));
  const current = SPEECH_RATES[i];
  const next = SPEECH_RATES[(i + 1) % SPEECH_RATES.length];

  return (
    <button
      type="button"
      className={styles.button}
      title={`${t("темп озвучки")}: ${t(current.label)}`}
      aria-label={`${t("темп озвучки")}: ${t(current.label)}`}
      onClick={() => setRate(next.value)}
    >
      {current.tag}
    </button>
  );
};
