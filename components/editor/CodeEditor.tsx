// components/editor/CodeEditor.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { getSyntaxColors, createMonacoTheme } from '@/utils/syntax-colors';

// Dynamic Monaco import to avoid SSR issues
let monaco: any = null;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  className = ''
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, currentTheme } = useThemeContext();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);

  // Load Monaco Editor dynamically
  useEffect(() => {
    const loadMonaco = async () => {
      if (typeof window !== 'undefined' && !monaco) {
        try {
          // Dynamic import for Monaco
          const monacoEditor = await import('monaco-editor');
          monaco = monacoEditor.default || monacoEditor;
          
          // Configure Monaco environment
          if (typeof window !== 'undefined') {
            (window as any).MonacoEnvironment = {
              getWorkerUrl: () => {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                  self.MonacoEnvironment = {
                    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/'
                  };
                  importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/base/worker/workerMain.js');
                `)}`;
              }
            };
          }
          
          setMonacoLoaded(true);
        } catch (error) {
          console.error('Failed to load Monaco Editor:', error);
        }
      } else if (monaco) {
        setMonacoLoaded(true);
      }
    };

    loadMonaco();
  }, []);

  // Initialize Monaco Editor
  useEffect(() => {
    if (!monacoLoaded || !containerRef.current || !monaco) return;

    const initEditor = async () => {
      try {
        // Get syntax colors for current theme
        const syntaxColors = getSyntaxColors(currentTheme);
        const themeConfig = createMonacoTheme(currentTheme, syntaxColors);
        const themeName = `duckbin-${currentTheme}`;
        
        // Define the theme
        monaco.editor.defineTheme(themeName, themeConfig);

        // Create editor
        editorRef.current = monaco.editor.create(containerRef.current, {
          value,
          language,
          theme: themeName,
          readOnly,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          minimap: { enabled: false },
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          contextmenu: true,
          mouseWheelZoom: true,
          cursorBlinking: 'blink',
          smoothScrolling: true,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            bracketPairsHorizontal: true,
            highlightActiveBracketPair: true,
            indentation: true,
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          quickSuggestions: true,
          parameterHints: {
            enabled: true,
          },
          hover: {
            enabled: true,
          },
        });

        // Listen for changes
        editorRef.current.onDidChangeModelContent(() => {
          const newValue = editorRef.current?.getValue() || '';
          onChange(newValue);
        });

        setIsEditorReady(true);
      } catch (error) {
        console.error('Failed to initialize Monaco Editor:', error);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [monacoLoaded, value, language]);

  // Update theme when it changes
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !monaco) return;

    try {
      const syntaxColors = getSyntaxColors(currentTheme);
      const themeConfig = createMonacoTheme(currentTheme, syntaxColors);
      const themeName = `duckbin-${currentTheme}`;
      
      monaco.editor.defineTheme(themeName, themeConfig);
      monaco.editor.setTheme(themeName);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, [currentTheme, isEditorReady]);

  // Update language when it changes
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !monaco) return;

    try {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  }, [language, isEditorReady]);

  // Update value when it changes externally
  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;

    try {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) {
        editorRef.current.setValue(value);
      }
    } catch (error) {
      console.error('Failed to update value:', error);
    }
  }, [value, isEditorReady]);

  // Show loading state
  if (!monacoLoaded) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div 
          className="border rounded-lg overflow-hidden flex items-center justify-center"
          style={{ 
            height,
            borderColor: theme.primary + '40',
            backgroundColor: theme.background,
            color: theme.primary
          }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" 
                 style={{ borderColor: theme.primary }}></div>
            <p className="text-sm opacity-60">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div 
        ref={containerRef}
        className="border rounded-lg overflow-hidden"
        style={{ 
          height,
          borderColor: theme.primary + '40',
          backgroundColor: theme.background
        }}
      />
    </div>
  );
};

export default CodeEditor;