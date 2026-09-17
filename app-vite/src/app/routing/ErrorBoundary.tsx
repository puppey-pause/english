import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  message: string;
}

/**
 * Без этого любая ошибка внутри экрана даёт пустой белый лист и приходится
 * лезть в консоль. Здесь она видна текстом прямо на странице.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return { message: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error("экран упал", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.message) return this.props.children;
    return (
      <div style={{ display: "grid", gap: 12, padding: "24px 0", maxWidth: 620 }}>
        <h2 style={{ fontSize: 22, margin: 0 }}>Экран не открылся</h2>
        <p style={{ margin: 0, color: "var(--ink2)" }}>
          Остальные разделы работают — можно уйти на другой и вернуться.
        </p>
        <code style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent-ink)", overflowWrap: "anywhere" }}>
          {this.state.message}
        </code>
        <button
          type="button"
          onClick={() => this.setState({ message: "" })}
          style={{
            font: "inherit",
            fontSize: 15,
            justifySelf: "start",
            padding: "7px 16px",
            border: "1px solid var(--line2)",
            borderRadius: "var(--r-pill)",
            background: "var(--panel)",
            color: "var(--ink2)",
            cursor: "pointer",
          }}
        >
          попробовать снова
        </button>
      </div>
    );
  }
}
