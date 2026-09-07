import type { MistakeCategory } from "./types";

export const CATEGORIES: { id: MistakeCategory; label: string }[] = [
  { id: "tense", label: "времена" },
  { id: "verb", label: "глаголы" },
  { id: "prep", label: "предлоги" },
  { id: "art", label: "артикли" },
  { id: "word", label: "слова" },
  { id: "other", label: "другое" },
];

export const CATEGORY_LABEL: Record<MistakeCategory, string> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.label }),
  {} as Record<MistakeCategory, string>
);

const RULES: [MistakeCategory, RegExp][] = [
  ["prep", /предлог/i],
  ["art", /артикл/i],
  ["tense", /времена|время|времён|tense|perfect|continu/i],
  ["word", /слова|словар|лексик|коллокац|идиом|сленг|фразов|разговорн|точност|регистр/i],
  ["verb", /глагол|модальн|инфинитив/i],
];

/**
 * Mistakes written by the test engine carry a "[тест · глаголы · A1]" tag.
 * The tag wins; free-text explanations are only classified when no tag is present.
 */
export const categorise = (explanation: string | undefined): MistakeCategory => {
  let text = String(explanation ?? "");
  const tagged = text.match(/\[[^\]]*·\s*([^·\]]+?)\s*·[^\]]*\]/);
  if (tagged) text = tagged[1];
  for (const [id, rx] of RULES) if (rx.test(text)) return id;
  return "other";
};
