"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { themes, type Theme } from '@/utils/colors';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('dark');
  const [theme, setTheme] = useState<Theme>(themes.dark);
  const [userSelectedTheme, setUserSelectedTheme] = useState<string>('dark');
  const pathname = usePathname();
  
  const isSlugPage = pathname !== '/';

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('duckbin-theme') || 'dark';
    if (themes[savedTheme]) {
      setUserSelectedTheme(savedTheme);
      if (!isSlugPage) {
        setCurrentTheme(savedTheme);
        setTheme(themes[savedTheme]);
      }
    } else {
      setUserSelectedTheme('dark');
      if (!isSlugPage) {
        setCurrentTheme('dark');
        setTheme(themes.dark);
      }
    }
  }, [isSlugPage]);

  // Handle route changes
  useEffect(() => {
    if (!isSlugPage) {
      setCurrentTheme(userSelectedTheme);
      setTheme(themes[userSelectedTheme]);
    }
  }, [pathname, userSelectedTheme, isSlugPage]);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--primary', theme.primary);
    
    document.body.className = document.body.className.replace(/theme-\w+/, '');
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme, theme]);

  const changeTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      setTheme(themes[themeName]);
      
      if (!isSlugPage) {
        setUserSelectedTheme(themeName);
        localStorage.setItem('duckbin-theme', themeName);
      }
    }
  };

  return {
    currentTheme,
    theme,
    changeTheme,
    themes,
    isSlugPage,
    userSelectedTheme,
  };
};