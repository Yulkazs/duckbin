// app/page.tsx or app/[slug]/page.tsx
"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { useDuckbin } from '@/hooks/useDuckbin';
import { Language } from '@/lib/languages';

export default function EditorPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const {
    data,
    isLoading,
    error,
    updateTitle,
    updateCode,
    updateLanguage,
    updateTheme,
    save,
    load
  } = useDuckbin(slug);

  const handleLanguageChange = (language: Language) => {
    updateLanguage(language);
  };

  const handleThemeChange = (theme: string) => {
    updateTheme(theme);
  };

  const handleSave = async () => {
    const savedSlug = await save();
    if (savedSlug) {
      // Optional: redirect to the saved slug URL
      window.history.pushState({}, '', `/${savedSlug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: data.theme ? themes[data.theme]?.background : '#020202' }}
      >
        <Header
          selectedLanguage={data.language.id}
          onLanguageChange={handleLanguageChange}
        />
        
        <div className="flex-1 flex flex-col">
          <CodeEditor
            title={data.title}
            onTitleChange={updateTitle}
            code={data.code}
            onCodeChange={updateCode}
            language={data.language}
            createdAt={data.createdAt}
            className="flex-1"
          />
        </div>
        
        {/* Optional: Save button for testing */}
        <div className="p-4 border-t" style={{ borderColor: themes[data.theme]?.primary }}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 rounded border"
            style={{ 
              borderColor: themes[data.theme]?.primary,
              color: themes[data.theme]?.primary
            }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}

// For the hook to work properly, you'll also need to import themes in the component
import { themes } from '@/lib/colors';