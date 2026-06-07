// lib/snippets.ts
// Updated client-side service for the new API

const OWNER_TOKEN_PREFIX = 'duckbin-owner-'

export interface SnippetData {
  id: string
  slug: string
  title: string
  code: string
  language: string
  theme: string
  hasPassword: boolean
  burnAfterReading: boolean
  expiresAt: string | null
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateSnippetRequest {
  title: string
  code: string
  language: string
  theme: string
  password?: string
  burnAfterReading?: boolean
  expiresIn?: 'never' | '1h' | '1d' | '7d' | '30d'
}

export interface SnippetResponse {
  snippet: SnippetData
  isOwner?: boolean
  ownerToken?: string
  requiresPassword?: boolean
  url?: string
  message?: string
}

// ── localStorage helpers ──────────────────────────────────────────────────────

export function saveOwnerToken(slug: string, token: string): void {
  try {
    localStorage.setItem(`${OWNER_TOKEN_PREFIX}${slug}`, token)
  } catch {}
}

export function getOwnerToken(slug: string): string | null {
  try {
    return localStorage.getItem(`${OWNER_TOKEN_PREFIX}${slug}`)
  } catch {
    return null
  }
}

export function removeOwnerToken(slug: string): void {
  try {
    localStorage.removeItem(`${OWNER_TOKEN_PREFIX}${slug}`)
  } catch {}
}

// ── API calls ─────────────────────────────────────────────────────────────────

const BASE = '/api/snippets'

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export async function createSnippet(data: CreateSnippetRequest): Promise<SnippetResponse> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await handleResponse<SnippetResponse>(res)

  // Persist owner token
  if (result.ownerToken && result.snippet?.slug) {
    saveOwnerToken(result.snippet.slug, result.ownerToken)
  }

  return result
}

export async function getSnippet(
  slug: string,
  options: { password?: string; triggerBurn?: boolean } = {}
): Promise<SnippetResponse> {
  const ownerToken = getOwnerToken(slug)
  const params = new URLSearchParams()
  if (ownerToken) params.set('ownerToken', ownerToken)
  if (options.password) params.set('password', options.password)
  if (options.triggerBurn) params.set('burn', '1')

  const res = await fetch(`${BASE}/${slug}?${params}`)
  return handleResponse<SnippetResponse>(res)
}

export async function updateSnippet(
  slug: string,
  data: Partial<CreateSnippetRequest>
): Promise<SnippetResponse> {
  const ownerToken = getOwnerToken(slug)
  if (!ownerToken) throw new Error('Not authorized — no owner token found')

  const res = await fetch(`${BASE}/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ownerToken }),
  })
  return handleResponse<SnippetResponse>(res)
}

export async function deleteSnippet(slug: string): Promise<void> {
  const ownerToken = getOwnerToken(slug)
  if (!ownerToken) throw new Error('Not authorized')

  const res = await fetch(`${BASE}/${slug}?ownerToken=${ownerToken}`, {
    method: 'DELETE',
  })
  await handleResponse(res)
  removeOwnerToken(slug)
}

export async function forkSnippet(
  slug: string,
  data: Partial<CreateSnippetRequest>
): Promise<SnippetResponse> {
  const res = await fetch(`${BASE}/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await handleResponse<SnippetResponse>(res)

  if (result.ownerToken && result.snippet?.slug) {
    saveOwnerToken(result.snippet.slug, result.ownerToken)
  }

  return result
}

// ── Validation ────────────────────────────────────────────────────────────────

export function validateSnippet(data: CreateSnippetRequest): string[] {
  const errors: string[] = []
  if (!data.title?.trim()) errors.push('Title is required')
  else if (data.title.length > 100) errors.push('Title must be ≤ 100 characters')
  if (!data.code?.trim()) errors.push('Code is required')
  if (!data.language?.trim()) errors.push('Language is required')
  if (!data.theme?.trim()) errors.push('Theme is required')
  return errors
}

export function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return 'Never expires'
  const d = new Date(expiresAt)
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  if (diff < 0) return 'Expired'
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return `Expires in ${Math.floor(diff / 60000)} minutes`
  if (hours < 24) return `Expires in ${hours} hour${hours !== 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `Expires in ${days} day${days !== 1 ? 's' : ''}`
}
