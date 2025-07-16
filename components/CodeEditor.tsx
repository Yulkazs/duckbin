"use client";

import { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/components/ThemeProvider';
import { Language } from '@/lib/languages';

interface CodeEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  language: Language;
  createdAt: Date;
  className?: string;
}

// Language syntax highlighting patterns
const getSyntaxHighlighting = (code: string, language: Language): string => {
  if (language.id === 'javascript' || language.id === 'typescript') {
    return code
      .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|default|async|await|try|catch|finally|throw|new|this|typeof|instanceof)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #b5cea8;">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span style="color: #6a9955;">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: #ce9178;">$1$2$3</span>');
  } else if (language.id === 'python') {
    return code
      .replace(/\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|pass|break|continue|and|or|not|in|is|lambda|global|nonlocal)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(True|False|None)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color: #b5cea8;">$1</span>')
      .replace(/(#.*$)/gm, '<span style="color: #6a9955;">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: #ce9178;">$1$2$3</span>');
  } else if (language.id === 'html') {
    return code
      .replace(/(&lt;\/?\w+)([^&gt;]*&gt;)/g, '<span style="color: #569cd6;">$1</span><span style="color: #92c5f8;">$2</span>')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: #6a9955;">$1</span>');
  } else if (language.id === 'css') {
    return code
      .replace(/([.#]?[\w-]+)(\s*{)/g, '<span style="color: #d7ba7d;">$1</span>$2')
      .replace(/([\w-]+)(\s*:)/g, '<span style="color: #92c5f8;">$1</span>$2')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a9955;">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: #ce9178;">$1$2$3</span>');
  } else if (language.id === 'json') {
    return code
      .replace(/("[\w\s]*")(\s*:)/g, '<span style="color: #9cdcfe;">$1</span>$2')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span style="color: #ce9178;">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color: #b5cea8;">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span style="color: #569cd6;">$1</span>');
  }
  return code;
};

// Escape HTML entities
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Count words in code
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  onTitleChange,
  code,
  onCodeChange,
  language,
  createdAt,
  className = ""
}) => {
  const { theme } = useThemeContext();
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [highlightedLine, setHighlightedLine] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = lines.length;
  const wordCount = countWords(code);

  // Update cursor position and highlighted line
  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorIndex = textarea.selectionStart;
    const textBeforeCursor = code.substring(0, cursorIndex);
    const linesBeforeCursor = textBeforeCursor.split('\n');
    const currentLine = linesBeforeCursor.length;
    const currentCol = linesBeforeCursor[linesBeforeCursor.length - 1].length + 1;

    setCursorPosition({ line: currentLine, col: currentCol });
    setHighlightedLine(currentLine);
  };

  // Handle text change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onCodeChange(newCode);
    updateCursorPosition();
  };

  // Handle cursor movement
  const handleCursorMove = () => {
    updateCursorPosition();
  };

  // Sync scroll between textarea and highlight layer
  const handleScroll = () => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (textarea && highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  };

  // Initialize cursor position
  useEffect(() => {
    updateCursorPosition();
  }, [code]);

  // Generate highlighted code
  const highlightedCode = getSyntaxHighlighting(escapeHtml(code), language);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Title Input */}
      <div className="p-4 border-b" style={{ borderColor: theme.primary }}>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Your title"
          className="w-full text-2xl font-bold bg-transparent outline-none"
          style={{ 
            color: theme.primary,
            fontFamily: 'Krona One, monospace'
          }}
        />
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex">
        {/* Line Numbers */}
        <div 
          className="flex flex-col py-4 px-2 border-r text-right select-none"
          style={{ 
            backgroundColor: theme.background,
            borderColor: theme.primary,
            color: theme.primary,
            opacity: 0.6
          }}
        >
          {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
            <div
              key={i + 1}
              className={`leading-6 text-sm font-mono ${
                highlightedLine === i + 1 ? 'font-bold' : ''
              }`}
              style={{
                color: highlightedLine === i + 1 ? theme.primary : undefined,
                opacity: highlightedLine === i + 1 ? 1 : 0.6
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative">
          {/* Highlight Layer */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-4 font-mono text-sm leading-6 overflow-hidden pointer-events-none whitespace-pre-wrap break-words"
            style={{ 
              color: theme.primary,
              backgroundColor: theme.background
            }}
            dangerouslySetInnerHTML={{ __html: highlightedCode || '&nbsp;' }}
          />

          {/* Line Highlight */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${(highlightedLine - 1) * 24 + 16}px`,
              height: '24px',
              backgroundColor: '#454545',
              opacity: 0.5
            }}
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyUp={handleCursorMove}
            onMouseUp={handleCursorMove}
            onScroll={handleScroll}
            placeholder="Enter your code"
            className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-6 bg-transparent outline-none resize-none overflow-auto"
            style={{ 
              color: 'transparent',
              caretColor: theme.primary,
              backgroundColor: 'transparent'
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Footer */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-t text-sm"
        style={{ 
          borderColor: theme.primary,
          color: theme.primary,
          opacity: 0.8
        }}
      >
        <div className="flex items-center gap-4">
          <span>{formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{language.name}</span>
          <span>{wordCount}/10000</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;