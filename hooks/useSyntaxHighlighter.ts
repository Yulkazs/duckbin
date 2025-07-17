// hooks/useSyntaxHighlighter.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Language } from '@/lib/languages';
import { SyntaxHighlighter } from '@/lib/syntax-highlighter';

interface UseSyntaxHighlighterOptions {
  debounceMs?: number;
  enableLineHighlighting?: boolean;
}

interface UseSyntaxHighlighterReturn {
  highlightedCode: string;
  isHighlighting: boolean;
  error: string | null;
  themeClasses: string;
  isLanguageSupported: boolean;
}

export function useSyntaxHighlighter(
  code: string,
  language: Language,
  options: UseSyntaxHighlighterOptions = {}
): UseSyntaxHighlighterReturn {
  const { debounceMs = 150, enableLineHighlighting = false } = options;
  
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeClasses = useMemo(() => SyntaxHighlighter.getThemeClasses(), []);
  const isLanguageSupported = useMemo(() => SyntaxHighlighter.isLanguageSupported(language), [language]);

  const highlightCode = useCallback(async (codeToHighlight: string, lang: Language) => {
    if (!codeToHighlight.trim()) {
      setHighlightedCode('');
      return;
    }

    setIsHighlighting(true);
    setError(null);

    try {
      let result: string;
      
      if (enableLineHighlighting) {
        const lines = codeToHighlight.split('\n');
        const highlightedLines = await SyntaxHighlighter.highlightLines(lines, lang);
        result = highlightedLines.join('\n');
      } else {
        result = await SyntaxHighlighter.highlightCode(codeToHighlight, lang);
      }
      
      setHighlightedCode(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Syntax highlighting failed';
      setError(errorMessage);
      console.error('Syntax highlighting error:', err);
      
      // Fallback to plain text
      setHighlightedCode(codeToHighlight);
    } finally {
      setIsHighlighting(false);
    }
  }, [enableLineHighlighting]);

  // Debounced highlighting effect
  useEffect(() => {
    const timer = setTimeout(() => {
      highlightCode(code, language);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [code, language, debounceMs, highlightCode]);

  return {
    highlightedCode,
    isHighlighting,
    error,
    themeClasses,
    isLanguageSupported
  };
}

// Additional hook for static highlighting (useful for read-only code blocks)
export function useStaticSyntaxHighlighter(
  code: string,
  language: Language
): { highlightedCode: string; isLoading: boolean } {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const highlight = async () => {
      try {
        const result = await SyntaxHighlighter.highlightCode(code, language);
        if (isMounted) {
          setHighlightedCode(result);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setHighlightedCode(code);
          setIsLoading(false);
        }
      }
    };

    highlight();

    return () => {
      isMounted = false;
    };
  }, [code, language]);

  return { highlightedCode, isLoading };
}