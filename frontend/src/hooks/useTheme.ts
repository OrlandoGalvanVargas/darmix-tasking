import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const DEFAULT_THEME: Theme = "light";

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: "#fdfcfb",
  dark: "#1a1c22",
};

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved: ResolvedTheme = theme === "system" ? getSystemTheme() : theme;
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[resolved]);
  }
  return resolved;
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* */
  }
  return DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") return;

    const mql = window.matchMedia(MEDIA_QUERY);
    const handler = () => {
      applyTheme("system");
      setThemeState((prev) => (prev === "system" ? "system" : prev));
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next);
    } catch {
      /* */
    }
    setThemeState(next);
  }, []);

  return { theme, resolvedTheme, setTheme };
}
