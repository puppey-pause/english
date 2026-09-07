import { useRef, useState } from "react";
import { useAppStore } from "@/app/store";
import { useT } from "@/shared/i18n/useT";
import { Button, Card, Label, Textarea } from "@/shared/ui";
import styles from "./Backup.module.css";

/** Только данные ученика: интерфейсные состояния переносить незачем. */
const FIELDS = ["done", "rev", "box", "notes", "levels", "words", "mistakes", "theme", "lang"] as const;

const stamp = (): string => new Date().toISOString().slice(0, 10);

const collect = (): Record<string, unknown> => {
  const s = useAppStore.getState() as unknown as Record<string, unknown>;
  const payload: Record<string, unknown> = { app: "english-roadmap", version: 3 };
  for (const key of FIELDS) payload[key] = s[key];
  return payload;
};

/** btoa не переваривает кириллицу, поэтому строка сначала уходит в utf-8. */
const encode = (data: unknown): string =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(data))));

const decode = (code: string): Record<string, unknown> =>
  JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code.trim()), (c) => c.charCodeAt(0))));

export const Backup = () => {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");

  const apply = (data: Record<string, unknown>): boolean => {
    if (data.app !== "english-roadmap") return false;
    const patch: Record<string, unknown> = {};
    for (const key of FIELDS) if (key in data) patch[key] = data[key];
    useAppStore.setState(patch as never);
    return true;
  };

  const copyCode = async () => {
    const text = encode(collect());
    setCode(text);
    try {
      await navigator.clipboard.writeText(text);
      setNote(t("Код скопирован. Отправь его себе в сообщении, а на другом устройстве вставь сюда же."));
    } catch {
      setNote(t("Код в поле ниже — выдели его и скопируй вручную."));
    }
  };

  const applyCode = () => {
    try {
      if (!apply(decode(code))) {
        setNote(t("Это не код прогресса — проверь, что скопировал строку целиком."));
        return;
      }
      setNote(t("Прогресс перенесён."));
    } catch {
      setNote(t("Код не читается — скорее всего, скопировался не полностью."));
    }
  };

  const saveFile = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(collect(), null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `английский-прогресс-${stamp()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNote(t("Файл скачан."));
  };

  const loadFile = async (file: File) => {
    try {
      if (!apply(JSON.parse(await file.text()) as Record<string, unknown>)) {
        setNote(t("Это не файл прогресса."));
        return;
      }
      setNote(t("Прогресс загружен."));
    } catch {
      setNote(t("Файл не читается."));
    }
  };

  const wipe = () => {
    if (!window.confirm(t("Стереть весь прогресс? Отменить это будет нельзя."))) return;
    useAppStore.setState({ done: {}, rev: {}, box: {}, notes: {}, levels: {}, words: [], mistakes: [] } as never);
    setNote(t("Всё стёрто — начинаешь с чистого листа."));
  };

  return (
    <Card flat>
      <Label>{t("свои данные")}</Label>
      <p className={styles.hint}>
        {t("Прогресс хранится в этом браузере. Чтобы перенести его на телефон или не потерять при чистке истории — скопируй код и отправь себе в сообщении.")}
      </p>

      <div className={styles.row}>
        <Button variant="primary" onClick={copyCode}>
          {t("скопировать код")}
        </Button>
        <Button onClick={applyCode} disabled={!code.trim()}>
          {t("применить код")}
        </Button>
      </div>

      <Textarea
        rows={3}
        value={code}
        placeholder={t("код прогресса — сюда же вставляется тот, что пришёл с другого устройства")}
        onChange={(e) => setCode(e.target.value)}
      />

      <div className={styles.row}>
        <Button onClick={saveFile}>{t("выгрузить в файл")}</Button>
        <Button onClick={() => fileRef.current?.click()}>{t("загрузить из файла")}</Button>
        <Button variant="danger" onClick={wipe}>
          {t("стереть всё")}
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className={styles.file}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void loadFile(file);
          e.target.value = "";
        }}
      />

      {note ? <p className={styles.note}>{note}</p> : null}
    </Card>
  );
};
