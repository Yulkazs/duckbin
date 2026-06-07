// app/[slug]/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ThemeProvider, useThemeContext } from '@/components/ui/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CodeEditor } from '@/components/editor/CodeEditor'
import {
  getSnippet, forkSnippet, deleteSnippet,
  getOwnerToken, formatExpiry, type SnippetData,
} from '@/lib/snippets'
import {
  Copy, Check, GitBranch, Edit3, Eye, Trash2, Clock,
  Lock, Flame, AlertCircle, X, Eye as EyeIcon, EyeOff,
} from 'lucide-react'
import { ToastContainer, useToast, type Toast } from '@/components/ui/Toast'
import { Confirmation } from '@/components/ui/Confirmation'
import Loading from '@/components/ui/Loading'
import { getLanguageById } from '@/utils/languages'

// ── Password Modal ────────────────────────────────────────────────────────────
function PasswordModal({ onSubmit, error }: { onSubmit: (pw: string) => void; error?: string }) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  const { theme } = useThemeContext()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-xl p-8 shadow-2xl border"
        style={{ backgroundColor: theme.surface, borderColor: theme.secondary + '60', color: theme.primary }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock size={22} style={{ color: theme.accent }} />
          <h2 className="text-xl font-semibold">Password required</h2>
        </div>
        <p className="text-sm mb-5 opacity-70">This snippet is password protected. Enter the password to view it.</p>

        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && value && onSubmit(value)}
            placeholder="Enter password"
            autoFocus
            className="w-full rounded-lg px-4 py-3 pr-10 text-sm outline-none border"
            style={{
              backgroundColor: theme.background,
              borderColor: error ? '#ef4444' : theme.secondary + '60',
              color: theme.primary,
            }}
          />
          <button
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80"
            style={{ color: theme.primary }}
          >
            {show ? <EyeOff size={16} /> : <EyeIcon size={16} />}
          </button>
        </div>

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        <button
          onClick={() => value && onSubmit(value)}
          disabled={!value}
          className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ backgroundColor: theme.accent, color: '#fff' }}
        >
          Unlock snippet
        </button>
      </div>
    </div>
  )
}

