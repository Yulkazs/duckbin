// components/CodeEditor.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language, getLanguageById } from '@/lib/languages';
import { useSyntaxHighlighter } from '@/hooks/useSyntaxHighlighter';

interface CodeEditorProps {
  initialCode?: string;
  language: Language;
  onChange?: (code: string) => void;
  onLanguageChange?: (language: Language) => void;
  placeholder?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeEditor({
  initialCode = '',
  language,
  onChange,
  onLanguageChange,
  placeholder = 'Start typing your code...',
  readOnly = false,
  showLineNumbers = true,
  className = ''
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const {
    highlightedCode,
    isHighlighting,
    error,
    themeClasses,
    isLanguageSupported
  } = useSyntaxHighlighter(code, language, {
    debounceMs: 150,
    enableLineHighlighting: true
  });

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleCodeChange(e.target.value);
  };

  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      handleCodeChange(newCode);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="text-gray-500 text-right pr-2 select-none">
        {index + 1}
      </div>
    ));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className={`relative border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">
            {language.name}
          </span>
          {!isLanguageSupported && (
            <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
              No syntax highlighting
            </span>
          )}
          {isHighlighting && (
            <span className="text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded">
              Highlighting...
            </span>
          )}
        </div>
        
        {error && (
          <span className="text-xs text-red-400" title={error}>
            Highlighting error
          </span>
        )}
      </div>

      {/* Editor */}
      <div className={`relative ${themeClasses}`}>
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className="flex-shrink-0 py-4 px-2 bg-gray-800 border-r border-gray-700">
              <div className="text-sm leading-relaxed">
                {getLineNumbers()}
              </div>
            </div>
          )}

          {/* Code Area */}
          <div className="flex-1 relative">
            {/* Syntax Highlighted Background */}
            <pre
              ref={preRef}
              className="absolute inset-0 p-4 overflow-auto pointer-events-none whitespace-pre-wrap break-words text-sm leading-relaxed"
              style={{ 
                margin: 0,
                border: 'none',
                background: 'transparent',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                fontFamily: 'inherit'
              }}
            >
              <code 
                dangerouslySetInnerHTML={{ 
                  __html: highlightedCode || code.replace(/</g, '&lt;').replace(/>/g, '&gt;') 
                }}
              />
            </pre>

            {/* Transparent Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onScroll={syncScroll}
              placeholder={placeholder}
              readOnly={readOnly}
              spellCheck={false}
              className="relative w-full h-64 p-4 resize-none outline-none bg-transparent text-transparent caret-white selection:bg-blue-500/30 text-sm leading-relaxed whitespace-pre-wrap break-words"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                tabSize: 2
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {code.length} characters | {code.split('\n').length} lines
          </span>
          <span>
            {language.extension} • {language.mimeType}
          </span>
        </div>
      </div>
    </div>
  );
}

// Language Selector Component
interface LanguageSelectorProps {
  currentLanguage: Language;
  languages: Language[];
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({
  currentLanguage,
  languages,
  onLanguageChange
}: LanguageSelectorProps) {
  return (
    <select
      value={currentLanguage.id}
      onChange={(e) => {
        const selectedLanguage = getLanguageById(e.target.value);
        if (selectedLanguage) {
          onLanguageChange(selectedLanguage);
        }
      }}
      className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {languages.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name} (.{lang.extension})
        </option>
      ))}
    </select>
  );
}