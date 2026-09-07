export interface DeckWord {
  /** the english word or phrase */
  w: string;
  /** the learner's own translation */
  t: string;
  /** spaced-repetition box */
  box: number;
  due: number;
  added: number;
}
