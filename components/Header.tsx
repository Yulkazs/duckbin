// components/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { ThemeDropdown } from '@/components/selectors/Theme';
import { LanguageDropdown } from '@/components/selectors/Language';
import { getDefaultLanguage, type Language } from '@/utils/languages';
import { Github } from 'lucide-react';

interface HeaderProps {
  onLanguageChange?: (language: Language) => void;
  selectedLanguage?: string;
  onThemeChange?: (themeName: string) => void;
  selectedTheme?: string;
  isReadOnly?: boolean;
  showSnippetData?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLanguageChange,
  selectedLanguage = 'plaintext',
  onThemeChange,
  selectedTheme,
  isReadOnly = false,
  showSnippetData = false,
  className = ""
}) => {
  const { theme, currentTheme } = useThemeContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    if (!isReadOnly && onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const handleThemeChange = (themeName: string) => {
    if (!isReadOnly && onThemeChange) {
      onThemeChange(themeName);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Use selected theme if provided, otherwise use current theme
  const displayTheme = selectedTheme || currentTheme;

  return (
    <header 
      className={`w-full ${className}`}
      style={{ 
        backgroundColor: theme.background,
        paddingTop: '1.5rem',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop and Tablet Layout */}
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Now clickable */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity">
            <img
              src={theme.logo}
              alt="Duckbin Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
            />
            <h1 
              className="hidden sm:block text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{ 
                color: theme.primary,
                fontFamily: 'var(--font-krona-one)'
              }}
            >
              duckbin
            </h1>
          </Link>

          {/* Desktop Controls and GitHub Link */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <LanguageDropdown 
                value={selectedLanguage}
                onChange={handleLanguageChange}
                disabled={isReadOnly}
                showSnippetData={showSnippetData}
              />
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <ThemeDropdown 
                onThemeChange={handleThemeChange}
                selectedTheme={displayTheme}
                disabled={isReadOnly}
                showSnippetData={showSnippetData}
              />
            </div>

            {/* GitHub Link */}
            <a 
              href="https://github.com/Yulkazs/duckbin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: theme.primary }}
            >
              <Github size={24} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="relative z-30 flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Toggle mobile menu"
            style={{ color: theme.primary }}
          >
            <div className="relative w-6 h-6">
              {/* Top line */}
              <span
                className={`absolute top-1/2 left-0 w-full h-[2px] bg-current transform transition duration-300 ease-in-out origin-center ${
                  isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
              />
              {/* Bottom line */}
              <span
                className={`absolute top-1/2 left-0 w-full h-[2px] bg-current transform transition duration-300 ease-in-out origin-center ${
                  isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu (collapsible) */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100 py-4' : 'opacity-0 h-0'
            }`} style={{ overflow: isMobileMenuOpen ? 'visible' : 'hidden' }}>
          <div className="py-4 space-y-4 border-t" style={{ borderColor: theme.primary }}>
            {/* Language Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="w-full sm:w-auto">
                <LanguageDropdown 
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  disabled={isReadOnly}
                  showSnippetData={showSnippetData}
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="w-full sm:w-auto">
                <ThemeDropdown 
                  onThemeChange={handleThemeChange}
                  selectedTheme={displayTheme}
                  disabled={isReadOnly}
                  showSnippetData={showSnippetData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;