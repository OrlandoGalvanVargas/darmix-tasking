import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved: ResolvedTheme = theme === "system" ? getSystemTheme() : theme;
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }
  return resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    if (stored === "light" || stored === "dark" || stored === "system")
      return stored;
    return "system";
  });

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
    localStorage.setItem(STORAGE_KEYS.theme, next);
    setThemeState(next);
  }, []);

  return { theme, resolvedTheme, setTheme };
}
