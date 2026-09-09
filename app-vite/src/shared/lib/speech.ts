/** Темп озвучки. 1.0 — как говорит система, ниже — медленнее и разборчивее. */
let rate = 0.95;

export const setSpeechRate = (next: number): void => {
  rate = next;
};

export const getSpeechRate = (): number => rate;

/**
 * Списки слов — «ship — sheep», «think, three, path» — системный голос
 * проговаривает одной слитной фразой и глотает разницу. Такие строки
 * разбиваются на части, каждая читается отдельно и с паузой.
 */
const split = (text: string): string[] => {
  if (text.length > 48) return [text];
  const parts = text
    .split(/\s*[—–/]\s*|,\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 1 && parts.every((p) => p.split(" ").length <= 3) ? parts : [text];
};

let timer: number | undefined;

/** Reads a phrase out loud with the platform voice. Silently no-ops where unsupported. */
export const speak = (text: string, lang = "en-US"): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.clearTimeout(timer);
  window.speechSynthesis.cancel();

  const parts = split(text);
  // отдельное слово без контекста тоже нужно медленнее, чем целый абзац
  const slow = parts.length > 1 || text.length < 24;
  const r = Math.max(0.4, slow ? rate - 0.15 : rate);

  const say = (i: number) => {
    if (i >= parts.length) return;
    const u = new SpeechSynthesisUtterance(parts[i]);
    u.lang = lang;
    u.rate = r;
    u.onend = () => {
      if (i + 1 < parts.length) timer = window.setTimeout(() => say(i + 1), 420);
    };
    window.speechSynthesis.speak(u);
  };

  say(0);
};
