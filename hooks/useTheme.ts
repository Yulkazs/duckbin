"use client";

import { useState, useEffect } from 'react';
import { themes, getTheme, type Theme } from '@/utils/colors';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('dark');
  const [theme, setTheme] = useState<Theme>(themes.dark);

  useEffect(() => {
    const savedTheme = localStorage.getItem('duckbin-theme') || 'dark';
    if (themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      setTheme(themes[savedTheme]);
    } else {
      setCurrentTheme('dark');
      setTheme(themes.dark);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--primary', theme.primary);
    
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    document.body.classList.add(`theme-${currentTheme}`);
    
    localStorage.setItem('duckbin-theme', currentTheme);
  }, [currentTheme, theme]);

  const changeTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      setTheme(themes[themeName]);
    }
  };

  return {
    currentTheme,
    theme,
    changeTheme,
    themes,
  };
};