// app/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Header } from '@/components/Header';
import { ThemeProvider, useThemeContext } from '@/components/ui/ThemeProvider';
import { Confirmation } from '@/components/ui/Confirmation';
import { snippetService, type CodeSnippetData } from '@/lib/snippets';
import { getLanguageById, type Language } from '@/utils/languages';
import { Loader2, AlertCircle, Edit3, Eye, Copy, Check, Trash2 } from 'lucide-react';
import { ToastContainer, useToast, type Toast } from '@/components/ui/Toast';
import Loading from '@/components/ui/Loading';

function SlugPageContent() {
  const { theme, changeTheme, currentTheme } = useThemeContext();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // State management
  const [snippet, setSnippet] = useState<CodeSnippetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Edit state
  const [editedCode, setEditedCode] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLanguage, setEditedLanguage] = useState('plaintext');
  const [editedTheme, setEditedTheme] = useState('dark');
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);

  // Original values for comparison
  const [originalTheme, setOriginalTheme] = useState('dark');

  // Action states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const [toasts, setToasts] = useState<Toast[]>([]);
    const { addToast, removeToast } = useToast();

    const handleAddToast = (message: string, type: Toast['type'] = 'info') => {
        const newToast = addToast(message, type);
        setToasts(prev => [...prev, newToast]);
        };

        const handleRemoveToast = (id: string) => {
        setToasts(prev => removeToast(prev, id));
    };

  const fetchSnippet = async () => {
    if (!slug) return;

    try {
        setLoading(true);
        setError(null);

        const response = await snippetService.getSnippetBySlug(slug);
        const snippetData = response.snippet;
        
        setSnippet(snippetData);
        setEditedCode(snippetData.code);
        setEditedTitle(snippetData.title);
        setEditedLanguage(snippetData.language);
        
        // Handle theme - use snippet's theme if available, otherwise use dark as default
        const snippetTheme = snippetData.theme || 'dark';
        setEditedTheme(snippetTheme);
        setOriginalTheme(snippetTheme);
        
        // Apply the snippet's theme immediately when loading
        changeTheme(snippetTheme);
        
        setHasChanges(false);

    } catch (err) {
        console.error('Error fetching snippet:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load snippet';
        setError(errorMessage);
        
        // If snippet not found, show a user-friendly message
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        setError('This snippet could not be found. It may have been deleted or the link is incorrect.');
        }
    } finally {
        setLoading(false);
    }
  };

    const copyToClipboard = async () => {
        if (!snippet) return;

        try {
            const url = `${window.location.origin}/${snippet.slug}`;
            await navigator.clipboard.writeText(url);
            setCopyStatus('copied');
            handleAddToast('Link copied to clipboard!', 'success');
            
            setTimeout(() => {
            setCopyStatus('idle');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            handleAddToast('Failed to copy link to clipboard', 'error'); 
        }
    };

  const handleCodeChange = (newCode: string) => {
    setEditedCode(newCode);
    setHasChanges(
      newCode !== snippet?.code ||
      editedTitle !== snippet?.title ||
      editedLanguage !== snippet?.language ||
      editedTheme !== originalTheme
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setEditedTitle(newTitle);
    setHasChanges(
      editedCode !== snippet?.code ||
      newTitle !== snippet?.title ||
      editedLanguage !== snippet?.language ||
      editedTheme !== originalTheme
    );
  };

  const handleLanguageChange = (language: Language) => {
    setEditedLanguage(language.id);
    setHasChanges(
      editedCode !== snippet?.code ||
      editedTitle !== snippet?.title ||
      language.id !== snippet?.language ||
      editedTheme !== originalTheme
    );
  };

  const handleThemeChange = (themeName: string) => {
    setEditedTheme(themeName);

    if (isEditing) {
      changeTheme(themeName);
    }
    setHasChanges(
      editedCode !== snippet?.code ||
      editedTitle !== snippet?.title ||
      editedLanguage !== snippet?.language ||
      themeName !== originalTheme
    );
  };

  const handleSave = async () => {
    if (!snippet || !hasChanges) return;

    try {
      setIsSaving(true);
      
      const updateData = {
        title: editedTitle.trim(),
        code: editedCode,
        language: editedLanguage,
        theme: editedTheme
      };

      const response = await snippetService.updateSnippetBySlug(snippet.slug, updateData);
      
      setSnippet(response.snippet);
      setOriginalTheme(editedTheme);
      setHasChanges(false);
      handleAddToast('Changes saved successfully!', 'success');

      setTimeout(async () => {
        await copyToClipboard();
      }, 500);

    } catch (err) {
      console.error('Error saving changes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes';
      handleAddToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!snippet) return;

    try {
        setIsDeleting(true);
        await snippetService.deleteSnippetBySlug(snippet.slug);
        handleAddToast('Snippet deleted successfully', 'success');
        
        setShowDeleteConfirmation(false);
        
        setTimeout(() => {
        router.push('/');
        }, 1500);
        
    } catch (err) {
        console.error('Error deleting snippet:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete snippet';
        handleAddToast(errorMessage, 'error');
    } finally {
        setIsDeleting(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing && hasChanges) {
        setShowEditConfirmation(true);
        return;
    }

    if (isEditing) {
        setEditedCode(snippet?.code || '');
        setEditedTitle(snippet?.title || '');
        setEditedLanguage(snippet?.language || 'plaintext');
        setEditedTheme(originalTheme);
        
        changeTheme(originalTheme);
        setHasChanges(false);
    }

    setIsEditing(!isEditing);
  };

  const handleExitEditMode = () => {
    setEditedCode(snippet?.code || '');
    setEditedTitle(snippet?.title || '');
    setEditedLanguage(snippet?.language || 'plaintext');
    setEditedTheme(originalTheme);
    
    changeTheme(originalTheme);
    setHasChanges(false);
    setIsEditing(false);
    setShowEditConfirmation(false);
  };

  useEffect(() => {
    fetchSnippet();
  }, [slug]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-semibold mb-4">Snippet Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen flex flex-col">
        {/* Toast notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <ToastContainer 
                toasts={toasts} 
                onRemove={handleRemoveToast}
                position="top-right"
            />
        </div>

      <Header 
        onLanguageChange={handleLanguageChange}
        selectedLanguage={editedLanguage}
        onThemeChange={handleThemeChange}
        selectedTheme={editedTheme}
        isReadOnly={!isEditing}
        showSnippetData={true}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {snippet && (
          <>
            {/* Action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold" style={{ color: `var(--primary, ${theme.primary})` }}>
                  {snippet.title}
                </h1>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <span className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full">
                      Editing
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full">
                      Read-only
                    </span>
                  )}
                  {hasChanges && (
                    <span className="px-2 py-1 text-xs bg-orange-200 text-orange-800 rounded-full">
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Copy link button */}
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors min-w-[100px] justify-center"
                  title="Copy link to clipboard"
                >
                  {copyStatus === 'copied' ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* Edit/View toggle */}
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors min-w-[100px] justify-center"
                >
                  {isEditing ? (
                    <>
                      <Eye size={16} />
                      <span>View</span>
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </>
                  )}
                </button>

                {/* Save button */}
                {isEditing && hasChanges && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed min-w-[100px] justify-center"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                )}

                {/* Delete button */}
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed min-w-[100px] justify-center"
                  title="Delete snippet"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Snippet metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span>
                <strong>Language:</strong> {getLanguageById(snippet.language)?.name || snippet.language}
              </span>
              <span>
                <strong>Theme:</strong> {snippet.theme || 'dark'}
              </span>
              <span>
                <strong>Created:</strong> {new Date(snippet.createdAt || '').toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {snippet.updatedAt && snippet.updatedAt !== snippet.createdAt && (
                <span>
                  <strong>Updated:</strong> {new Date(snippet.updatedAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
              <span>
                <strong>Link:</strong> {snippet.slug}
              </span>
            </div>

            {/* Code editor */}
            <div className="rounded-lg shadow-sm">
              <CodeEditor
                value={isEditing ? editedCode : snippet.code}
                onChange={handleCodeChange}
                language={isEditing ? editedLanguage : snippet.language}
                title={isEditing ? editedTitle : snippet.title}
                onTitleChange={isEditing ? handleTitleChange : undefined}
                onLanguageChange={isEditing ? (lang) => setEditedLanguage(lang) : undefined}
                height="calc(100vh - 400px)"
                readOnly={!isEditing}
                placeholder={isEditing ? "Start typing your code..." : ""}
                showSaveButton={false}
                createdAt={new Date(snippet.createdAt || '').toLocaleDateString('en-GB')}
              />
            </div>

            {/* Footer info */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                This snippet can be shared using the URL: 
                <code className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  {typeof window !== 'undefined' ? `${window.location.origin}/${snippet.slug}` : `/${snippet.slug}`}
                </code>
              </p>
            </div>
          </>
        )}
      </main>
      {/* Confirmation Modal */}
      <Confirmation
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Deleting Snippet"
        message={
          <div>
            <p className="mb-3">Are you sure you want to delete this snippet?</p>
            <p className="mb-4">
              <span className="text-white font-semibold">"{snippet?.title}"</span> will be permanently deleted and cannot be recovered.
            </p>
          </div>
        }
        confirmText="Yes, Delete it"
        type="danger"
        isLoading={isDeleting}
      />
      {/* Exit Edit Mode Confirmation Modal */}
        <Confirmation
        isOpen={showEditConfirmation}
        onClose={() => setShowEditConfirmation(false)}
        onConfirm={handleExitEditMode}
        title="Discard Changes?"
        message={
            <div>
            <p className="mb-3">You have unsaved changes that will be lost.</p>
            <p className="mb-4">Are you sure you want to exit edit mode without saving?</p>
            </div>
        }
        confirmText="Yes, Discard Changes"
        cancelText="Keep Editing"
        type="warning"
        />
    </div>
  );
}

export default function SlugPage() {
  return (
    <ThemeProvider>
      <SlugPageContent />
    </ThemeProvider>
  );
}