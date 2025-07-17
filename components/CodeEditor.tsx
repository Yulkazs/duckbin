// components/CodeEditor.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language, getLanguageById } from '@/lib/languages';
import { useSyntaxHighlighter } from '@/hooks/useSyntaxHighlighter';
import { useThemeContext } from '@/components/ThemeProvider';
import { Plus, Github, Save } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language: Language;
  title?: string;
  createdAt?: string;
  onChange?: (code: string) => void;
  onLanguageChange?: (language: Language) => void;
  onSave?: () => void;
  onNew?: () => void;
  onGithub?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeEditor({
  initialCode = '',
  language,
  title = 'Your title',
  createdAt = '16/07/2025',
  onChange,
  onLanguageChange,
  onSave,
  onNew,
  onGithub,
  placeholder = 'Enter your code',
  readOnly = false,
  showLineNumbers = true,
  className = ''
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [cursorLine, setCursorLine] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, height: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeContext();

  // Fixed: Pass theme object directly instead of destructuring
  const {
    highlightedCode,
    isHighlighting,
    error,
    isLanguageSupported
  } = useSyntaxHighlighter(code, language, theme, {
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
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;
      
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const textBeforeCursor = code.substring(0, start);
    const currentLine = textBeforeCursor.split('\n').length - 1;
    
    setCursorLine(currentLine);
    
    // Calculate highlight position
    const lineHeight = 24; // 1.5rem * 16px
    const top = currentLine * lineHeight;
    
    setHighlightPosition({ top, height: lineHeight });
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
        updateCursorPosition();
      }, 0);
    }
  };

  const handleSelectionChange = () => {
    updateCursorPosition();
  };

  const getLineNumbers = () => {
    const lines = code.split('\n');
    return lines.map((_, index) => (
      <div 
        key={index} 
        className={`text-right pr-2 select-none transition-all duration-200 ${
          index === cursorLine ? 'opacity-100' : 'opacity-60'
        }`}
        style={{ 
          height: '24px',
          lineHeight: '24px',
          color: theme.primary,
          fontSize: '14px'
        }}
      >
        {index + 1}
      </div>
    ));
  };

  // Get fallback highlighted code if syntax highlighter fails
  const getDisplayCode = () => {
    if (error) {
      // Fallback to escaped plain text if highlighting fails
      return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return highlightedCode || code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      updateCursorPosition();
    }
  }, []);

  useEffect(() => {
    updateCursorPosition();
  }, [code]);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{ 
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.primary,
        backgroundColor: theme.background
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-2"
        style={{ 
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: theme.primary
        }}
      >
        <div className="flex items-center space-x-2">
          <span 
            className="text-sm font-medium"
            style={{ color: theme.primary }}
          >
            {title}
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
          {error && (
            <span className="text-xs bg-red-600 text-red-100 px-2 py-1 rounded" title={error}>
              Highlighting error
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onNew}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors hover:bg-opacity-10"
            style={{ 
              color: theme.primary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus size={14} />
            New
          </button>
          
          <button
            onClick={onGithub}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors hover:bg-opacity-10"
            style={{ 
              color: theme.primary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Github size={14} />
            GitHub
          </button>
          
          <button
            onClick={onSave}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors hover:bg-opacity-10"
            style={{ 
              color: theme.primary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.primary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div 
              className="flex-shrink-0 py-4 px-2 relative overflow-hidden"
              style={{ 
                borderRightWidth: '1px',
                borderRightStyle: 'solid',
                borderRightColor: theme.primary
              }}
            >
              {/* Line highlight bar */}
              <div
                className="absolute left-0 right-0 transition-all duration-200 ease-out"
                style={{
                  backgroundColor: theme.primary,
                  opacity: 0.1,
                  top: `${highlightPosition.top + 16}px`,
                  height: `${highlightPosition.height}px`,
                  pointerEvents: 'none'
                }}
              />
              
              <div 
                ref={lineNumbersRef}
                className="relative z-10 overflow-hidden"
                style={{ 
                  fontSize: '14px',
                  lineHeight: '24px',
                  height: '384px' // 16 * 24px
                }}
              >
                {getLineNumbers()}
              </div>
            </div>
          )}

          {/* Code Area */}
          <div className="flex-1 relative">
            {/* Syntax Highlighted Background */}
            <pre
              ref={preRef}
              className="absolute inset-0 p-4 overflow-auto pointer-events-none whitespace-pre-wrap break-words"
              style={{ 
                margin: 0,
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '24px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                color: theme.primary
              }}
            >
              <code 
                dangerouslySetInnerHTML={{ 
                  __html: getDisplayCode()
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
              onMouseUp={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              placeholder={placeholder}
              readOnly={readOnly}
              spellCheck={false}
              className="relative w-full resize-none outline-none bg-transparent text-transparent selection:bg-blue-500/30"
              style={{
                height: '384px', // 16 * 24px
                padding: '16px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '14px',
                lineHeight: '24px',
                tabSize: 2,
                caretColor: theme.primary,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="flex items-center justify-between px-4 py-2"
        style={{ 
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: theme.primary
        }}
      >
        <div className="flex items-center">
          <span 
            className="text-xs"
            style={{ color: theme.primary, opacity: 0.7 }}
          >
            {createdAt}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span 
            className="text-xs"
            style={{ color: theme.primary, opacity: 0.7 }}
          >
            {language.name}
          </span>
          <span 
            className="text-xs"
            style={{ color: theme.primary, opacity: 0.7 }}
          >
            {code.length} characters | {code.split('\n').length} lines
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
  const { theme } = useThemeContext();
  
  return (
    <select
      value={currentLanguage.id}
      onChange={(e) => {
        const selectedLanguage = getLanguageById(e.target.value);
        if (selectedLanguage) {
          onLanguageChange(selectedLanguage);
        }
      }}
      className="rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{
        backgroundColor: theme.background,
        color: theme.primary,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.primary
      }}
    >
      {languages.map((lang) => (
        <option key={lang.id} value={lang.id} style={{ backgroundColor: theme.background, color: theme.primary }}>
          {lang.name} (.{lang.extension})
        </option>
      ))}
    </select>
  );
}