'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Home() {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src="/duckbin.svg" alt="Duckbin Logo" className="w-8 h-8" />
          <h1 className="text-xl font-title" style={{ color: 'var(--color-text)' }}>
            duckbin
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-body" style={{ color: 'var(--color-text)' }}>
              TypeScript
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Theme Selector */}
          <ThemeSwitcher />

          {/* GitHub Icon */}
          <img 
            src="/github 1.svg" 
            alt="GitHub" 
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-6">
        {/* Code Editor Container */}
        <div 
          className="rounded-lg border overflow-hidden"
          style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)' 
          }}
        >
          {/* Editor Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <input
              type="text"
              placeholder="Title"
              className="bg-transparent text-sm border-none outline-none font-body"
              style={{ 
                color: 'var(--color-text)',
              }}
            />
            
            <div className="flex items-center gap-4">
              {/* New Button */}
              <button 
                className="flex items-center gap-2 text-sm font-body hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-accent)' }}
              >
                <span>New</span>
                <span className="text-lg">+</span>
              </button>

              {/* Save Button */}
              <button 
                className="flex items-center gap-2 text-sm font-body hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-success)' }}
              >
                <span>Save</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>

              {/* GitHub Import Button */}
              <button 
                className="flex items-center gap-2 text-sm font-body hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span>GitHub</span>
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="relative">
            {/* Line Number */}
            <div 
              className="absolute left-0 top-0 w-12 h-full border-r flex flex-col items-center py-4"
              style={{ 
                backgroundColor: 'var(--color-line-number-bg)', 
                borderColor: 'var(--color-border)' 
              }}
            >
              <span 
                className="text-sm font-mono"
                style={{ color: 'var(--color-line-number)' }}
              >
                1
              </span>
            </div>

            {/* Code Input Area */}
            <div className="pl-14 pr-4 py-4 min-h-[600px]">
              <textarea
                className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm"
                placeholder="Start typing your code here..."
                spellCheck={false}
                style={{ 
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}