// ── Burn warning ──────────────────────────────────────────────────────────────
function BurnWarning({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { theme } = useThemeContext()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-xl p-8 shadow-2xl border"
        style={{ backgroundColor: theme.surface, borderColor: '#ef444460', color: theme.primary }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame size={22} className="text-orange-400" />
          <h2 className="text-xl font-semibold">Burn after reading</h2>
        </div>
        <p className="text-sm mb-6 opacity-70">
          This snippet is set to <strong>burn after reading</strong>. Once you view it,
          it will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg py-2.5 text-sm font-medium border"
            style={{ borderColor: theme.secondary + '60', color: theme.primary }}
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold bg-orange-500 text-white"
          >
            View & burn
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page content ─────────────────────────────────────────────────────────
function SlugPageContent() {
  const { theme } = useThemeContext()
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [snippet, setSnippet] = useState<SnippetData | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth / lifecycle states
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string>()
  const [showBurnWarning, setShowBurnWarning] = useState(false)
  const [burned, setBurned] = useState(false)

  // Editing state (owner only)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCode, setEditedCode] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [editedLanguage, setEditedLanguage] = useState('plaintext')
  const [editedTheme, setEditedTheme] = useState('obsidian')

  // UI
  const [copyCodeStatus, setCopyCodeStatus] = useState<'idle' | 'copied'>('idle')
  const [copyLinkStatus, setCopyLinkStatus] = useState<'idle' | 'copied'>('idle')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const { addToast, removeToast } = useToast()

  const toast = (msg: string, type: Toast['type'] = 'info') => {
    const t = addToast(msg, type)
    setToasts(p => [...p, t])
  }

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchSnippet = useCallback(async (password?: string, triggerBurn = false) => {
    if (!slug) return
    try {
      setLoading(true)
      setError(null)
      const result = await getSnippet(slug, { password, triggerBurn })

      if (result.requiresPassword) {
        setRequiresPassword(true)
        setLoading(false)
        return
      }

      setSnippet(result.snippet)
      setIsOwner(result.isOwner ?? false)
      setEditedCode(result.snippet.code)
      setEditedTitle(result.snippet.title)
      setEditedLanguage(result.snippet.language)
      setEditedTheme(result.snippet.theme)
      setRequiresPassword(false)
      setPasswordError(undefined)
    } catch (err: any) {
      const msg = err.message || 'Failed to load snippet'
      if (msg.includes('burned') || msg.includes('410')) {
        setBurned(true)
      } else if (msg === 'Incorrect password') {
        setPasswordError('Incorrect password, try again.')
        setRequiresPassword(true)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchSnippet()
  }, [fetchSnippet])

  // After snippet loaded, check if burn-after-reading warning needed
  useEffect(() => {
    if (snippet && snippet.burnAfterReading && !isOwner && !burned) {
      setShowBurnWarning(true)
    }
  }, [snippet, isOwner, burned])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handlePasswordSubmit = (pw: string) => {
    fetchSnippet(pw)
  }

  const handleBurnConfirm = () => {
    setShowBurnWarning(false)
    fetchSnippet(undefined, true) // re-fetch with burn=1
  }

  const handleBurnCancel = () => {
    router.push('/')
  }

  const copyCode = async () => {
    if (!snippet) return
    await navigator.clipboard.writeText(snippet.code).catch(() => {})
    setCopyCodeStatus('copied')
    toast('Code copied!', 'success')
    setTimeout(() => setCopyCodeStatus('idle'), 2000)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopyLinkStatus('copied')
    toast('Link copied!', 'success')
    setTimeout(() => setCopyLinkStatus('idle'), 2000)
  }

  const handleDelete = async () => {
    if (!snippet) return
    try {
      await deleteSnippet(snippet.slug)
      toast('Snippet deleted', 'success')
      setTimeout(() => router.push('/'), 800)
    } catch (err: any) {
      toast(err.message || 'Failed to delete', 'error')
    }
  }

  const handleFork = async () => {
    if (!snippet) return
    try {
      const result = await forkSnippet(snippet.slug, {
        title: editedTitle,
        code: editedCode,
        language: editedLanguage,
        theme: editedTheme,
      })
      toast('Forked! Redirecting…', 'success')
      setTimeout(() => router.push(`/${result.snippet.slug}`), 900)
    } catch (err: any) {
      toast(err.message || 'Fork failed', 'error')
    }
  }

  // ── Render states ────────────────────────────────────────────────────────────
  if (loading && !requiresPassword) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
        <Header />
        <Loading />
      </div>
    )
  }

  if (burned) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: theme.background, color: theme.primary }}>
        <Flame size={48} className="text-orange-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">This snippet has been burned</h2>
        <p className="opacity-60 mb-6">It was set to self-destruct after reading and no longer exists.</p>
        <button onClick={() => router.push('/')} className="rounded-lg px-5 py-2.5 text-sm font-medium" style={{ backgroundColor: theme.accent, color: '#fff' }}>
          Create new snippet
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm" style={{ color: theme.primary }}>
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-3">Snippet not found</h2>
            <p className="opacity-60 text-sm mb-6">{error}</p>
            <button onClick={() => router.push('/')} className="rounded-lg px-5 py-2.5 text-sm font-medium" style={{ backgroundColor: theme.accent, color: '#fff' }}>
              Go home
            </button>
          </div>
        </main>
      </div>
    )
  }

  const isViewOnly = !isOwner || !isEditing

  // ── Full render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background, color: theme.primary }}>
      {/* Modals */}
      {requiresPassword && (
        <PasswordModal onSubmit={handlePasswordSubmit} error={passwordError} />
      )}
      {showBurnWarning && snippet && (
        <BurnWarning onConfirm={handleBurnConfirm} onCancel={handleBurnCancel} />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => removeToast(p, id))} position="top-right" />

      <Header />

      {snippet && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">

          {/* ── Top bar ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">

            {/* Left — title + badges */}
            <div className="flex items-start sm:items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold truncate max-w-xs sm:max-w-md">{snippet.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: theme.accent + '20', color: theme.accent }}>
                    Owner
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: theme.secondary + '30', color: theme.secondary }}>
                    View only
                  </span>
                )}
                {snippet.hasPassword && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: theme.surface, color: theme.secondary }}>
                    <Lock size={10} /> Protected
                  </span>
                )}
                {snippet.burnAfterReading && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-orange-400"
                    style={{ backgroundColor: '#f9731620' }}>
                    <Flame size={10} /> Burns on read
                  </span>
                )}
                {snippet.expiresAt && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: theme.surface, color: theme.secondary }}>
                    <Clock size={10} /> {formatExpiry(snippet.expiresAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Right — actions */}
            <div className="flex items-center gap-2">
              {/* Copy code — prominent for viewers */}
              {!isEditing && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: copyCodeStatus === 'copied' ? '#10b981' : theme.accent,
                    color: '#fff',
                  }}
                >
                  {copyCodeStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copyCodeStatus === 'copied' ? 'Copied!' : 'Copy code'}</span>
                </button>
              )}

              {/* Copy link */}
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all"
                style={{
                  borderColor: theme.secondary + '50',
                  color: copyLinkStatus === 'copied' ? '#10b981' : theme.primary,
                }}
              >
                {copyLinkStatus === 'copied' ? <Check size={15} /> : <Copy size={15} />}
                <span className="hidden sm:inline">Copy link</span>
              </button>

              {/* Owner actions */}
              {isOwner && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleFork}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg"
                        style={{ backgroundColor: theme.accent, color: '#fff' }}
                      >
                        <GitBranch size={15} />
                        <span>Fork & save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border"
                        style={{ borderColor: theme.secondary + '50', color: theme.primary }}
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border"
                      style={{ borderColor: theme.secondary + '50', color: theme.primary }}
                    >
                      <Edit3 size={15} />
                      <span>Fork & edit</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors hover:border-red-400 hover:text-red-400"
                    style={{ borderColor: theme.secondary + '50', color: theme.secondary }}
                    title="Delete snippet"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Metadata strip ── */}
          <div className="flex flex-wrap items-center gap-4 text-xs mb-5 px-1"
            style={{ color: theme.secondary }}>
            <span><strong style={{ color: theme.primary }}>Language:</strong> {getLanguageById(snippet.language)?.name ?? snippet.language}</span>
            <span><strong style={{ color: theme.primary }}>Theme:</strong> {snippet.theme}</span>
            <span><strong style={{ color: theme.primary }}>Created:</strong> {new Date(snippet.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span><strong style={{ color: theme.primary }}>Views:</strong> {snippet.viewCount}</span>
          </div>

          {/* ── Fork mode notice ── */}
          {isEditing && (
            <div className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
              style={{ backgroundColor: theme.accent + '15', color: theme.accent, borderLeft: `3px solid ${theme.accent}` }}>
              <GitBranch size={15} />
              <span><strong>Fork mode:</strong> Changes will create a new snippet. The original stays untouched.</span>
            </div>
          )}

          {/* ── Code editor ── */}
          <CodeEditor
            value={isEditing ? editedCode : snippet.code}
            onChange={setEditedCode}
            language={isEditing ? editedLanguage : snippet.language}
            title={isEditing ? editedTitle : snippet.title}
            onTitleChange={isEditing ? setEditedTitle : undefined}
            onLanguageChange={isEditing ? setEditedLanguage : undefined}
            height="600px"
            readOnly={!isEditing}
            showSaveButton={false}
            createdAt={new Date(snippet.createdAt).toLocaleDateString('en-GB')}
            className="w-full"
          />

          {/* ── Viewer copy hint ── */}
          {!isOwner && (
            <div className="mt-4 text-center text-xs" style={{ color: theme.secondary }}>
              Use the <strong style={{ color: theme.primary }}>Copy code</strong> button above to copy the full snippet.
            </div>
          )}
        </main>
      )}

      <Confirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete snippet?"
        message="This will permanently delete the snippet. This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Footer className="mt-6" />
    </div>
  )
}

export default function SlugPage() {
  return (
    <ThemeProvider>
      <SlugPageContent />
    </ThemeProvider>
  )
}
