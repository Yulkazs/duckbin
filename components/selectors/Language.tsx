"use client";

import { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { ChevronDown, Search } from 'lucide-react';
import { languages, getLanguageById, searchLanguages, getDefaultLanguage, type Language } from '@/utils/languages';

interface LanguageDropdownProps {
  value?: string;
  onChange?: (language: Language) => void;
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  value = 'plaintext', 
  onChange,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLanguage = getLanguageById(value) || getDefaultLanguage();
  const filteredLanguages = searchQuery.trim() 
    ? searchLanguages(searchQuery)
    : languages;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleLanguageChange = (language: Language) => {
    onChange?.(language);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const getCategoryColor = (category: Language['category']) => {
    const colors = {
      programming: '#10b981',
      markup: '#f59e0b',
      scripting: '#8b5cf6',
      config: '#6b7280',
      data: '#3b82f6'
    };
    return colors[category] || '#6b7280';
  };

  // Group languages by category
  const groupedLanguages = filteredLanguages.reduce((acc, lang) => {
    if (!acc[lang.category]) {
      acc[lang.category] = [];
    }
    acc[lang.category].push(lang);
    return acc;
  }, {} as Record<string, Language[]>);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-200 hover:bg-opacity-10 w-full sm:w-auto sm:min-w-[140px]"
        style={{
          borderColor: theme.primary,
          color: theme.primary,
          backgroundColor: isOpen ? `${theme.primary}20` : 'transparent',
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 flex-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getCategoryColor(currentLanguage.category) }}
          />
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-full sm:w-auto sm:min-w-[280px] max-w-xs sm:max-w-sm rounded-md border shadow-lg z-[60]"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.primary,
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b" style={{ borderColor: theme.primary }}>
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-sm rounded border-none outline-none bg-transparent"
                style={{ color: theme.primary }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-48 sm:max-h-60 overflow-y-auto">
            {Object.entries(groupedLanguages).map(([category, langs]) => (
              <div key={category}>
                <div 
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-wider opacity-60 bg-opacity-5 sticky top-0 z-10"
                  style={{ 
                    color: theme.primary,
                    backgroundColor: `${theme.primary}10`
                  }}
                >
                  {category}
                </div>
                {langs.map((language) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageChange(language)}
                    className={`
                      w-full px-3 py-2 text-left flex items-center gap-2 transition-all duration-200 hover:bg-opacity-10
                      ${currentLanguage.id === language.id ? 'font-semibold' : ''}
                    `}
                    style={{
                      color: theme.primary,
                      backgroundColor: currentLanguage.id === language.id ? `${theme.primary}20` : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (currentLanguage.id !== language.id) {
                        e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentLanguage.id !== language.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(language.category) }}
                    />
                    <span className="text-sm flex-1 truncate">{language.name}</span>
                    <div className="hidden sm:flex items-center gap-1 text-xs opacity-60 flex-shrink-0">
                      <span>.{language.extension}</span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="p-4 text-center text-sm opacity-60" style={{ color: theme.primary }}>
              No languages found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;