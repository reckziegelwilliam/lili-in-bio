'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setTheme: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'theme_preference';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredPreference(): ThemePreference | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as ThemePreference;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

function storePreference(preference: ThemePreference): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // localStorage not available
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize from stored preference or system
  useEffect(() => {
    const stored = getStoredPreference();
    const pref = stored || 'system';
    setPreference(pref);
    setResolvedTheme(pref === 'system' ? getSystemTheme() : pref);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (preference === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const setTheme = (newPreference: ThemePreference) => {
    setPreference(newPreference);
    storePreference(newPreference);
    setResolvedTheme(newPreference === 'system' ? getSystemTheme() : newPreference);
  };

  const toggleTheme = () => {
    if (preference === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else if (preference === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const value: ThemeContextType = {
    theme: resolvedTheme,
    preference,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
