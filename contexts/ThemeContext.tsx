import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@constants/colors';

type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  white: string;
}

const LIGHT_COLORS: ThemeColors = {
  background:    Colors.background,
  surface:       Colors.surface,
  border:        Colors.border,
  divider:       Colors.divider,
  textPrimary:   Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  textMuted:     Colors.textMuted,
  white:         Colors.white,
};

const DARK_COLORS: ThemeColors = {
  background:    Colors.dark.background,
  surface:       Colors.dark.surface,
  border:        Colors.dark.border,
  divider:       '#1e293b',
  textPrimary:   Colors.dark.textPrimary,
  textSecondary: Colors.dark.textSecondary,
  textMuted:     '#475569',
  white:         Colors.dark.surface,
};

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const STORAGE_KEY = '@muaafa_theme';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  isDark: false,
  colors: LIGHT_COLORS,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load persisted theme on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => { if (stored === 'dark' || stored === 'light') setTheme(stored); })
      .catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const value: ThemeContextValue = {
    theme,
    isDark: theme === 'dark',
    colors: theme === 'dark' ? DARK_COLORS : LIGHT_COLORS,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access current theme colors and toggle function from any component. */
export function useTheme() {
  return useContext(ThemeContext);
}
