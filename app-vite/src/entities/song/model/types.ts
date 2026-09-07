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
}
