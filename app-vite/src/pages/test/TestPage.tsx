import { useMemo, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { MODES, poolFor, type TestModeId } from "@/shared/data/testModes";
import { TestRunner } from "./TestRunner";
import { Button, Card, Label, PageHead, Tag } from "@/shared/ui";
import styles from "./TestPage.module.css";

export const TestPage = () => {
  const t = useT();
  const level = useAppStore((s) => s.level);
  const testMisses = useAppStore((s) => s.testMisses);
  const testRuns = useAppStore((s) => s.testRuns);
  const setLevel = useAppStore((s) => s.setLevel);
  const [running, setRunning] = useState<TestModeId | null>(null);

  const missCount = Object.keys(testMisses).length;
  const mode = running ? MODES.find((m) => m.id === running) : null;

  const sizes = useMemo(
    () =>
      Object.fromEntries(
        MODES.map((m) => [
          m.id,
          m.id === "errors" ? missCount : poolFor(m, m.blocks?.[0]).length,
        ])
      ) as Record<TestModeId, number>,
    [missCount]
  );

  if (mode) return <TestRunner mode={mode} onExit={() => setRunning(null)} />;

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("тесты")}
        lead={t(
          "общий тест: шесть блоков от A1 до C2 — покажет потолок и слабые темы. Плюс отдельные тесты по грамматике, лексике и сленгу."
        )}
        aside={level ? <Tag>{level}</Tag> : null}
      />

      {level ? (
        <Card tone="accent">
          <Label>{t("Твой уровень по тесту:")}</Label>
          <div className={styles.levelBig}>{level}</div>
          <p className={styles.note}>
            {t("Уровень стоит в заголовке сайта. Пройди общий тест заново, когда почувствуешь, что вырос.")}
          </p>
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => setRunning("general")}>
              {t("пройти заново")}
            </Button>
            <Button onClick={() => setLevel("")}>{t("сбросить уровень")}</Button>
          </div>
        </Card>
      ) : (
        <Card tone="warn">
          <Label>{t("Не знаешь, с чего начать?")}</Label>
          <p className={styles.note}>
            {t("Правило жёсткое: чтобы открыть следующий уровень, нужно набрать три четверти блока. Не набрал — тест останавливается, и этот уровень становится твоим.")}
          </p>
          <Button variant="primary" onClick={() => setRunning("general")}>
            {t("пройти тест")}
          </Button>
        </Card>
      )}

      <div className={styles.modes}>
        {MODES.map((m) => {
          const run = testRuns[m.id];
          const empty = m.id === "errors" && !missCount;
          return (
            <Card key={m.id} onPress={empty ? undefined : () => setRunning(m.id)}>
              <Label>{t(m.n)}</Label>
              <p className={styles.modeLead}>{t(m.lead)}</p>
              <div className={styles.modeMeta}>
                <span>
                  {m.blocks
                    ? `${m.blocks.length} ${t("блоков")} · ${m.len} ${t("вопросов в блоке")}`
                    : `${m.len} ${t("вопросов")}`}
                </span>
                <span className={styles.small}>
                  {empty
                    ? t("промахов пока нет")
                    : `${sizes[m.id]} ${t(m.id === "errors" ? "в списке" : "в банке")}`}
                </span>
                {run ? (
                  <span className={styles.small}>{`${t("прошлый раз")} ${run.right}/${run.total}`}</span>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      <Card flat>
        <p className={styles.note}>
          {t("не гугли и не угадывай — смысл в том, чтобы найти дыры, а не набрать балл")}
        </p>
      </Card>
    </div>
  );
};
