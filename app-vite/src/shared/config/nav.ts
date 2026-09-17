import type { ViewId } from "./index";

export type SectionId = "study" | "practice" | "library" | "track";

export interface NavItem {
  /** экран раздела — он же ключ ленивой загрузки в роутере */
  view: ViewId;
  /** часть адреса: #/practice/typing */
  slug: string;
  label: string;
  /** короткая подпись для узких мест (чипы, нижняя панель) */
  short?: string;
  desc: string;
  /** имя параметра после подраздела: #/study/course/3 */
  param?: string;
}

export interface NavSection {
  id: SectionId;
  label: string;
  short: string;
  lead: string;
  items: NavItem[];
}

/**
 * Два уровня навигации: четыре раздела, внутри каждого — подразделы.
 * Дерево одно и то же для бокового меню, нижней панели, строки чипов и
 * экрана-обзора раздела, поэтому новый подраздел добавляется здесь одной строкой.
 */
export const SECTION_TREE: NavSection[] = [
  {
    id: "study",
    label: "учёба",
    short: "учёба",
    lead: "путь по этапам: разбор темы, отметка «понял», возврат по расписанию",
    items: [
      {
        view: "learn",
        slug: "course",
        label: "курс по этапам",
        short: "курс",
        desc: "темы этапа с заданиями от образца к своей речи",
        param: "stage",
      },
      { view: "map", slug: "map", label: "карта слоёв", short: "карта", desc: "все шесть слоёв и этапы одним экраном" },
      { view: "review", slug: "review", label: "повторение", short: "повтор", desc: "темы, которым пора на второй круг" },
    ],
  },
  {
    id: "practice",
    label: "практика",
    short: "практика",
    lead: "каждый день понемногу: слова, грамматика в упражнениях, печать, проверка",
    items: [
      { view: "words", slug: "words", label: "слова", short: "слова", desc: "колоды и карточки с интервальным повторением" },
      { view: "drills", slug: "drills", label: "тренажёр", short: "тренажёр", desc: "найди ошибку, вставь слово, собери фразу" },
      { view: "typing", slug: "typing", label: "печать текста", short: "печать", desc: "набор фраз: копия, диктант, по памяти" },
      { view: "test", slug: "tests", label: "тесты", short: "тесты", desc: "уровень, грамматика, лексика, идиомы" },
    ],
  },
  {
    id: "library",
    label: "справочник",
    short: "справка",
    lead: "что открыть, когда нужен ответ или готовая фраза",
    items: [
      { view: "ref", slug: "reference", label: "правила и сленг", short: "правила", desc: "памятки, сленг, пары слов, глоссарий" },
      { view: "situ", slug: "situations", label: "ситуации", short: "ситуации", desc: "отель, аэропорт, кафе, врач — фразы под случай" },
      { view: "reading", slug: "reading", label: "чтение", short: "чтение", desc: "тексты A1–C1 со словами и вопросами" },
    ],
  },
  {
    id: "track",
    label: "прогресс",
    short: "итоги",
    lead: "что сделано и где слабые места",
    items: [
      { view: "progress", slug: "progress", label: "цифры", short: "цифры", desc: "темы, слова, ошибки, тесты в числах" },
      { view: "errors", slug: "mistakes", label: "журнал ошибок", short: "ошибки", desc: "свои промахи с разбором и повторением" },
    ],
  },
];

export const SECTION_IDS: SectionId[] = SECTION_TREE.map((s) => s.id);

export const isSectionId = (v: string): v is SectionId => SECTION_IDS.includes(v as SectionId);

export const sectionById = (id: SectionId): NavSection | undefined => SECTION_TREE.find((s) => s.id === id);

/** В каком разделе живёт экран. */
export const sectionOf = (view: ViewId): NavSection | undefined =>
  SECTION_TREE.find((s) => s.items.some((i) => i.view === view));

export const itemOf = (view: ViewId): NavItem | undefined => {
  for (const s of SECTION_TREE) {
    const hit = s.items.find((i) => i.view === view);
    if (hit) return hit;
  }
  return undefined;
};

export const labelOf = (view: ViewId): string => {
  if (view === "today") return "на сегодня";
  if (isSectionId(view)) return sectionById(view)?.label ?? view;
  return itemOf(view)?.label ?? view;
};

/** Адрес экрана. Единственное место, где собирается путь. */
export const pathOf = (view: ViewId, stageIndex?: number): string => {
  if (view === "today") return "/";
  if (isSectionId(view)) return `/${view}`;
  const section = sectionOf(view);
  const item = itemOf(view);
  if (!section || !item) return "/";
  const tail = item.param && stageIndex !== undefined ? `/${stageIndex}` : "";
  return `/${section.id}/${item.slug}${tail}`;
};
