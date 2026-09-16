import { ORDERS } from "./drills";
import { SITU } from "./situations";
import type { Mistake } from "@/entities/mistake";

export interface TypingLine {
  /** что печатаем */
  en: string;
  /** русский смысл: задание в режиме «по памяти»; пусто — только копия и диктант */
  ru: string;
  /** откуда строка: тема или ситуация */
  tag: string;
}

/** ORDERS хранит фразы без точки — вопросы узнаём по русскому переводу. */
const punct = (en: string, ru: string): string =>
  /[.?!]$/.test(en) ? en : en + (ru.trim().endsWith("?") ? "?" : ".");

const fromOrders: TypingLine[] = ORDERS.map((o) => ({
  en: punct(o.s, o.ru),
  ru: o.ru,
  tag: o.gt,
}));

/** Из каждой ситуации — первые четыре реплики: короткие и рабочие. */
const fromSitu: TypingLine[] = SITU.flatMap((s) =>
  s.say.slice(0, 4).map(([en, ru]) => ({ en, ru, tag: s.n }))
);

const daily: TypingLine[] = [
  { en: "I am on my way.", ru: "Я уже в пути.", tag: "быт" },
  { en: "Give me a second.", ru: "Дай мне секунду.", tag: "быт" },
  { en: "It is up to you.", ru: "Решай сам.", tag: "быт" },
  { en: "I have no idea.", ru: "Понятия не имею.", tag: "быт" },
  { en: "That makes sense.", ru: "Это понятно, логично.", tag: "быт" },
  { en: "Let me check.", ru: "Дай проверю.", tag: "быт" },
  { en: "I will be right back.", ru: "Я сейчас вернусь.", tag: "быт" },
  { en: "Sorry, I did not catch that.", ru: "Извините, я не расслышал.", tag: "быт" },
  { en: "Could you speak a little slower?", ru: "Можете говорить чуть медленнее?", tag: "быт" },
  { en: "What does this word mean?", ru: "Что значит это слово?", tag: "быт" },
  { en: "I am not sure yet.", ru: "Я пока не уверен.", tag: "быт" },
  { en: "It depends on the weather.", ru: "Зависит от погоды.", tag: "быт" },
  { en: "I forgot to tell you.", ru: "Я забыл тебе сказать.", tag: "быт" },
  { en: "We are almost there.", ru: "Мы почти на месте.", tag: "быт" },
  { en: "Do you mind if I open the window?", ru: "Не против, если я открою окно?", tag: "быт" },
  { en: "I would rather stay home.", ru: "Я бы лучше остался дома.", tag: "быт" },
  { en: "Something is wrong with my phone.", ru: "С моим телефоном что-то не так.", tag: "быт" },
  { en: "Let me know when you are free.", ru: "Скажи, когда будешь свободен.", tag: "быт" },
  { en: "I need to think about it.", ru: "Мне нужно об этом подумать.", tag: "быт" },
  { en: "It is not a big deal.", ru: "Это не страшно.", tag: "быт" },
  { en: "I am running late.", ru: "Я опаздываю.", tag: "быт" },
  { en: "Can you help me with this?", ru: "Можешь мне с этим помочь?", tag: "быт" },
  { en: "I have been here before.", ru: "Я здесь уже был.", tag: "быт" },
  { en: "That is exactly what I meant.", ru: "Именно это я и имел в виду.", tag: "быт" },
  { en: "I will take care of it.", ru: "Я этим займусь.", tag: "быт" },
  { en: "See you on Monday.", ru: "Увидимся в понедельник.", tag: "быт" },
];

export interface TypingPack {
  id: string;
  label: string;
  desc: string;
  lines: TypingLine[];
}

export const TYPING_PACKS: TypingPack[] = [
  { id: "daily", label: "бытовые фразы", desc: "то, что говорят каждый день", lines: daily },
  { id: "grammar", label: "грамматика", desc: "фразы из тренажёра по конструкциям", lines: fromOrders },
  { id: "situ", label: "ситуации", desc: "реплики из отеля, кафе, аэропорта", lines: fromSitu },
];

/** Набор «мои ошибки»: печатаем верную версию того, что уже промазали. */
export const linesFromMistakes = (mistakes: Mistake[]): TypingLine[] =>
  mistakes
    .filter((m) => m.r.trim().length > 1)
    .map((m) => ({ en: m.r.trim(), ru: m.n || m.s, tag: "ошибка" }));

/** Свой текст: режем на предложения, слишком длинные — по запятым. */
export const linesFromText = (text: string): TypingLine[] => {
  const raw = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
  const out: TypingLine[] = [];
  raw.forEach((s) => {
    if (s.length <= 90) {
      out.push({ en: s, ru: "", tag: "свой текст" });
      return;
    }
    s.split(/,\s+/).forEach((part) => {
      const p = part.trim();
      if (p.length > 1) out.push({ en: p, ru: "", tag: "свой текст" });
    });
  });
  return out;
};

export const TYPING_RUN = 10;
