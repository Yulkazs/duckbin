// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeContext } from '@/components/ui/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { createSnippet, type CreateSnippetRequest } from '@/lib/snippets'
import { getDefaultLanguage, type Language } from '@/utils/languages'
import {
  Eye, EyeOff,
  Save, Loader2, Check, X,
} from 'lucide-react'

const EXPIRY_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: '1h',    label: '1 hour' },
  { value: '1d',    label: '1 day' },
  { value: '7d',    label: '7 days' },
  { value: '30d',   label: '30 days' },
] as const

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
      style={{
        backgroundColor: checked ? '#22c55e' : '#3f3f46',
      }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? 'translateX(24px)' : 'translateX(4px)' }}
      />
    </button>
  )
}

// ── Password modal ────────────────────────────────────────────────────────────
function PasswordSetupModal({
  onSave,
  onCancel,
  initialValue = '',
}: {
  onSave: (pw: string) => void
  onCancel: () => void
  initialValue?: string
}) {
  const { theme } = useThemeContext()
  const [value, setValue] = useState(initialValue)
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)

  const mismatch = confirm.length > 0 && value !== confirm

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-xl p-8 shadow-2xl border"
        style={{ backgroundColor: theme.surface, borderColor: theme.secondary + '60', color: theme.primary }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">Set a password</h2>
        </div>
        <p className="text-sm opacity-60 mb-5">Anyone with the link will need this password to view the snippet.</p>

        {(['Password', 'Confirm'] as const).map((label, i) => (
          <div className="relative mb-3" key={label}>
            <input
              type={show ? 'text' : 'password'}
              placeholder={label}
              value={i === 0 ? value : confirm}
              onChange={e => i === 0 ? setValue(e.target.value) : setConfirm(e.target.value)}
              className="w-full rounded-lg px-4 py-3 pr-10 text-sm outline-none border"
              style={{
                backgroundColor: theme.background,
                borderColor: (i === 1 && mismatch) ? '#ef4444' : theme.secondary + '60',
                color: theme.primary,
              }}
            />
            {i === 0 && (
              <button onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80"
                style={{ color: theme.primary }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>
        ))}
        {mismatch && <p className="text-red-400 text-xs mb-3">Passwords don't match</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onCancel}
            className="flex-1 rounded-lg py-2.5 text-sm border"
            style={{ borderColor: theme.secondary + '60', color: theme.primary }}>
            Cancel
          </button>
          <button
            onClick={() => !mismatch && value && onSave(value)}
            disabled={!value || mismatch}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold disabled:opacity-40"
            style={{ backgroundColor: theme.accent, color: '#fff' }}>
            Set password
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Options bar — matches screenshot layout ───────────────────────────────────
function OptionsBar({
  expiresIn, setExpiresIn,
  password, setPassword,
  burnAfterReading, setBurnAfterReading,
}: {
  expiresIn: string
  setExpiresIn: (v: string) => void
  password: string
  setPassword: (v: string) => void
  burnAfterReading: boolean
  setBurnAfterReading: (v: boolean) => void
}) {
  const { theme } = useThemeContext()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const passwordEnabled = Boolean(password)

  const labelStyle = {
    color: theme.primary,
    fontSize: '0.875rem',
    fontWeight: 500,
  }

  const subLabelStyle = {
    color: theme.secondary,
    fontSize: '0.75rem',
  }

  return (
    <>
      {showPasswordModal && (
        <PasswordSetupModal
          initialValue={password}
          onSave={pw => { setPassword(pw); setShowPasswordModal(false) }}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}

      <div className="flex flex-wrap items-center gap-6 pt-3">
        {/* Expiration */}
        <div className="flex items-center gap-2">
          <span style={labelStyle}>Expiration:</span>
          <div className="relative">
            <select
              value={expiresIn}
              onChange={e => setExpiresIn(e.target.value)}
              className="appearance-none rounded-lg px-3 py-1.5 pr-8 text-sm font-medium border outline-none cursor-pointer"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.secondary + '50',
                color: theme.primary,
              }}
            >
              {EXPIRY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-60" style={{ color: theme.primary }}>
              ▾
            </span>
          </div>
          {expiresIn !== 'never' && (
            <span style={subLabelStyle}>
              Auto-delete after {EXPIRY_OPTIONS.find(o => o.value === expiresIn)?.label}
            </span>
          )}
          {expiresIn === 'never' && (
            <span style={subLabelStyle}>No expiry</span>
          )}
        </div>

        {/* Password Protect */}
        <div className="flex items-center gap-2">
          <span style={labelStyle}>Password Protect:</span>
          <Toggle
            checked={passwordEnabled}
            onChange={on => {
              if (on) {
                setShowPasswordModal(true)
              } else {
                setPassword('')
              }
            }}
          />
        </div>

        {/* Burn after reading */}
        <div className="flex items-center gap-2">
          <span style={labelStyle}>Burn after reading:</span>
          <Toggle
            checked={burnAfterReading}
            onChange={setBurnAfterReading}
          />
        </div>
      </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const { theme } = useThemeContext()
  const router = useRouter()

  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('plaintext')

  // Options
  const [expiresIn, setExpiresIn] = useState('7d')
  const [password, setPassword] = useState('')
  const [burnAfterReading, setBurnAfterReading] = useState(false)

  // Save state
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    if (!code.trim() || saving) return
    setSaving(true)
    setSaveStatus('idle')
    try {
      const data: CreateSnippetRequest = {
        title: title.trim() || 'Untitled Snippet',
        code,
        language,
        theme: 'obsidian',
        expiresIn: expiresIn as any,
        ...(password ? { password } : {}),
        burnAfterReading,
      }
      const result = await createSnippet(data)
      setSaveStatus('success')
      setTimeout(() => router.push(`/${result.snippet.slug}`), 600)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleLanguageChange = (lang: Language) => setLanguage(lang.id)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background, color: theme.primary }}>
      <Header onLanguageChange={handleLanguageChange} selectedLanguage={language} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          onLanguageChange={setLanguage}
          title={title}
          onTitleChange={setTitle}
          height="580px"
          showSaveButton={false}
          className="w-full"
        />

        {/* Options + save row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-1 px-1">
          <OptionsBar
            expiresIn={expiresIn}
            setExpiresIn={setExpiresIn}
            password={password}
            setPassword={setPassword}
            burnAfterReading={burnAfterReading}
            setBurnAfterReading={setBurnAfterReading}
          />

          <button
            onClick={handleSave}
            disabled={!code.trim() || saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40 transition-all"
            style={{
              backgroundColor: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : theme.accent,
              color: '#fff',
            }}
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Saving…</>
            ) : saveStatus === 'success' ? (
              <><Check size={15} /> Saved!</>
            ) : saveStatus === 'error' ? (
              <><X size={15} /> Error</>
            ) : (
              <><Save size={15} /> Save snippet</>
            )}
          </button>
        </div>
      </div>

      <Footer className="mt-10" />
    </div>
  )
}