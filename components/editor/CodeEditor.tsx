"use client";

import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { getSyntaxColors, createMonacoTheme } from '@/utils/syntax-colors';
import { snippetService } from '@/lib/snippets';
import { getLanguageById, languages } from '@/utils/languages';
import { Save, Loader2, Check, X, Download, Copy } from 'lucide-react';
import { ImportGithub } from '@/components/selectors/ImportGithub';

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
  // Add language change callback
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
  
  // Save functionality states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Import functionality states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState<string | null>(null);

  // Toast notification states
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
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

  const handleTitleChange = (newTitle: string) => {
    // Limit title to 100 characters
    if (newTitle.length <= 100) {
      setLocalTitle(newTitle);
      if (onTitleChange) {
        onTitleChange(newTitle);
      }
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      type,
      visible: true
    });

    // Hide toast after 3 seconds
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
        // Fallback for older browsers
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
    
    // Find language by extension
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
      // Update editor content
      onChange(content);
      
      // Update language if callback is provided
      if (onLanguageChange) {
        onLanguageChange(detectedLanguage);
      }

      // Update title with filename if no title is set
      if (!localTitle.trim() || localTitle === 'Untitled Snippet') {
        handleTitleChange(filename);
      }

      setImportStatus('success');
      showToast(`File "${filename}" imported successfully!`, 'success');

      // Reset success status after 2 seconds
      setTimeout(() => {
        setImportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error handling GitHub import:', error);
      setImportStatus('error');
      setImportError(error instanceof Error ? error.message : 'Failed to import file');
      showToast('Failed to import file', 'error');
      
      // Reset error status after 3 seconds
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

      // Copy URL to clipboard
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
      showToast('Failed to save snippet', 'error');
      
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

  // Render import button
  const renderImportButton = () => {
    return (
      <button
        onClick={() => setShowImportModal(true)}
        className="flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-all duration-200 mr-2"
        style={{
          backgroundColor: importStatus === 'success' ? '#10b981' : importStatus === 'error' ? '#ef4444' : theme.primary + '20',
          color: importStatus === 'success' || importStatus === 'error' ? theme.background : theme.primary,
          border: `1px solid ${theme.primary}40`,
        }}
        title="Import file from GitHub"
      >
        {importStatus === 'success' ? (
          <>
            <Check size={14} />
            <span>Imported!</span>
          </>
        ) : importStatus === 'error' ? (
          <>
            <X size={14} />
            <span>Error</span>
          </>
        ) : (
          <>
            <Download size={14} />
            <span>Import</span>
          </>
        )}
      </button>
    );
  };

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

  // Render toast notification
  const renderToast = () => {
    if (!toast.visible) return null;

    const toastColors = {
      success: { bg: '#10b981', icon: <Check size={16} /> },
      error: { bg: '#ef4444', icon: <X size={16} /> },
      info: { bg: theme.primary, icon: <Copy size={16} /> }
    };

    const colors = toastColors[toast.type];

    return (
      <div
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        style={{ backgroundColor: colors.bg }}
      >
        {colors.icon}
        <span>{toast.message}</span>
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
            
            <div className="flex items-center">
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
              {importError && (
                <span className="text-red-500" title={importError}>
                  ⚠️ {importError}
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

      {/* GitHub Import Modal */}
      <ImportGithub
        onImport={handleGitHubImport}
        onClose={() => setShowImportModal(false)}
        isVisible={showImportModal}
      />

      {/* Toast Notification */}
      {renderToast()}
    </>
  );
};

export default CodeEditor;