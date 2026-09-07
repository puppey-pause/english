import type { ThemeId } from "@/app/store/types";

export const MILES: Record<string, string> = {
  "10": "Конец A1: пятиминутный разговор о себе и своём дне — с ошибками, но без перехода на русский.",
  "24": "Конец A2: 15-минутный разговор с носителем на бытовую тему и прочитанная адаптированная книга.",
  "42": "Конец B1: эпизод сериала с английскими субтитрами понят без пауз, монолог на 3 минуты записан.",
  "56": "Конец B2: эссе на 250 слов за 40 минут и дискуссия на полчаса без срыва на русский.",
  "65": "Конец C1: роман прочитан без словаря, текст на 500 слов правят по смыслу, а не по языку."
};

export const THEMES: { id: ThemeId; title: string; g: string }[] = [
  { id: "violet", title: "фиалка", g: "linear-gradient(135deg,#5b3df5,#e11d8f)" },
  { id: "ocean", title: "океан", g: "linear-gradient(135deg,#0b7fd4,#00b8c4)" },
  { id: "pink", title: "розовый", g: "linear-gradient(135deg,#ff4d9e,#ff8a4d)" },
  { id: "mint", title: "мята", g: "linear-gradient(135deg,#0f9e6e,#7bd44f)" },
  { id: "dark", title: "ночь", g: "linear-gradient(135deg,#1b1640,#7c5cff)" },
  { id: "neon", title: "неон", g: "linear-gradient(135deg,#07101a,#22e0c8)" }
];

// [тема]: { t: абзацы, rows: [англ, пояснение], nb: врезка }
