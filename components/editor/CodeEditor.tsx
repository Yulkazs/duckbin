"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { getSyntaxColors, createMonacoTheme } from '@/utils/syntax-colors';
import { createSnippet, forkSnippet, validateSnippet } from '@/lib/snippets';
import { getLanguageById, languages } from '@/utils/languages';
import { Loader2, Check, X, AlertCircle, GitBranch, Github } from 'lucide-react';
import { ImportGithub } from '@/components/selectors/ImportGithub';
import { SimpleToast } from '@/components/ui/Toast';
import { Loading } from '@/components/ui/Loading';

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
  existingSlug?: string;
  isEditing?: boolean;
  originalSnippet?: any;
  currentTitle?: string;
  currentCode?: string;
  currentLanguage?: string;
  currentTheme?: string;
  minHeight?: string;
  maxHeight?: string;
  autoResize?: boolean;
  fillContainer?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  minHeight = '300px',
  maxHeight = '80vh',
  autoResize = false,
  fillContainer = false,
  readOnly = false,
  className = '',
  placeholder = '',
  title = '',
  onTitleChange,
  createdAt = new Date().toLocaleDateString('en-GB'),
  onSave,
  showSaveButton = true,
  onLanguageChange,
  existingSlug,
  isEditing = false,
  originalSnippet,
  currentTitle,
  currentCode,
  currentLanguage,
  currentTheme: propCurrentTheme
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const { theme, currentTheme } = useThemeContext();
  const router = useRouter();

  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monaco, setMonaco] = useState<MonacoEditor | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [localTitle, setLocalTitle] = useState(title);
  const [isMobile, setIsMobile] = useState(false);
  const [containerHeight, setContainerHeight] = useState<string>(height);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState<string | null>(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [initialContent, setInitialContent] = useState({
    title: title,
    code: value,
    language: language,
    theme: currentTheme
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });

  const characterCount = value.length;
  const lineCount = value.split('\n').length;
  const displayLanguage = getLanguageById(language)?.name ?? (language.charAt(0).toUpperCase() + language.slice(1));

  const calculateResponsiveHeight = useCallback(() => {
    if (fillContainer && wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - rect.top - 20;
      const minHeightPx = parseInt(minHeight);
      const maxHeightPx = maxHeight.includes('vh')
        ? (parseInt(maxHeight) / 100) * viewportHeight
        : parseInt(maxHeight);
      return `${Math.max(minHeightPx, Math.min(maxHeightPx, availableHeight))}px`;
    }
    if (autoResize && value) {
      const lines = value.split('\n').length;
      const lineHeight = isMobile ? 18 : 20;
      const statusBarHeight = isMobile ? 44 : 28;
      const padding = 20;
      const contentHeight = lines * lineHeight + statusBarHeight + padding;
      const minHeightPx = parseInt(minHeight);
      const maxHeightPx = maxHeight.includes('vh')
        ? (parseInt(maxHeight) / 100) * window.innerHeight
        : parseInt(maxHeight);
      return `${Math.max(minHeightPx, Math.min(maxHeightPx, contentHeight))}px`;
    }
    return height;
  }, [fillContainer, autoResize, value, minHeight, maxHeight, height, isMobile]);

  useEffect(() => {
    const newHeight = calculateResponsiveHeight();
    if (newHeight !== containerHeight) setContainerHeight(newHeight);
  }, [calculateResponsiveHeight, containerHeight]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (fillContainer || autoResize) setContainerHeight(calculateResponsiveHeight());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fillContainer, autoResize, calculateResponsiveHeight]);

  useEffect(() => {
    if (isEditing && originalSnippet) {
      setHasUnsavedChanges(
        localTitle.trim() !== originalSnippet.title ||
        value !== originalSnippet.code ||
        language !== originalSnippet.language ||
        currentTheme !== originalSnippet.theme
      );
    } else {
      setHasUnsavedChanges(Boolean(localTitle.trim() || value.trim()));
    }
  }, [localTitle, value, language, currentTheme, isEditing, originalSnippet]);

  const handleTitleChange = (newTitle: string) => {
    if (newTitle.length <= 100) {
      const capitalizedTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
      setLocalTitle(capitalizedTitle);
      onTitleChange?.(capitalizedTitle);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
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
    } catch {
      return false;
    }
  };

  const handleGitHubImport = (content: string, filename: string, detectedLanguage: string) => {
    try {
      onChange(content);
      if (onLanguageChange) onLanguageChange(detectedLanguage);
      if (!localTitle.trim() || localTitle === 'Untitled Snippet') handleTitleChange(filename);
      setImportStatus('success');
      showToast(`File "${filename}" imported successfully!`, 'success');
      setTimeout(() => setImportStatus('idle'), 2000);
    } catch (error) {
      setImportStatus('error');
      setImportError(error instanceof Error ? error.message : 'Failed to import file');
      showToast('Failed to import file', 'error');
      setTimeout(() => { setImportStatus('idle'); setImportError(null); }, 3000);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveStatus('idle');

      const snippetData = {
        title: (isEditing && currentTitle ? currentTitle : localTitle).trim() || 'Untitled Snippet',
        code: isEditing && currentCode !== undefined ? currentCode : value,
        language: isEditing && currentLanguage ? currentLanguage : language,
        theme: isEditing && propCurrentTheme ? propCurrentTheme : currentTheme
      };

      const errors = validateSnippet(snippetData);
      if (errors.length > 0) throw new Error(errors.join(', '));

      let response;
      let actionMessage = '';

      if (isEditing && existingSlug && hasUnsavedChanges) {
        response = await forkSnippet(existingSlug, snippetData);
        actionMessage = 'Forked and saved';
      } else {
        response = await createSnippet(snippetData);
        actionMessage = 'Saved';
      }

      setSaveStatus('success');
      if (response.url) {
        const copySuccess = await copyToClipboard(response.url);
        showToast(copySuccess ? `${actionMessage}! URL copied to clipboard` : `${actionMessage}! URL: ${response.url}`, copySuccess ? 'success' : 'info');
      }

      onSave?.(response);

      if (!isEditing && response.snippet?.slug) {
        setTimeout(() => router.push(`/${response.snippet.slug}`), 1000);
      }

      setHasUnsavedChanges(false);
      setInitialContent({ title: snippetData.title, code: snippetData.code, language: snippetData.language, theme: snippetData.theme });
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save snippet');
      showToast('Failed to save snippet', 'error');
      setTimeout(() => { setSaveStatus('idle'); setSaveError(null); }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePlaceholderVisibility = () => {
    if (!placeholderRef.current) return;
    placeholderRef.current.style.display = (!value && placeholder) ? 'block' : 'none';
  };

  // Load Monaco
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: () => `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = { baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/' };
          importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/base/worker/workerMain.js');
        `)}`
      };
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.js';
      script.onload = () => {
        const loader = (window as any).require;
        loader.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        loader(['vs/editor/editor.main'], (monacoInstance: MonacoEditor) => {
          setMonaco(monacoInstance);
          setMonacoLoaded(true);
        });
      };
      script.onerror = () => setLoadError('Failed to load Monaco Editor');
      document.head.appendChild(script);
    } catch {
      setLoadError('Failed to load Monaco Editor');
    }
  }, []);

  // Init Monaco editor
  useEffect(() => {
    if (!monacoLoaded || !containerRef.current || !monaco) return;

    const initEditor = async () => {
      try {
        if (containerRef.current) containerRef.current.innerHTML = '';

        const syntaxColors = getSyntaxColors(currentTheme);
        const themeConfig = createMonacoTheme(currentTheme, syntaxColors);

        // ── Key fix: override the editor background to match the theme ──
        themeConfig.colors['editor.background'] = theme.background;
        themeConfig.colors['editorGutter.background'] = theme.background;

        const themeName = `duckbin-${currentTheme}`;
        monaco.editor.defineTheme(themeName, themeConfig);

        const responsiveOptions = isMobile ? {
          fontSize: 12, lineHeight: 18,
          scrollbar: { vertical: 'auto', horizontal: 'auto', useShadows: false, verticalScrollbarSize: 14, horizontalScrollbarSize: 14 },
          minimap: { enabled: false }, wordWrap: 'on', wrappingIndent: 'indent',
          scrollBeyondLastLine: false, overviewRulerLanes: 0, hideCursorInOverviewRuler: true,
          overviewRulerBorder: false, lineNumbers: 'on', lineNumbersMinChars: 3,
          glyphMargin: false, folding: false, mouseWheelZoom: false, quickSuggestions: false,
          acceptSuggestionOnEnter: 'smart', contextmenu: false, links: false,
          colorDecorators: false, codeLens: false,
          hover: { enabled: false }, parameterHints: { enabled: false }, suggestOnTriggerCharacters: false,
        } : {
          fontSize: 14,
          minimap: { enabled: false },
          scrollbar: { vertical: 'auto', horizontal: 'auto', useShadows: false, verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
          suggestOnTriggerCharacters: true, acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true, quickSuggestions: true,
          parameterHints: { enabled: true }, hover: { enabled: true },
          contextmenu: true, mouseWheelZoom: true,
        };

        editorRef.current = monaco.editor.create(containerRef.current!, {
          value,
          language,
          theme: themeName,
          readOnly,
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
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: !isMobile, bracketPairsHorizontal: !isMobile,
            highlightActiveBracketPair: true, indentation: !isMobile,
          },
          ...responsiveOptions
        });

        editorRef.current.onDidChangeModelContent(() => {
          if (editorRef.current) onChange(editorRef.current.getValue() || '');
        });
        editorRef.current.onDidFocusEditorText(() => updatePlaceholderVisibility());

        setIsEditorReady(true);
      } catch {
        setLoadError('Failed to initialize Monaco Editor');
      }
    };

    initEditor();
    return () => {
      if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null; }
    };
  }, [monacoLoaded, monaco, isMobile]);

  // Update theme — also override background each time
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !monaco) return;
    try {
      const syntaxColors = getSyntaxColors(currentTheme);
      const themeConfig = createMonacoTheme(currentTheme, syntaxColors);
      themeConfig.colors['editor.background'] = theme.background;
      themeConfig.colors['editorGutter.background'] = theme.background;
      const themeName = `duckbin-${currentTheme}`;
      monaco.editor.defineTheme(themeName, themeConfig);
      monaco.editor.setTheme(themeName);
    } catch {}
  }, [currentTheme, theme.background, isEditorReady, monaco]);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !monaco) return;
    try {
      const model = editorRef.current.getModel();
      if (model) monaco.editor.setModelLanguage(model, language);
    } catch {}
  }, [language, isEditorReady, monaco]);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;
    try {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== value) editorRef.current.setValue(value);
    } catch {}
  }, [value, isEditorReady]);

  useEffect(() => { updatePlaceholderVisibility(); }, [value, placeholder]);
  useEffect(() => { setLocalTitle(title); }, [title]);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current) return;
    try { editorRef.current.updateOptions({ readOnly }); } catch {}
  }, [readOnly, isEditorReady]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loadError) {
    return (
      <div className={`space-y-2 ${className}`} ref={wrapperRef}>
        <div className="border-b rounded-lg overflow-hidden flex items-center justify-center"
          style={{ height: containerHeight, borderColor: theme.primary + '40', backgroundColor: theme.background, color: theme.primary }}>
          <div className="text-center px-4">
            <p className="text-red-500 text-sm">{loadError}</p>
            <p className="opacity-60 mt-1 text-xs">Please check your internet connection</p>
          </div>
        </div>
      </div>
    );
  }

  if (!monacoLoaded) {
    return (
      <div className={`space-y-2 ${className}`} ref={wrapperRef}>
        <div className="border rounded-lg overflow-hidden flex items-center justify-center"
          style={{ height: containerHeight, borderColor: theme.primary + '40', backgroundColor: theme.background, color: theme.primary }}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`} ref={wrapperRef}>

        {/* ── Title bar + Import button — OUTSIDE the editor, above it ── */}
        <div
          className="flex items-center justify-between mb-2 px-1"
        >
          {/* Title input */}
          <input
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            readOnly={readOnly}
            placeholder={readOnly ? '' : '*Your Title*'}
            maxLength={100}
            className="outline-none bg-transparent border-0 text-lg font-semibold flex-1"
            style={{
              color: theme.primary,
              fontFamily: 'var(--font-sans)',
              caretColor: theme.primary,
            }}
          />

          {/* Import button — only shown when editable */}
          {!readOnly && (
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 border"
              style={{
                backgroundColor: importStatus === 'success' ? '#10b981'
                  : importStatus === 'error' ? '#ef4444'
                  : theme.surface,
                color: importStatus !== 'idle' ? '#fff' : theme.primary,
                borderColor: theme.primary + '30',
              }}
              title="Import file from GitHub"
            >
              <Github size={15} />
              <span>
                {importStatus === 'success' ? 'Imported!' : importStatus === 'error' ? 'Error' : 'Import'}
              </span>
            </button>
          )}
        </div>

        {/* ── Editor box ── */}
        <div
          className="border rounded-lg overflow-hidden relative flex flex-col"
          style={{
            height: containerHeight,
            borderColor: theme.primary + '40',
            backgroundColor: theme.background,
          }}
        >
          {/* Monaco container */}
          <div ref={containerRef} className="w-full flex-1" style={{ minHeight: 0 }} />

          {/* Placeholder overlay */}
          {placeholder && (
            <div
              ref={placeholderRef}
              className="absolute pointer-events-none"
              style={{
                top: isMobile ? '20px' : '20px',
                left: isMobile ? '20px' : '60px',
                fontSize: isMobile ? '12px' : '14px',
                fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                color: theme.primary,
                opacity: 0.5,
                display: (!value && placeholder) ? 'block' : 'none',
              }}
            >
              {placeholder}
            </div>
          )}

          {/* ── Status bar ── */}
          <div
            className="flex justify-between items-center border-t flex-shrink-0 px-4 py-1 text-xs"
            style={{
              borderColor: theme.primary + '20',
              backgroundColor: theme.background,
              color: theme.primary,
              opacity: 0.8,
              height: isMobile ? 'auto' : '28px',
              minHeight: isMobile ? '44px' : '28px',
            }}
          >
            <div className="flex items-center gap-3">
              <span>{createdAt}</span>
              {saveError && (
                <span className="text-red-500 text-xs" title={saveError}>⚠️ {isMobile ? 'Save error' : saveError}</span>
              )}
              {importError && (
                <span className="text-red-500 text-xs" title={importError}>⚠️ {isMobile ? 'Import error' : importError}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>{displayLanguage}</span>
              {!isMobile && isEditing && hasUnsavedChanges && (
                <span className="text-orange-500" title="Unsaved changes — will create new snippet">Modified ●</span>
              )}
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

      {/* Toast */}
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