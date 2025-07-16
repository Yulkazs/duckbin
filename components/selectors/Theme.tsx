"use client";

import { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/components/ThemeProvider';
import { ChevronDown } from 'lucide-react';

interface ThemeDropdownProps {
  className?: string;
}

export const ThemeDropdown: React.FC<ThemeDropdownProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, themes, theme } = useThemeContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    changeTheme(themeName);
    setIsOpen(false);
  };

  const currentThemeData = themes[currentTheme];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-200 hover:bg-opacity-10 min-w-[120px]"
        style={{
          borderColor: theme.primary,
          color: theme.primary,
          backgroundColor: isOpen ? `${theme.primary}20` : 'transparent',
        }}
      >
        <div className="flex items-center gap-2 flex-1">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="text-sm font-medium">{currentThemeData.name}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-full min-w-[200px] rounded-md border shadow-lg z-50 max-h-60 overflow-y-auto"
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
                ${currentTheme === key ? 'font-semibold' : ''}
              `}
              style={{
                color: themeData.primary,
                backgroundColor: currentTheme === key ? `${themeData.primary}20` : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== key) {
                  e.currentTarget.style.backgroundColor = `${themeData.primary}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: themeData.primary }}
              />
              <span className="text-sm">{themeData.name}</span>
              <div className="ml-auto flex items-center gap-1 text-xs opacity-60">
                <span>{themeData.background}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;