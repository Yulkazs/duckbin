"use client";

import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { getSyntaxColors, createMonacoTheme } from '@/utils/syntax-colors';
import { snippetService } from '@/lib/snippets';
import { getLanguageById, languages } from '@/utils/languages';
import { Save, Loader2, Check, X, Download, Copy, AlertCircle } from 'lucide-react';
import { ImportGithub } from '@/components/selectors/ImportGithub';
import { SimpleToast } from '@/components/ui/Toast';
import { Loading } from '@/components/ui/Loading'; // Add this import

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
  onSave?: (savedSnippet: any) => void;
  showSaveButton?: boolean;
  onLanguageChange?: (language: string) => void;
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
  showSaveButton = true,
  onLanguageChange
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
  const [isMobile, setIsMobile] = useState(false);
  
  // Save functionality states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Import functionality states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false
  });

  // Calculate stats
  const characterCount = value.length;
  const lineCount = value.split('\n').length;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleTitleChange = (newTitle: string) => {
    if (newTitle.length <= 100) {
      const capitalizedTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
      setLocalTitle(capitalizedTitle);
      if (onTitleChange) {
        onTitleChange(capitalizedTitle);
      }
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({
      message,
      type,
      visible: true
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  // Detect language from file extension
  const detectLanguageFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const detectedLanguage = languages.find(lang => 
      lang.extension === extension || 
      (lang.id === 'typescript' && (extension === 'tsx' || extension === 'ts')) ||
      (lang.id === 'javascript' && (extension === 'jsx' || extension === 'js' || extension === 'mjs')) ||
      (lang.id === 'python' && (extension === 'py' || extension === 'pyw')) ||
      (lang.id === 'markdown' && (extension === 'md' || extension === 'markdown')) ||
      (lang.id === 'yaml' && (extension === 'yaml' || extension === 'yml')) ||
      (lang.id === 'dockerfile' && (extension === 'dockerfile' || filename.toLowerCase() === 'dockerfile'))
    );

    return detectedLanguage?.id || 'plaintext';
  };

  // Handle import from GitHub component
  const handleGitHubImport = (content: string, filename: string, detectedLanguage: string) => {
    try {
      onChange(content);
      
      if (onLanguageChange) {
        onLanguageChange(detectedLanguage);
      }

      if (!localTitle.trim() || localTitle === 'Untitled Snippet') {
        handleTitleChange(filename);
      }

      setImportStatus('success');
      showToast(`File "${filename}" imported successfully!`, 'success');

      setTimeout(() => {
        setImportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error handling GitHub import:', error);
      setImportStatus('error');
      setImportError(error instanceof Error ? error.message : 'Failed to import file');
      showToast('Failed to import file', 'error');
      
      setTimeout(() => {
        setImportStatus('idle');
        setImportError(null);
      }, 3000);
    }
  };

  // Save snippet function
  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveStatus('idle');

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

      const response = await snippetService.createSnippet(snippetData);
      
      setSaveStatus('success');

      if (response.url) {
        const copySuccess = await copyToClipboard(response.url);
        if (copySuccess) {
          showToast(`Snippet saved! URL copied to clipboard: ${response.snippet.slug}`, 'success');
        } else {
          showToast(`Snippet saved! URL: ${response.url}`, 'info');
        }
      } else {
        showToast('Snippet saved successfully!', 'success');
      }
      
      if (onSave) {
        onSave(response);
      }

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error saving snippet:', error);
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save snippet');
      showToast('Failed to save snippet', 'error');
      
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveError(null);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePlaceholderVisibility = () => {
    if (!placeholderRef.current) return;
    
    const shouldShowPlaceholder = !value && placeholder;
    placeholderRef.current.style.display = shouldShowPlaceholder ? 'block' : 'none';
  };

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

        // Responsive Monaco options
        const responsiveOptions = isMobile ? {
          fontSize: 12,
          lineHeight: 18,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 14,
            horizontalScrollbarSize: 14,
          },
          minimap: { enabled: false },
          wordWrap: 'on',
          wrappingIndent: 'indent',
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          mouseWheelZoom: false,
          quickSuggestions: false,
          acceptSuggestionOnEnter: 'smart',
          contextmenu: false,
          links: false,
          colorDecorators: false,
          codeLens: false,
          hover: {
            enabled: false,
          },
          parameterHints: {
            enabled: false,
          },
          suggestOnTriggerCharacters: false,
        } : {
          fontSize: 14,
          minimap: { enabled: false },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
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
          contextmenu: true,
          mouseWheelZoom: true,
        };

        editorRef.current = monaco.editor.create(containerRef.current!, {
          value: value,
          language: language,
          theme: themeName,
          readOnly: readOnly,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          folding: !isMobile,
          foldingStrategy: 'indentation',
          showFoldingControls: isMobile ? 'never' : 'always',
          cursorBlinking: 'blink',
          smoothScrolling: true,
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: !isMobile,
            bracketPairsHorizontal: !isMobile,
            highlightActiveBracketPair: true,
            indentation: !isMobile,
          },
          ...responsiveOptions
        });

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
  }, [monacoLoaded, monaco, isMobile]);

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

  // Render import button
  const renderImportButton = () => {
    if (readOnly) return null;

    return (
      <button
        onClick={() => setShowImportModal(true)}
        className={`flex items-center gap-2 rounded text-sm font-medium transition-all duration-200 ${
          isMobile ? 'px-2 py-1' : 'px-3 py-1 mr-2'
        }`}
        style={{
          backgroundColor: importStatus === 'success' ? '#10b981' : importStatus === 'error' ? '#ef4444' : theme.primary + '20',
          color: importStatus === 'success' || importStatus === 'error' ? theme.background : theme.primary,
          border: `1px solid ${theme.primary}40`,
        }}
        title="Import file from GitHub"
      >
        {importStatus === 'success' ? (
          <>
            <Check size={isMobile ? 12 : 14} />
            {!isMobile && <span>Imported!</span>}
          </>
        ) : importStatus === 'error' ? (
          <>
            <X size={isMobile ? 12 : 14} />
            {!isMobile && <span>Error</span>}
          </>
        ) : (
          <>
            <Download size={isMobile ? 12 : 14} />
            {!isMobile && <span>Import</span>}
          </>
        )}
      </button>
    );
  };

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;

    try {
      editorRef.current.updateOptions({
        readOnly: readOnly
      });
    } catch (error) {
      console.error('Failed to update readOnly option:', error);
    }
  }, [readOnly, isEditorReady]);

  // Render save button
  const renderSaveButton = () => {
    if (!showSaveButton) return null;

    return (
      <button
        onClick={handleSave}
        disabled={isSaving || !value.trim()}
        className={`flex items-center gap-2 rounded text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          isMobile ? 'px-2 py-1 ml-1' : 'px-3 py-1'
        }`}
        style={{
          backgroundColor: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : theme.primary,
          color: theme.background,
        }}
      >
        {isSaving ? (
          <>
            <Loader2 size={isMobile ? 12 : 14} className="animate-spin" />
            {!isMobile && <span>Saving...</span>}
          </>
        ) : saveStatus === 'success' ? (
          <>
            <Check size={isMobile ? 12 : 14} />
            {!isMobile && <span>Saved!</span>}
          </>
        ) : saveStatus === 'error' ? (
          <>
            <X size={isMobile ? 12 : 14} />
            {!isMobile && <span>Error</span>}
          </>
        ) : (
          <>
            <Save size={isMobile ? 12 : 14} />
            {!isMobile && <span>Save</span>}
          </>
        )}
      </button>
    );
  };

  // Toast notification
  const renderToast = () => {
    if (!toast.visible) return null;

    const toastColors = {
      success: { bg: '#10b981', icon: <Check size={16} /> },
      error: { bg: '#ef4444', icon: <X size={16} /> },
      info: { bg: theme.primary, icon: <Copy size={16} /> },
      warning: { bg: '#f59e0b', icon: <AlertCircle size={16} /> }
    };

    const colors = toastColors[toast.type];

    return (
      <div
        className={`fixed z-50 flex items-center gap-2 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
          isMobile 
            ? 'top-2 left-2 right-2 px-3 py-2' 
            : 'top-4 right-4 px-4 py-3'
        } ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        style={{ backgroundColor: colors.bg }}
      >
        {colors.icon}
        <span className={isMobile ? 'text-xs' : ''}>{toast.message}</span>
      </div>
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
          <div className="text-center px-4">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className={`text-red-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>{loadError}</p>
            <p className={`opacity-60 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>Please check your internet connection</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state with your custom Loading component
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
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        <div 
          className="border rounded-lg overflow-hidden relative flex flex-col"
          style={{ 
            height,
            borderColor: theme.primary + '40',
            backgroundColor: theme.background
          }}
        >
          {/* Title bar - responsive */}
          <div 
            className={`flex items-center justify-between border-b flex-shrink-0 ${
              isMobile ? 'px-2 py-2' : 'px-4 py-2'
            }`}
            style={{ 
              borderColor: theme.primary + '20',
              backgroundColor: theme.background,
              height: isMobile ? '44px' : '36px'
            }}
          >

          <input
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            readOnly={readOnly}
            placeholder={readOnly ? "" : "Your title"} 
            maxLength={100}
            className={`outline-none bg-transparent flex-1 border-0 ${
              readOnly ? 'cursor-default' : ''
            } ${
              isMobile ? 'text-xs px-1 py-1' : 'text-sm px-2 py-1'
            }`} 
            style={{ 
              color: theme.primary,
              backgroundColor: 'transparent',
              fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
            }}
          />
            
            <div className={`flex items-center ${isMobile ? 'gap-1' : ''}`}>
              {/* Import button */}
              {renderImportButton()}
              
              {/* Save button */}
              {renderSaveButton()}
            </div>
          </div>

          {/* Editor container */}
          <div 
            ref={containerRef}
            className="w-full flex-1"
            style={{ minHeight: 0 }}
          />
          
          {/* Placeholder overlay - responsive positioning */}
          {placeholder && (
            <div
              ref={placeholderRef}
              className="absolute pointer-events-none"
              style={{
                top: isMobile ? '64px' : '56px',
                left: isMobile ? '20px' : '60px',
                fontSize: isMobile ? '12px' : '14px',
                fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                color: theme.primary,
                opacity: 0.5,
                display: !value && placeholder ? 'block' : 'none'
              }}
            >
              {placeholder}
            </div>
          )}

          {/* Bottom status bar - responsive */}
          <div 
            className={`flex justify-between items-center border-t flex-shrink-0 ${
              isMobile ? 'px-2 py-1 text-xs flex-col gap-1' : 'px-4 py-1 text-xs'
            }`}
            style={{ 
              borderColor: theme.primary + '20',
              backgroundColor: theme.background,
              color: theme.primary,
              opacity: 0.8,
              height: isMobile ? 'auto' : '28px',
              minHeight: isMobile ? '44px' : '28px'
            }}
          >
            <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-between' : ''}`}>
              <span className={isMobile ? 'text-xs' : ''}>{createdAt}</span>
              {isMobile && (
                <div className="flex items-center gap-2 text-xs">
                  <span>{displayLanguage}</span>
                </div>
              )}
              {saveError && (
                <span className="text-red-500 text-xs" title={saveError}>
                  ⚠️ {isMobile ? 'Save error' : saveError}
                </span>
              )}
              {importError && (
                <span className="text-red-500 text-xs" title={importError}>
                  ⚠️ {isMobile ? 'Import error' : importError}
                </span>
              )}
            </div>
            <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-between text-xs' : ''}`}>
              {!isMobile && <span>{displayLanguage}</span>}
              <span className={isMobile ? 'text-xs' : ''}>{characterCount} characters</span>
              <span className={isMobile ? 'text-xs' : ''}>{lineCount} lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Import Modal */}
      <ImportGithub
        onImport={handleGitHubImport}
        onClose={() => setShowImportModal(false)}
        isVisible={showImportModal}
      />

      {/* Toast Notification */}
      <SimpleToast
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        position="top-right"
      />
    </>
  );
};

export default CodeEditor;