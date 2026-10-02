"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { applyTheme, isDarkTheme, THEME_KEY } from "@/lib/theme";

type ThemeToggleProps = {
  className?: string;
  iconSize?: number;
};

export default function ThemeToggle({
  className = "",
  iconSize = 18,
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkTheme());
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkTheme();

    applyTheme(nextDark);
    localStorage.setItem(THEME_KEY, nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "حالت روشن" : "حالت تیره"}
      title={isDark ? "حالت روشن" : "حالت تیره"}
      className={`theme-toggle flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-primary)] ${className || "h-11 w-11"}`}
    >
      {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
    </button>
  );
}
