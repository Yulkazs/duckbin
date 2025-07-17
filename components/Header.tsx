"use client";

import { useState } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { ThemeDropdown } from '@/components/selectors/Theme';
import { LanguageDropdown } from '@/components/selectors/Language';
import { getDefaultLanguage, type Language } from '@/utils/languages';

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
      className={`w-full ${className}`}
      style={{ 
        backgroundColor: theme.background,
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