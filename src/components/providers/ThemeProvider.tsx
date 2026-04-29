'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'ln-theme';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: SSR returns 'dark'; client picks up real theme from data-theme
  // set by the no-flash script in <head> before hydration.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'dark';
    const dom = document.documentElement.dataset.theme;
    if (dom === 'light' || dom === 'dark') return dom;
    return 'dark';
  });

  // Sync data-theme attribute whenever theme changes (no setState here — this is fine)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
