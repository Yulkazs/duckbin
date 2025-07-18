"use client";

import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { getSyntaxColors, createMonacoTheme } from '@/utils/syntax-colors';

// Monaco Editor types
interface MonacoEditor {
  editor: {
    create: (container: HTMLElement, options: any) => any;
    defineTheme: (name: string, theme: any) => void;
    setTheme: (name: string) => void;
    setModelLanguage: (model: any, language: string) => void;
  };
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  className = '',
  placeholder = ''
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const { theme, currentTheme } = useThemeContext();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monaco, setMonaco] = useState<MonacoEditor | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Show/hide placeholder based on content
  const updatePlaceholderVisibility = () => {
    if (!placeholderRef.current) return;
    
    const shouldShowPlaceholder = !value && placeholder;
    placeholderRef.current.style.display = shouldShowPlaceholder ? 'block' : 'none';
  };

  // Load Monaco Editor dynamically
  useEffect(() => {
    const loadMonaco = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Set up Monaco environment before loading
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

        // Load Monaco from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.js';
        script.onload = () => {
          const loader = (window as any).require;
          loader.config({ 
            paths: { 
              vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
            } 
          });
          
          loader(['vs/editor/editor.main'], (monacoInstance: MonacoEditor) => {
            setMonaco(monacoInstance);
            setMonacoLoaded(true);
          });
        };
        script.onerror = () => {
          setLoadError('Failed to load Monaco Editor');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
        setLoadError('Failed to load Monaco Editor');
      }
    };

    loadMonaco();
  }, []);

  // Initialize Monaco Editor
  useEffect(() => {
    if (!monacoLoaded || !containerRef.current || !monaco) return;

    const initEditor = async () => {
      try {
        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Get syntax colors for current theme
        const syntaxColors = getSyntaxColors(currentTheme);
        const themeConfig = createMonacoTheme(currentTheme, syntaxColors);
        const themeName = `duckbin-${currentTheme}`;
        
        // Define the theme
        monaco.editor.defineTheme(themeName, themeConfig);

        // Create editor
        editorRef.current = monaco.editor.create(containerRef.current!, {
          value: value,
          language: language,
          theme: themeName,
          readOnly: readOnly,
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
          if (editorRef.current) {
            const newValue = editorRef.current.getValue() || '';
            onChange(newValue);
          }
        });

        // Listen for focus to hide placeholder
        editorRef.current.onDidFocusEditorText(() => {
          updatePlaceholderVisibility();
        });

        setIsEditorReady(true);
      } catch (error) {
        console.error('Failed to initialize Monaco Editor:', error);
        setLoadError('Failed to initialize Monaco Editor');
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [monacoLoaded, monaco]);

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
  }, [currentTheme, isEditorReady, monaco]);

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
  }, [language, isEditorReady, monaco]);

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

  // Update placeholder visibility when value changes
  useEffect(() => {
    updatePlaceholderVisibility();
  }, [value, placeholder]);

  // Show error state
  if (loadError) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div 
          className="border-b rounded-lg overflow-hidden flex items-center justify-center"
          style={{ 
            height,
            borderColor: theme.primary + '40',
            backgroundColor: theme.background,
            color: theme.primary
          }}
        >
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-red-500">{loadError}</p>
            <p className="text-xs opacity-60 mt-1">Please check your internet connection</p>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-sm opacity-60">Loading Monaco Editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div 
        className="border rounded-lg overflow-hidden relative"
        style={{ 
          height,
          borderColor: theme.primary + '40',
          backgroundColor: theme.background
        }}
      >
        <div 
          ref={containerRef}
          className="w-full h-full"
        />
        
        {/* Placeholder overlay */}
        {placeholder && (
          <div
            ref={placeholderRef}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              padding: '20px 0 0 60px', // Adjust to align with editor content (accounting for line numbers)
              fontSize: '14px',
              fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              color: theme.primary,
              opacity: 0.5,
              display: !value && placeholder ? 'block' : 'none'
            }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;