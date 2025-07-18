"use client";

import { useState } from 'react';
import { useThemeContext } from "@/components/ui/ThemeProvider";
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { getDefaultLanguage, type Language } from '@/utils/languages';


export default function Page() {
  const { theme } = useThemeContext();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language.id);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.primary }}>
      <Header 
        onLanguageChange={handleLanguageChange}
        selectedLanguage={selectedLanguage}
      />
      
      <div className="max-w-7xl mx-auto">
        <CodeEditor
          value={code}
          onChange={handleCodeChange}
          language={selectedLanguage}
          height="600px"
          className="w-full"
          placeholder="// Welcome to Duckbin"
        />
      </div>
    </div>
  );
}