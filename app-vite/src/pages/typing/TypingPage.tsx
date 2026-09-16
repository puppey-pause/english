import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import {
  TYPING_PACKS,
  TYPING_RUN,
  linesFromMistakes,
  linesFromText,
  type TypingLine,
} from "@/shared/data/typing";
import { shuffle } from "@/shared/lib/random";
import { speak } from "@/shared/lib/speech";
import {
  clickBack,
  clickKey,
  clickSpace,
  setSoundOn,
  soundDone,
  soundOn,
  soundRunEnd,
  soundWrong,
} from "@/shared/lib/keySound";
import { Button, Card, Chip, Label, PageHead, ProgressBar, Tag, Textarea } from "@/shared/ui";
import styles from "./TypingPage.module.css";

type Mode = "recall" | "bank" | "copy" | "dict" | "gap";

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "recall", label: "по памяти", desc: "виден перевод и подсказка по словам — английскую фразу печатаешь сам" },
  { id: "bank", label: "из слов", desc: "слова фразы даны вразбивку — набираешь их в правильном порядке" },
  { id: "copy", label: "копия", desc: "фраза перед глазами — набираешь её буква в букву" },
  { id: "dict", label: "диктант", desc: "только звук — печатаешь то, что услышал" },
  { id: "gap", label: "пропуск", desc: "фраза целиком, печатаешь одно пропущенное слово" },
];

/** мягкая сверка: регистр, апострофы и знаки в конце не считаются ошибкой */
const soften = (ch: string): string => {
  const c = ch.toLowerCase();
  return c === "\u2019" || c === "\u02bc" ? "'" : c;
};

const same = (a: string, b: string): boolean => soften(a) === soften(b);

/** Индекс первой неверной буквы либо -1, если набранное — верный префикс. */
const firstWrong = (typed: string, target: string): number => {
  for (let i = 0; i < typed.length; i += 1) {
    if (i >= target.length || !same(typed[i], target[i])) return i;
  }
  return -1;
};

const isDone = (typed: string, target: string): boolean => {
  const a = typed.trim();
  const b = target.trim();
  if (firstWrong(a, b) !== -1) return false;
  if (a.length === b.length) return true;
  // прощаем недобитый знак в конце
  return b.length - a.length === 1 && /[.!?,]$/.test(b) && a.length > 0;
};

