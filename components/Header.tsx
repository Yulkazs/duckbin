"use client";

import { useState } from 'react';
import { useThemeContext } from '@/components/ThemeProvider';
import { ThemeDropdown } from '@/components/selectors/Theme';
import { LanguageDropdown } from '@/components/selectors/Language';
import { getDefaultLanguage, type Language } from '@/lib/languages';

interface HeaderProps {
  onLanguageChange?: (language: Language) => void;
  selectedLanguage?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLanguageChange,
  selectedLanguage = 'plaintext',
  className = ""
}) => {
  const { theme } = useThemeContext();

  const handleLanguageChange = (language: Language) => {
    onLanguageChange?.(language);
  };

  return (
    <header 
      className={`w-full border-b ${className}`}
      style={{ 
        backgroundColor: theme.background,
        borderColor: theme.primary 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img
              src={theme.logo}
              alt="Duckbin Logo"
              className="w-12 h-12"
            />
            <h1 
              className="text-xl font-display font-bold"
              style={{ color: theme.primary }}
            >
              duckbin
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium hidden sm:block"
                style={{ color: theme.primary }}
              >
                Language:
              </span>
              <LanguageDropdown 
                value={selectedLanguage}
                onChange={handleLanguageChange}
              />
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium hidden sm:block"
                style={{ color: theme.primary }}
              >
                Theme:
              </span>
              <ThemeDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;