import type { TestItem } from "./types";
import { TEST } from "./testBank";
import { LEX_TEST } from "./testBankLex";
import { SLANG_TEST } from "./testBankSlang";

export type TestModeId = "general" | "grammar" | "lex" | "slang" | "errors" | "quick";

export interface TestMode {
  id: TestModeId;
  n: string;
  /** одна строка на карточке хаба */
  lead: string;
  /** что именно проверяет — текст перед стартом */
  about: string;
  /** сколько вопросов за подход (для блочного теста — на блок) */
  len: number;
  /** уровни блоков: есть только у общего теста */
  blocks?: readonly string[];
}

/** Доля верных, ниже которой блок общего теста считается непройденным. */
export const BLOCK_PASS = 0.75;

export const BLOCKS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const GRAMMAR_THEMES = ["времена", "глаголы", "артикли", "предлоги"];

export const MODES: TestMode[] = [
  {
    id: "general",
    n: "общий тест",
    lead: "шесть блоков от A1 до C2, пять типов заданий — показывает потолок и слабые темы",
    about: "Шесть блоков по вопросам от A1 до C2. Правило жёсткое: чтобы открыть следующий уровень, нужно набрать три четверти блока. Не набрал — тест останавливается, и этот уровень становится твоим.",
    len: 8,
    blocks: BLOCKS,
  },
  {
    id: "grammar",
    n: "тест грамматики",
    lead: "времена, глаголы, артикли, предлоги — всё вперемешку, без уровней",
    about: "Только грамматика: времена, формы глагола, артикли, предлоги. Уровни идут вперемешку, поэтому лёгкий и сложный вопрос могут стоять рядом.",
    len: 12,
  },
  {
    id: "lex",
    n: "тест лексики",
    lead: "выбор слова, коллокации, фразовые и похожие слова",
    about: "Слова и точность выбора: базовый словарь, устойчивые сочетания вроде make a decision, фразовые глаголы и пары, которые путают.",
    len: 12,
  },
  {
    id: "slang",
    n: "тест сленга и идиом",
    lead: "разговорные формулы и идиомы: показывают выражение — выбираешь смысл",
    about: "Разговорные формулы, идиомы и фразовые глаголы. Показывают выражение — выбираешь, что оно значит.",
    len: 12,
  },
  {
    id: "errors",
    n: "тест по своим ошибкам",
    lead: "вопросы, на которых ты уже промахнулся, начиная с самых частых",
    about: "Вопросы, на которых ты уже промахнулся в любом из тестов, начиная с самых частых. Ответишь верно — вопрос уходит из списка.",
    len: 12,
  },
  {
    id: "quick",
    n: "быстрый",
    lead: "десять вопросов из всего сразу — размяться за пару минут",
    about: "Десять случайных вопросов из всех банков: грамматика, лексика, идиомы. Уровень не считается — это разминка, а не замер.",
    len: 10,
  },
];

export const ALL_TEST: TestItem[] = [...TEST, ...LEX_TEST, ...SLANG_TEST];

/** Стабильный ключ вопроса — по нему копятся промахи. */
export const qid = (q: TestItem): string => {
  const body = q.k === "tr" ? q.ru : "s" in q ? q.s : q.o.join(" ");
  return `${q.k}|${body}`;
};

/**
 * Из чего собирать подход. Для общего теста передаётся уровень блока,
 * для теста по ошибкам — ключи промахов в порядке частоты.
 */
export const poolFor = (mode: TestMode, block?: string, missKeys: string[] = []): TestItem[] => {
  switch (mode.id) {
    case "general":
      return ALL_TEST.filter((q) => q.lvl === block);
    case "grammar":
      return TEST.filter((q) => GRAMMAR_THEMES.includes(q.t));
    case "lex":
      return [...LEX_TEST, ...TEST.filter((q) => q.t === "слова")];
    case "slang":
      return SLANG_TEST;
    case "errors": {
      const rank = new Map(missKeys.map((k, i) => [k, i]));
      return ALL_TEST.filter((q) => rank.has(qid(q))).sort(
        (a, b) => (rank.get(qid(a)) ?? 0) - (rank.get(qid(b)) ?? 0)
      );
    }
    default:
      return ALL_TEST;
  }
};

export const modeById = (id: TestModeId): TestMode => MODES.find((m) => m.id === id) ?? MODES[0];
