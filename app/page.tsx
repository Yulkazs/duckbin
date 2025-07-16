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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome to Duckbin</h1>
          <p className="text-lg opacity-80">
            Share your code snippets with ease. Choose your language and theme to get started.
          </p>
        </div>

        {/* Current Selection Info */}
        <div className="mb-8 p-6 rounded-lg" style={{ border: `1px solid ${theme.primary}` }}>
          <h2 className="text-xl font-semibold mb-4">Current Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Language</h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: selectedLanguage.category === 'programming' ? '#10b981' :
                                   selectedLanguage.category === 'markup' ? '#f59e0b' :
                                   selectedLanguage.category === 'scripting' ? '#8b5cf6' :
                                   selectedLanguage.category === 'config' ? '#6b7280' : '#3b82f6'
                  }}
                />
                <span className="font-code">{selectedLanguage.name}</span>
                <span className="text-sm opacity-60">(.{selectedLanguage.extension})</span>
              </div>
              <p className="text-sm opacity-60 mt-1">
                Category: {selectedLanguage.category}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Theme</h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="font-code">{theme.name}</span>
              </div>
              <p className="text-sm opacity-60 mt-1">
                Background: <span className="font-code">{theme.background}</span> | 
                Primary: <span className="font-code">{theme.primary}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Code Editor Placeholder */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Code Editor</h2>
          <div 
            className="p-6 rounded-lg min-h-[400px] font-code"
            style={{ 
              border: `1px solid ${theme.primary}`,
              backgroundColor: `${theme.primary}05`
            }}
          >
            <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: `1px solid ${theme.primary}` }}>
              <span className="text-sm opacity-80">
                {selectedLanguage.name} Editor
              </span>
              <span className="text-xs opacity-60">
                {selectedLanguage.mimeType}
              </span>
            </div>
            <div className="text-sm opacity-60 italic">
              Code editor will be implemented here...
              <br />
              Selected language: {selectedLanguage.name}
              <br />
              File extension: .{selectedLanguage.extension}
            </div>
          </div>
        </div>

        {/* Sample Code Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg" style={{ border: `1px solid ${theme.primary}` }}>
            <h3 className="text-lg font-semibold mb-4">Sample Code</h3>
            <pre className="font-code text-sm overflow-x-auto">
              <code style={{ color: theme.primary }}>
                {selectedLanguage.id === 'javascript' ? 
                  `// JavaScript Example\nconst greeting = "Hello, World!";\nconsole.log(greeting);` :
                selectedLanguage.id === 'python' ?
                  `# Python Example\ngreeting = "Hello, World!"\nprint(greeting)` :
                selectedLanguage.id === 'html' ?
                  `<!-- HTML Example -->\n<div class="container">\n  <h1>Hello, World!</h1>\n</div>` :
                selectedLanguage.id === 'css' ?
                  `/* CSS Example */\n.container {\n  display: flex;\n  justify-content: center;\n}` :
                `// ${selectedLanguage.name} Example\n// Code sample will be here\nconsole.log("Hello, World!");`
                }
              </code>
            </pre>
          </div>

          <div className="p-6 rounded-lg" style={{ border: `1px solid ${theme.primary}` }}>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                Language-specific syntax highlighting
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                Multiple theme options
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                Easy sharing and collaboration
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                Support for 38+ programming languages
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                Real-time language search
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}