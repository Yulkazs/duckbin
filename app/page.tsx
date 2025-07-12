'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { currentTheme } = useTheme();
  
  const getLogoPath = (themeName: string) => {
    const themeLogoMap: Record<string, string> = {
      'lightShades': 'lightshade',
      'darkShades': 'darkshade',
      'dark': 'dark',
      'light': 'light',
      'midnight': 'midnight',
      'wine': 'wine',
      'greenish': 'greenish',
      'pinky': 'pinky',
      'cabernet': 'cabernet',
      'coffee': 'coffee',
    };
    
    const logoName = themeLogoMap[themeName] || themeName;
    return `/logos/duckbin-${logoName}.svg`;
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-opacity-10" 
              style={{ borderColor: 'var(--color-border)' }}>
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img 
            src={getLogoPath(currentTheme)} 
            alt="Duckbin Logo" 
            className="w-8 h-8 transition-transform" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/logos/duckbin.svg';
            }}
          />
          <h1 className="text-2xl font-bold tracking-wide" 
              style={{ 
                color: 'var(--color-text)',
                fontFamily: 'Krona One, monospace'
              }}>
            duckbin
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-opacity-5 transition-colors cursor-pointer"
               style={{ backgroundColor: 'var(--color-surface)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              TypeScript
            </span>
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Theme Selector */}
          <ThemeSwitcher />

          {/* GitHub Icon */}
          <a href="#" className="p-2 rounded-full hover:bg-opacity-10 transition-all duration-200 hover:scale-105"
             style={{ backgroundColor: 'var(--color-surface)' }}>
            <img 
              src="/github 1.svg" 
              alt="GitHub" 
              className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity" 
            />
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Code Editor Container */}
        <div 
          className="rounded-xl border shadow-lg overflow-hidden backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Editor Header */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <input
              type="text"
              placeholder="Untitled"
              className="bg-transparent text-base font-medium border-none outline-none flex-1 placeholder-opacity-50"
              style={{ 
                color: 'var(--color-text)',
                fontFamily: 'Krona One, monospace'
              }}
            />
            
            <div className="flex items-center gap-3">
              {/* New Button */}
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                style={{ 
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent)',
                }}
              >
                <span>New</span>
                <span className="text-lg font-bold">+</span>
              </button>

              {/* Save Button */}
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                style={{ 
                  backgroundColor: 'var(--color-success)',
                  color: 'white'
                }}
              >
                <span>Save</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>

              {/* GitHub Import Button */}
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-opacity-20"
                style={{ 
                  color: 'var(--color-text-muted)',
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)'
                }}
              >
                <span>GitHub</span>
                <span className="text-lg font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="relative">
            {/* Line Numbers */}
            <div 
              className="absolute left-0 top-0 w-14 h-full border-r flex flex-col items-center py-6 select-none"
              style={{ 
                backgroundColor: 'var(--color-line-number-bg)', 
                borderColor: 'var(--color-border)' 
              }}
            >
              <span 
                className="text-sm font-mono leading-6"
                style={{ color: 'var(--color-line-number)' }}
              >
                1
              </span>
            </div>

            {/* Code Input Area */}
            <div className="pl-16 pr-6 py-6 min-h-[500px]">
              <textarea
                className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-6 placeholder-opacity-50"
                placeholder="// Start typing your code here..."
                spellCheck={false}
                style={{ 
                  color: 'var(--color-text)',
                  minHeight: '500px'
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}