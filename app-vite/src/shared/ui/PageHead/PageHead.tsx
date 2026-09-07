import type { ReactNode } from "react";
import styles from "./PageHead.module.css";

interface PageHeadProps {
  title: string;
  lead?: string;
  /** filters, counters or actions pinned to the right of the title */
  aside?: ReactNode;
}

export const PageHead = ({ title, lead, aside }: PageHeadProps) => (
  <header className={styles.head}>
    <div className={styles.row}>
      <h2 className={styles.title}>{title}</h2>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </div>
    {lead ? <p className={styles.lead}>{lead}</p> : null}
  </header>
);
