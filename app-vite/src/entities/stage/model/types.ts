import type { Layer, Level } from "@/shared/data/types";

export interface Topic {
  /** stable key: "07|Артикли" */
  k: string;
  layer: Layer;
  name: string;
  desc: string;
  crit: string;
  link: string;
  /** owning stage */
  stage: string;
  snum: string;
}

export interface Stage {
  /** "01".."69" */
  num: string;
  title: string;
  level: Level;
  time: string;
  practice: string;
  topics: Topic[];
}
