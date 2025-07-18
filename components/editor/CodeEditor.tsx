"use client";

import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { getSyntaxColors, createMonacoTheme } from '@/utils/syntax-colors';
import { snippetService } from '@/lib/snippets';
import { Save, Loader2, Check, X } from 'lucide-react';

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
  title?: string;
  onTitleChange?: (title: string) => void;
  createdAt?: string;
  // Add save-related props
  onSave?: (savedSnippet: any) => void;
  showSaveButton?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  className = '',
  placeholder = '',
  title = '',
  onTitleChange,
  createdAt = new Date().toLocaleDateString('en-GB'),
  onSave,
  showSaveButton = true
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const { theme, currentTheme } = useThemeContext();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monaco, setMonaco] = useState<MonacoEditor | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [localTitle, setLocalTitle] = useState(title);
  
  // Save functionality states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Calculate stats
  const characterCount = value.length;
  const lineCount = value.split('\n').length;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);

  const handleTitleChange = (newTitle: string) => {
    // Limit title to 100 characters
    if (newTitle.length <= 100) {
      setLocalTitle(newTitle);
      if (onTitleChange) {
        onTitleChange(newTitle);
      }
    }
  };

  // Save snippet function
  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveStatus('idle');

      // Validate data
      const snippetData = {
        title: localTitle.trim() || 'Untitled Snippet',
        code: value,
        language: language,
        theme: currentTheme
      };

      const validation = snippetService.validateSnippetData(snippetData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Save to database
      const response = await snippetService.createSnippet(snippetData);
      
      setSaveStatus('success');
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(response);
      }

      // Reset success status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error saving snippet:', error);
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save snippet');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveError(null);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

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
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const syntaxColors = getSyntaxColors(currentTheme);
        const themeConfig = createMonacoTheme(currentTheme, syntaxColors);
        const themeName = `duckbin-${currentTheme}`;
        
        monaco.editor.defineTheme(themeName, themeConfig);

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

  useEffect(() => {
    updatePlaceholderVisibility();
  }, [value, placeholder]);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  // Render save button
  const renderSaveButton = () => {
    if (!showSaveButton) return null;

    return (
      <button
        onClick={handleSave}
        disabled={isSaving || !value.trim()}
        className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : theme.primary,
          color: theme.background,
        }}
      >
        {isSaving ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : saveStatus === 'success' ? (
          <>
            <Check size={14} />
            <span>Saved!</span>
          </>
        ) : saveStatus === 'error' ? (
          <>
            <X size={14} />
            <span>Error</span>
          </>
        ) : (
          <>
            <Save size={14} />
            <span>Save</span>
          </>
        )}
      </button>
    );
  };

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
    <div className={`${className}`}>
      <div 
        className="border rounded-lg overflow-hidden relative flex flex-col"
        style={{ 
          height,
          borderColor: theme.primary + '40',
          backgroundColor: theme.background
        }}
      >
        {/* Title bar - integrated at the top */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
          style={{ 
            borderColor: theme.primary + '20',
            backgroundColor: theme.background,
            height: '36px'
          }}
        >
          <input
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Your title"
            maxLength={100}
            className="text-sm px-2 py-1 rounded border-0 outline-none bg-transparent flex-1"
            style={{ 
              color: theme.primary,
              backgroundColor: 'transparent',
              fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
            }}
          />
          
          {/* Save button */}
          {renderSaveButton()}
        </div>

        {/* Editor container */}
        <div 
          ref={containerRef}
          className="w-full flex-1"
          style={{ minHeight: 0 }}
        />
        
        {/* Placeholder overlay */}
        {placeholder && (
          <div
            ref={placeholderRef}
            className="absolute pointer-events-none"
            style={{
              top: '56px',
              left: '60px',
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

        {/* Bottom status bar - integrated at the bottom */}
        <div 
          className="flex justify-between items-center px-4 py-1 border-t text-xs flex-shrink-0"
          style={{ 
            borderColor: theme.primary + '20',
            backgroundColor: theme.background,
            color: theme.primary,
            opacity: 0.8,
            height: '28px'
          }}
        >
          <div className="flex items-center gap-2">
            <span>{createdAt}</span>
            {saveError && (
              <span className="text-red-500" title={saveError}>
                ⚠️ {saveError}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>{displayLanguage}</span>
            <span>{characterCount} characters</span>
            <span>{lineCount} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;