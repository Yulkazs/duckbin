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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    onLanguageChange?.(language);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        {/* Desktop and Tablet Layout */}
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={theme.logo}
              alt="Duckbin Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
            <h1 
              className="text-lg sm:text-xl font-display font-bold"
              style={{ color: theme.primary }}
            >
              duckbin
            </h1>
          </div>

          {/* Desktop Controls (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm font-medium"
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
                className="text-sm font-medium"
                style={{ color: theme.primary }}
              >
                Theme:
              </span>
              <ThemeDropdown />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            style={{ 
              color: theme.primary,
            }}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu (collapsible) */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-4 border-t" style={{ borderColor: theme.primary }}>
            {/* Language Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: theme.primary }}
              >
                Language:
              </span>
              <div className="w-full sm:w-auto">
                <LanguageDropdown 
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: theme.primary }}
              >
                Theme:
              </span>
              <div className="w-full sm:w-auto">
                <ThemeDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;