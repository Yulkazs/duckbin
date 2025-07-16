// components/ThemeProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/lib/colors';

interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  changeTheme: (themeName: string) => void;
  themes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeSelector: React.FC = () => {
  const { currentTheme, changeTheme, themes } = useThemeContext();

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => changeTheme(key)}
          className={`
            px-3 py-1 rounded-md border transition-all duration-200
            ${currentTheme === key 
              ? 'bg-theme text-theme border-theme' 
              : 'bg-transparent text-theme border-theme hover:bg-theme hover:bg-opacity-10'
            }
          `}
          style={{
            borderColor: theme.primary,
            color: theme.primary,
          }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

export const ThemeLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme } = useThemeContext();

  return (
    <img
      src={theme.logo}
      alt="Duckbin Logo"
      className={className}
    />
  );
};