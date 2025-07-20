"use client";

import { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { ChevronDown } from 'lucide-react';

interface ThemeDropdownProps {
  className?: string;
  onThemeChange?: (themeName: string) => void;
  selectedTheme?: string;
  disabled?: boolean;
  showSnippetData?: boolean;
}

export const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ 
  className = "",
  onThemeChange,
  selectedTheme,
  disabled = false,
  showSnippetData = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, themes, theme } = useThemeContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use selectedTheme if provided, otherwise use currentTheme
  const displayTheme = selectedTheme || currentTheme;
  const currentThemeData = themes[displayTheme];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeName: string) => {
    if (!disabled) {
      if (onThemeChange) {
        // If onThemeChange is provided (editing mode), use it instead of changing globally
        onThemeChange(themeName);
      } else {
        // Default behavior - change theme globally
        changeTheme(themeName);
      }
      setIsOpen(false);
    }
  };

  const handleDropdownToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={handleDropdownToggle}
        disabled={disabled}
        className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 w-full sm:w-auto sm:min-w-[120px] ${
          disabled 
            ? 'cursor-not-allowed opacity-60' 
            : 'hover:bg-opacity-10 cursor-pointer'
        }`}
        style={{
          color: theme.primary,
          backgroundColor: isOpen ? `${theme.primary}10` : 'transparent',
        }}
      >
        <span className="text-m font-medium truncate">{currentThemeData.name}</span>
        {!disabled && (
          <ChevronDown 
            size={20} 
            className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && !disabled && (
        <div 
          className="absolute top-full left-0 mt-1 w-full sm:w-auto sm:min-w-[200px] max-w-xs sm:max-w-sm rounded-md border shadow-lg z-[55] max-h-48 sm:max-h-60 overflow-y-auto"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.primary,
          }}
        >
          {Object.entries(themes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={`
                w-full px-3 py-2 text-left flex items-center gap-2 transition-all duration-200 hover:bg-opacity-10 first:rounded-t-md last:rounded-b-md
                ${displayTheme === key ? 'font-semibold' : ''}
              `}
              style={{
                color: themeData.primary,
                backgroundColor: displayTheme === key ? `${themeData.primary}20` : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (displayTheme !== key) {
                  e.currentTarget.style.backgroundColor = `${themeData.primary}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (displayTheme !== key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: themeData.primary }}
              />
              <span className="text-sm flex-1 truncate">{themeData.name}</span>
              <div className="hidden sm:flex items-center gap-1 text-xs opacity-60 flex-shrink-0">
                <span className="truncate max-w-[4rem]">{themeData.background}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;