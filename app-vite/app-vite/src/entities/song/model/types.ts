export interface Song {
  id: string;
  /** artist */
  a: string;
  /** title */
  t: string;
  /** year */
  y: string;
  /** why this song — what to listen for */
  n: string;
  tags: string[];
  own?: boolean;
}

/** The learner's line-by-line breakdown, keyed by song id. */
export interface SongWork {
  lines: string[];
  tr: Record<number, string>;
  nb: Record<number, string>;
}
