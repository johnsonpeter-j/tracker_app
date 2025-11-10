"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "tracker-theme";

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (mode: "light" | "dark") => {
  document.documentElement.setAttribute("data-theme", mode);
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initial load
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = storedTheme ?? "system";
    setThemeState(initialTheme);
    const initialResolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
    setResolvedTheme(initialResolved);
    applyTheme(initialResolved);
    setMounted(true);
  }, []);

  // React to theme changes
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const nextResolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  // Listen for system changes when in system mode
  useEffect(() => {
    if (!mounted || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextResolved = getSystemTheme();
      setResolvedTheme(nextResolved);
      applyTheme(nextResolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const setTheme = (value: Theme) => {
    setThemeState(value);
  };

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () => {
        setThemeState((current) => {
          if (current === "light") {
            return "dark";
          }
          if (current === "dark") {
            return "light";
          }
          return getSystemTheme() === "dark" ? "light" : "dark";
        });
      },
    }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}



