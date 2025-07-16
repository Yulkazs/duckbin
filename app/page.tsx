"use client";

import { useState } from 'react';
import { useThemeContext } from "@/components/ThemeProvider";
import { Header } from '@/components/Header';
import { getDefaultLanguage, type Language } from '@/lib/languages';

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      </main>
    </div>
  );
}