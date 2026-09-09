/** Темп озвучки. 1.0 — как говорит система, ниже — медленнее и разборчивее. */
let rate = 0.95;

export const setSpeechRate = (next: number): void => {
  rate = next;
};

/** Reads a phrase out loud with the platform voice. Silently no-ops where unsupported. */
export const speak = (text: string, lang = "en-US"): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  window.speechSynthesis.speak(u);
};

export const canRecognise = (): boolean =>
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
