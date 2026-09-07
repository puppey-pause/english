import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { STAGES } from "@/entities/stage";
import { LAYERS, LAYER_COLOR } from "@/shared/config";
import { Card, Label, PageHead } from "@/shared/ui";
import styles from "./MapPage.module.css";

export const MapPage = () => {
  const t = useT();
  const done = useAppStore((s) => s.done);
  const setView = useAppStore((s) => s.setView);
  const setOpenTopic = useAppStore((s) => s.setOpenTopic);

  const totals = LAYERS.map((layer) => {
    const all = STAGES.flatMap((s) => s.topics).filter((tp) => tp.layer === layer);
    return { layer, all: all.length, done: all.filter((tp) => done[tp.k]).length };
  });

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("карта слоёв")}
        lead={t("Шесть слоёв идут параллельно. Строка — этап, столбец — слой: видно, где пусто.")}
      />

      <div className={styles.legend}>
        {totals.map((x) => (
          <div key={x.layer} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: LAYER_COLOR[x.layer] }} aria-hidden />
            <span>{t(x.layer)}</span>
            <span className={styles.legendNum}>{`${x.done}/${x.all}`}</span>
          </div>
        ))}
      </div>

      <Card flat className={styles.gridCard}>
        <div className={styles.head}>
          <span className={styles.corner} />
          {LAYERS.map((layer) => (
            <span key={layer} className={styles.colHead}>
              {t(layer)}
            </span>
          ))}
        </div>

        {STAGES.map((stage, i) => (
          <div key={stage.num} className={styles.stageRow}>
            <button
              type="button"
              className={styles.rowHead}
              onClick={() => setView("learn", i)}
              title={t(stage.title)}
            >
              <span className={styles.num}>{stage.num}</span>
              <span className={styles.stageName}>{t(stage.title)}</span>
              <span className={styles.level}>{t(stage.level)}</span>
            </button>

            <div className={styles.cells}>
              {LAYERS.map((layer) => {
                const topics = stage.topics.filter((tp) => tp.layer === layer);
                if (!topics.length) return <span key={layer} className={styles.empty} />;
                return (
                  <div key={layer} className={styles.cell}>
                    {topics.map((tp) => (
                      <button
                        key={tp.k}
                        type="button"
                        title={`${t(tp.name)} — ${t(tp.desc)}`}
                        onClick={() => {
                          setOpenTopic(tp.k);
                          setView("learn", i);
                        }}
                        className={[styles.pip, done[tp.k] && styles.pipDone].filter(Boolean).join(" ")}
                        style={done[tp.k] ? { background: LAYER_COLOR[layer], borderColor: LAYER_COLOR[layer] } : { borderColor: LAYER_COLOR[layer] }}
                      >
                        <span className={styles.srOnly}>{t(tp.name)}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Card>

      <Label>{t("Заполненная точка — тема пройдена. Нажми на точку, чтобы открыть разбор.")}</Label>
    </div>
  );
};
