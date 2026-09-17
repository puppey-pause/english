type Navigate = (path: string) => void;

let current: Navigate | null = null;

/** Роутер отдаёт свой navigate сюда, чтобы store мог переходить без хуков. */
export const setNavigator = (fn: Navigate | null): void => {
  current = fn;
};

export const navigateTo = (path: string): void => {
  if (current) current(path);
  else window.location.hash = `#${path}`;
};
