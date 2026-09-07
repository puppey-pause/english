import type { ViewId } from "./index";

/**
 * Searchable sections — so typing "сленг" finds the reference section itself,
 * not just the study topic that happens to mention it.
 */
export const SECTIONS: { label: string; view: ViewId; desc: string; keywords: string }[] = [
  { label: "сленг", view: "ref", desc: "живой разговорный: сленг, идиомы, грубые фразы", keywords: "сленг slang идиом разговорн груб мат жарг" },
  { label: "пары слов", view: "ref", desc: "русское одно — английских два: правило выбора", keywords: "пары слов синоним разниц say tell cost" },
  { label: "глоссарий", view: "ref", desc: "термины грамматики простыми словами", keywords: "глоссарий термин определени грамматик" },
  { label: "памятки", view: "ref", desc: "таблицы времён и предлогов для печати", keywords: "памятк таблиц шпаргалк печат" },
  { label: "песни", view: "songs", desc: "разбор песен по строкам: перевод и заметки", keywords: "песни песня музык текст lyrics перевод" },
  { label: "ситуации", view: "situ", desc: "готовые фразы: отель, аэропорт, кафе", keywords: "ситуац фраз отель аэропорт кафе врач магазин" },
  { label: "тренажёр", view: "drills", desc: "задания: найди ошибку, вставь слово, собери фразу", keywords: "тренажёр упражнен задани практик" },
  { label: "тесты", view: "test", desc: "уровень, грамматика, лексика, идиомы", keywords: "тест уровень проверк экзамен" },
  { label: "журнал ошибок", view: "errors", desc: "свои ошибки с разбором и повторением", keywords: "ошибк журнал разбор" },
  { label: "слова", view: "words", desc: "колода слов и повторение по интервалам", keywords: "слов колод карточк словар" },
  { label: "повторение", view: "review", desc: "темы к повторению по расписанию", keywords: "повторен интервал расписан" },
  { label: "прогресс", view: "progress", desc: "статистика: темы, слова, ошибки", keywords: "прогресс статистик цифр" },
  { label: "карта слоёв", view: "map", desc: "все слои и этапы одним экраном", keywords: "карта слои этапы обзор" },
];
