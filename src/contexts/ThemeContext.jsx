import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_VIBE, vibes } from "../theme/vibes";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "theme";

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && vibes[saved] ? saved : DEFAULT_VIBE;
  });

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(vibes[currentTheme].colors).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });

    // Tells the browser to render form controls and scrollbars dark.
    root.style.colorScheme = "dark";
    localStorage.setItem(STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  const changeTheme = useCallback((name) => {
    if (vibes[name]) setCurrentTheme(name);
  }, []);

  const value = useMemo(
    () => ({
      currentTheme,
      themes: Object.keys(vibes),
      themeNames: Object.entries(vibes).map(([key, vibe]) => ({
        key,
        name: vibe.name,
        accent: vibe.colors["--color-primary"],
      })),
      changeTheme,
    }),
    [currentTheme, changeTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