/** Для режима «пропуск»: самое длинное значимое слово — его и печатаем. */
const gapOf = (en: string): { word: string; shown: string } => {
  const parts = en.split(" ");
  let at = 0;
  parts.forEach((p, i) => {
    if (p.replace(/[^A-Za-z']/g, "").length > parts[at].replace(/[^A-Za-z']/g, "").length) at = i;
  });
  const word = parts[at].replace(/[^A-Za-z']/g, "");
  const shown = parts.map((p, i) => (i === at ? p.replace(word, "\u2026") : p)).join(" ");
  return { word, shown };
};

const gradeOf = (errs: number, revealed: boolean): string => {
  if (revealed) return "с подсказкой";
  if (errs === 0) return "Perfect";
  if (errs <= 2) return "Good";
  return "Ок";
};

export const TypingPage = () => {
  const t = useT();
  const addMistake = useAppStore((s) => s.addMistake);
  const finishTest = useAppStore((s) => s.finishTest);
  const runs = useAppStore((s) => s.testRuns);
  const mistakes = useAppStore((s) => s.mistakes);

  const [mode, setMode] = useState<Mode>("recall");
  const [packId, setPackId] = useState<string>(TYPING_PACKS[0].id);
  const [custom, setCustom] = useState("");
  const [sound, setSound] = useState(soundOn());
  /** скелет фразы (сколько слов и первые буквы) — включается до начала, не кнопкой по ходу */
  const [hints, setHints] = useState(true);
  const [queue, setQueue] = useState<TypingLine[]>([]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phraseErr, setPhraseErr] = useState(0);
  const [grade, setGrade] = useState("");
  const [right, setRight] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [errors, setErrors] = useState(0);
  const [chars, setChars] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [over, setOver] = useState(false);

  const field = useRef<HTMLInputElement>(null);
  const lastWrong = useRef(-1);

  const mineLines = useMemo(() => linesFromMistakes(mistakes), [mistakes]);
  const customLines = useMemo(() => linesFromText(custom), [custom]);

  const pool: TypingLine[] =
    packId === "mine" ? mineLines : packId === "custom" ? customLines : (TYPING_PACKS.find((p) => p.id === packId) ?? TYPING_PACKS[0]).lines;

  const packLabel =
    packId === "mine" ? "мои ошибки" : packId === "custom" ? "свой текст" : (TYPING_PACKS.find((p) => p.id === packId) ?? TYPING_PACKS[0]).label;

  const line = queue[idx];
  const gap = useMemo(() => (line && mode === "gap" ? gapOf(line.en) : null), [line, mode]);
  const target = gap ? gap.word : line?.en ?? "";
  const wrongAt = useMemo(() => firstWrong(typed, target), [typed, target]);
  const complete = !!line && isDone(typed, target);
  const record = runs["печать"];

  // в режиме «из слов» — те же слова, но вразбивку
  const bank = useMemo(
    () => (line && mode === "bank" ? shuffle(line.en.replace(/[.!?]$/, "").split(" ")) : []),
    [line, mode]
  );
  const typedWords = typed.trim().length ? typed.trim().split(/\s+/).length : 0;

  const deal = useCallback(() => {
    setQueue(shuffle(pool).slice(0, TYPING_RUN));
    setIdx(0);
    setTyped("");
    setRevealed(false);
    setFailed(false);
    setPhraseErr(0);
    setGrade("");
    setRight(0);
    setPerfect(0);
    setCombo(0);
    setBest(0);
    setErrors(0);
    setChars(0);
    setStartedAt(0);
    setElapsed(0);
    setOver(false);
    lastWrong.current = -1;
    requestAnimationFrame(() => field.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packId, mode, pool.length]);

  useEffect(() => {
    deal();
  }, [deal]);

  useEffect(() => {
    if (!startedAt || over) return;
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), 500);
    return () => window.clearInterval(id);
  }, [startedAt, over]);

  // в диктанте фраза звучит сама при появлении
  useEffect(() => {
    if (mode === "dict" && line) speak(line.en);
  }, [mode, line]);

  const minutes = elapsed / 60000;
  const cpm = minutes > 0.05 ? Math.round(chars / minutes) : 0;
  const accuracy = chars + errors > 0 ? Math.round((chars / (chars + errors)) * 100) : 100;

  const next = (scored: boolean, wasPerfect: boolean) => {
    if (idx + 1 >= queue.length) {
      setOver(true);
      soundRunEnd();
      finishTest("печать", right + (scored ? 1 : 0), queue.length);
      if (wasPerfect) setPerfect((n) => n + 1);
      return;
    }
    setIdx(idx + 1);
    setTyped("");
    setRevealed(false);
    setFailed(false);
    setPhraseErr(0);
    setGrade("");
    lastWrong.current = -1;
    requestAnimationFrame(() => field.current?.focus());
  };

  const submit = () => {
    if (!line) return;
    if (complete) {
      soundDone();
      const g = gradeOf(phraseErr, revealed);
      setGrade(g);
      if (g === "Perfect") setPerfect((n) => n + 1);
      const c = combo + 1;
      setCombo(c);
      setBest(Math.max(best, c));
      setRight(right + 1);
      // голосом — фразу целиком, даже если печатали только пропуск
      if (sound) window.setTimeout(() => speak(line.en), 260);
      window.setTimeout(() => next(true, g === "Perfect"), 620);
      return;
    }
    soundWrong();
    setCombo(0);
    if (!failed) {
      setFailed(true);
      setRevealed(true);
      addMistake(typed.trim() || "\u2014", target, t("Набрано неверно при печати"), "печать");
      return;
    }
    next(false, false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "Backspace") {
      clickBack();
      return;
    }
    if (e.key.length !== 1) return;
    if (e.key === " ") clickSpace();
    else clickKey();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startedAt) setStartedAt(Date.now());
    if (value.length > typed.length) {
      const at = firstWrong(value, target);
      if (at !== -1 && at >= typed.length) {
        if (lastWrong.current !== at) {
          soundWrong();
          setErrors((n) => n + 1);
          setPhraseErr((n) => n + 1);
          lastWrong.current = at;
        }
      } else {
        setChars((n) => n + (value.length - typed.length));
        lastWrong.current = -1;
      }
    }
    setTyped(value);
  };

  const toggleSound = () => {
    const v = !sound;
    setSound(v);
    setSoundOn(v);
  };

  /** посимвольная отрисовка: набрано / ошибка / осталось */
  const glyphs = () => {
    const ghost = mode === "copy" || mode === "gap" || revealed || (mode !== "dict" && !line?.ru);
    const len = ghost ? Math.max(target.length, typed.length) : typed.length;
    const out: ReactNode[] = [];
    for (let i = 0; i < len; i += 1) {
      const typedCh = typed[i];
      const bad = typedCh !== undefined && wrongAt !== -1 && i >= wrongAt;
      const cls = [styles.g, typedCh === undefined ? styles.pending : bad ? styles.bad : styles.good].join(" ");
      const ch = typedCh ?? target[i] ?? "";
      out.push(
        <span key={i} className={cls}>
          {ch === " " ? "\u00a0" : ch}
          {i === typed.length - 1 ? <i className={styles.caret} /> : null}
        </span>
      );
    }
    if (typed.length === 0) out.push(<i key="caret" className={styles.caret} />);
    return out;
  };

  const empty = pool.length === 0;

  return (
    <div className={styles.wrap}>
      <PageHead
        title={t("печать текста")}
        lead={t("Печатаешь фразу целиком — проверка идёт по буквам, со звуком клавиш. Медленнее, чем выбрать вариант, зато остаётся в пальцах.")}
        aside={<Tag>{record ? `${t("лучший подход")}: ${record.right}/${record.total}` : `${pool.length} ${t("фраз")}`}</Tag>}
      />

      <div className={styles.tabs}>
        {MODES.map((m) => (
          <Chip key={m.id} label={t(m.label)} active={m.id === mode} onClick={() => setMode(m.id)} />
        ))}
      </div>
      <p className={styles.modeDesc}>{t(MODES.find((m) => m.id === mode)?.desc ?? "")}</p>

      <div className={styles.tabs}>
        {TYPING_PACKS.map((p) => (
          <Chip key={p.id} label={t(p.label)} active={p.id === packId} onClick={() => setPackId(p.id)} />
        ))}
        <Chip
          label={`${t("мои ошибки")} · ${mineLines.length}`}
          active={packId === "mine"}
          onClick={() => setPackId("mine")}
        />
        <Chip label={t("свой текст")} active={packId === "custom"} onClick={() => setPackId("custom")} />
      </div>

      <div className={styles.switches}>
        <button type="button" className={styles.switch} onClick={toggleSound} aria-pressed={sound}>
          {t(sound ? "звук: вкл" : "звук: выкл")}
        </button>
        <button type="button" className={styles.switch} onClick={() => setHints((v) => !v)} aria-pressed={hints}>
          {t(hints ? "скелет фразы: вкл" : "скелет фразы: выкл")}
        </button>
        <span className={styles.note}>{t("регистр и знаки в конце не считаются ошибкой")}</span>
      </div>

      {packId === "custom" ? (
        <Card flat>
          <Label>{t("свой текст")}</Label>
          <p className={styles.note}>{t("Вставь любой английский текст — он разойдётся на фразы по предложениям.")}</p>
          <div className={styles.field}>
            <Textarea
              rows={4}
              value={custom}
              placeholder={t("English text to type…")}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
        </Card>
      ) : null}

      {empty ? (
        <Card tone="warn">
          <Label>{t("пока нечего печатать")}</Label>
          <p className={styles.note}>
            {t(packId === "mine"
              ? "Журнал ошибок пуст: ошибки из тестов и тренажёра сами придут сюда на повтор."
              : "Вставь текст выше — и начнём.")}
          </p>
        </Card>
      ) : over ? (
        <Card tone="accent">
          <Label>{t("подход закончен")}</Label>
          <div className={styles.result}>
            <div className={styles.stat}>
              <b>{`${right}/${queue.length}`}</b>
              <span>{t("фраз с первого раза")}</span>
            </div>
            <div className={styles.stat}>
              <b>{perfect}</b>
              <span>Perfect</span>
            </div>
            <div className={styles.stat}>
              <b>{`${accuracy}%`}</b>
              <span>{t("точность ввода")}</span>
            </div>
            <div className={styles.stat}>
              <b>{cpm}</b>
              <span>{t("знаков в минуту")}</span>
            </div>
            <div className={styles.stat}>
              <b>{best}</b>
              <span>{t("лучшее комбо")}</span>
            </div>
          </div>
          <div className={styles.actions}>
            <Button onClick={deal}>{t("ещё десять фраз")}</Button>
          </div>
        </Card>
      ) : line ? (
        <>
          <div className={styles.meters}>
            <span className={styles.meter}>{`${t("фраза")} ${idx + 1}/${queue.length}`}</span>
            <span className={combo > 1 ? styles.comboHot : styles.meter}>{`${t("комбо")} ${combo}`}</span>
            <span className={styles.meter}>{`${t("точность ввода")} ${accuracy}%`}</span>
            <span className={styles.meter}>{`${cpm} ${t("зн/мин")}`}</span>
            <span className={styles.tagline}>{`${t(packLabel)} · ${t(line.tag)}`}</span>
          </div>
          <ProgressBar value={(idx / queue.length) * 100} />

          <Card flat className={styles.stage} onPress={() => field.current?.focus()}>
            {mode === "dict" ? (
              <div className={styles.taskRow}>
                <button type="button" className={styles.speak} onClick={() => speak(line.en)}>
                  {t("повторить звук")}
                </button>
                {revealed && line.ru ? <p className={styles.ru}>{line.ru}</p> : null}
              </div>
            ) : mode === "gap" && gap ? (
              <p className={styles.ru}>{gap.shown}</p>
            ) : line.ru ? (
              <p className={styles.ru}>{line.ru}</p>
            ) : null}

            {hints && mode === "recall" && line.ru ? (
              <p className={styles.words}>{`${line.en.split(" ").length} ${t("слов")} · ${line.en
                .split(" ")
                .map((w) => w[0])
                .join(" ")}`}</p>
            ) : null}

            {mode === "bank" ? (
              <div className={styles.bank}>
                {bank.map((w, i) => (
                  <span key={`${w}-${i}`} className={i < typedWords ? styles.wordUsed : styles.word}>
                    {w}
                  </span>
                ))}
              </div>
            ) : null}

            <div className={styles.line} aria-hidden="true">
              {glyphs()}
              {grade ? <span className={grade === "Perfect" ? styles.gradeTop : styles.grade}>{t(grade)}</span> : null}
            </div>

            <input
              ref={field}
              className={styles.input}
              value={typed}
              onChange={onChange}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label={t("поле набора")}
            />

            <div className={styles.actions}>
              <Button onClick={submit}>{t(complete ? "дальше" : failed ? "следующая фраза" : "проверить")}</Button>
              {mode !== "copy" && mode !== "gap" && !revealed ? (
                <button type="button" className={styles.ghost} onClick={() => setRevealed(true)}>
                  {t("показать фразу")}
                </button>
              ) : null}
              <span className={styles.kbd}>{t("Enter — проверить")}</span>
            </div>

            {failed ? (
              <p className={styles.why}>
                {`${t("верно так")}: `}
                <b>{target}</b>
                {` · ${t("фраза ушла в журнал ошибок")}`}
              </p>
            ) : null}
          </Card>
        </>
      ) : null}
    </div>
  );
};
