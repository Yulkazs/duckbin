"use client";

import { useState } from 'react';
import { useThemeContext } from "@/components/ui/ThemeProvider";
import { Header } from '@/components/Header';
import { getDefaultLanguage, type Language } from '@/utils/languages';

export default function Page() {
  const { theme } = useThemeContext();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getDefaultLanguage());

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.primary }}>
      <Header 
        onLanguageChange={handleLanguageChange}
        selectedLanguage={selectedLanguage.id}
      />
    </div>
  );
}