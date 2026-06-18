import { useEffect, useState } from "react";
import { useUIStore } from "../../chrome/store/uiStore";

/**
 * Custom hook to monitor UI theme settings and apply the selected theme
 * to the document root element. Subscribes to system media query changes
 * when theme is set to 'system'.
 *
 * @returns The active resolved theme ('light' or 'dark')
 */
export function useTheme(): "light" | "dark" {
  const theme = useUIStore((state) => state.theme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  });

  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent): void => {
      setResolvedTheme(e.matches ? "dark" : "light");
    };

    // Update state to match current system preference immediately
    setResolvedTheme(mediaQuery.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  useEffect(() => {
    if (resolvedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [resolvedTheme]);

  return resolvedTheme;
}
