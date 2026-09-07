import { S } from "@/shared/data/stages.raw";
import type { Stage, Topic } from "./types";

export const STAGES: Stage[] = S.map((row, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    num,
    title: row[0],
    level: row[1],
    time: row[2],
    practice: row[3],
    topics: row[4].map((t) => ({
      k: `${num}|${t[1]}`,
      layer: t[0],
      name: t[1],
      desc: t[2],
      crit: t[3],
      link: t[4],
      stage: row[0],
      snum: num,
    })),
  };
});

/** Every topic of every stage, flattened — the unit progress is tracked on. */
export const TOPICS: Topic[] = STAGES.flatMap((s) => s.topics);

export const stageByNum = (num: string): Stage | undefined =>
  STAGES.find((s) => s.num === num);

export const topicByKey = (k: string): Topic | undefined =>
  TOPICS.find((t) => t.k === k);
