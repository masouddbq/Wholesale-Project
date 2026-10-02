export const THEME_KEY = "am-theme";

const DARK_VARS: Record<string, string> = {
  "--background": "#121212",
  "--foreground": "#f3f3f3",
  "--surface": "#1b1b1b",
  "--mutedbg": "#242424",
  "--text-primary": "#f3f3f3",
  "--text-secondary": "#c8c8c8",
  "--text-muted": "#9a9a9a",
  "--border": "#2f2f2f",
  "--border-strong": "#424242",
};

export function applyTheme(isDark: boolean) {
  const root = document.documentElement;

  root.classList.toggle("dark", isDark);

  Object.keys(DARK_VARS).forEach((key) => {
    if (isDark) {
      root.style.setProperty(key, DARK_VARS[key]);
    } else {
      root.style.removeProperty(key);
    }
  });
}

export function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}
