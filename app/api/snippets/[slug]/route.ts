// app/api/snippets/[slug]/route.ts
// Replaces app/api/code-snippets/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isValidSlug, generateUniqueSlug } from '@/utils/slug'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function sanitizeSnippet(snippet: any, includeCode = true) {
  const { ownerToken, passwordHash, ...safe } = snippet
  return {
    ...safe,
    hasPassword: Boolean(passwordHash),
    ...(includeCode ? {} : { code: undefined }),
  }
}

// GET — fetch a snippet by slug
// Query params:
//   ownerToken: string  — if valid, returns full owner view
//   password: string    — if snippet has password, must provide this
//   burn: '1'           — signals this is the "reading" view (triggers burn)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const ownerToken = searchParams.get('ownerToken')
  const password = searchParams.get('password')
  const burn = searchParams.get('burn') === '1'

  const snippet = await prisma.snippet.findUnique({ where: { slug } })

  if (!snippet) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
  }

  // Check if expired
  if (snippet.expiresAt && snippet.expiresAt < new Date()) {
    await prisma.snippet.delete({ where: { slug } }).catch(() => {})
    return NextResponse.json({ error: 'This snippet has expired' }, { status: 410 })
  }

  // Check if already burned
  if (snippet.burnedAt) {
    return NextResponse.json({ error: 'This snippet has been burned and is no longer available' }, { status: 410 })
  }

  // Verify owner token
  const isOwner = Boolean(
    ownerToken && hashToken(ownerToken) === snippet.ownerToken
  )

  // Password check (owners bypass)
  if (snippet.passwordHash && !isOwner) {
    if (!password) {
      // Tell client a password is needed — but don't send code
      return NextResponse.json(
        { requiresPassword: true, snippet: sanitizeSnippet(snippet, false) },
        { status: 200 }
      )
    }
    const passwordOk = await bcrypt.compare(password, snippet.passwordHash)
    if (!passwordOk) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
  }

  // Burn after reading: trigger on first non-owner read
  if (snippet.burnAfterReading && !isOwner && burn) {
    await prisma.snippet.update({
      where: { slug },
      data: { burnedAt: new Date() },
    })
  }

  // Increment view count (non-owner views only)
  if (!isOwner) {
    await prisma.snippet.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})
  }

  return NextResponse.json({
    snippet: sanitizeSnippet(snippet),
    isOwner,
    url: `${request.nextUrl.origin}/${snippet.slug}`,
  })
}

// PUT — update a snippet (owner only, by ownerToken in body)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
  }

  const body = await request.json()
  const { ownerToken, title, code, language, theme, password, burnAfterReading, expiresIn } = body

  if (!ownerToken) {
    return NextResponse.json({ error: 'Owner token required' }, { status: 401 })
  }

  const snippet = await prisma.snippet.findUnique({ where: { slug } })
  if (!snippet) return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })

  if (hashToken(ownerToken) !== snippet.ownerToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const updateData: any = {}
  if (title !== undefined) updateData.title = title.trim()
  if (code !== undefined) updateData.code = code
  if (language !== undefined) updateData.language = language
  if (theme !== undefined) updateData.theme = theme
  if (burnAfterReading !== undefined) updateData.burnAfterReading = Boolean(burnAfterReading)

  if (password !== undefined) {
    updateData.passwordHash = password ? await bcrypt.hash(password, 10) : null
  }

  if (expiresIn !== undefined) {
    const durations: Record<string, number> = {
      '1h':  1 * 60 * 60 * 1000,
      '1d':  24 * 60 * 60 * 1000,
      '7d':  7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }
    updateData.expiresAt = expiresIn === 'never' ? null : new Date(Date.now() + (durations[expiresIn] ?? 0))
  }

  const updated = await prisma.snippet.update({ where: { slug }, data: updateData })

  return NextResponse.json({
    message: 'Snippet updated',
    snippet: sanitizeSnippet(updated),
  })
}

// DELETE — owner only
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const ownerToken = searchParams.get('ownerToken')

  if (!ownerToken) {
    return NextResponse.json({ error: 'Owner token required' }, { status: 401 })
  }

  const snippet = await prisma.snippet.findUnique({ where: { slug } })
  if (!snippet) return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })

  if (hashToken(ownerToken) !== snippet.ownerToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  await prisma.snippet.delete({ where: { slug } })

  return NextResponse.json({ message: 'Snippet deleted' })
}

// POST to /api/snippets/[slug]/fork — create a copy
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const body = await request.json()

  const original = await prisma.snippet.findUnique({ where: { slug } })
  if (!original) return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })

  const newSlug = await generateUniqueSlug()
  const ownerToken = crypto.randomBytes(32).toString('hex')
  const ownerTokenHash = crypto.createHash('sha256').update(ownerToken).digest('hex')

  const forked = await prisma.snippet.create({
    data: {
      slug: newSlug,
      title: body.title || `${original.title} (fork)`,
      code: body.code ?? original.code,
      language: body.language ?? original.language,
      theme: body.theme ?? original.theme,
      ownerToken: ownerTokenHash,
      passwordHash: null,
      burnAfterReading: false,
      expiresAt: null,
    },
  })

  return NextResponse.json(
    {
      message: 'Snippet forked',
      snippet: { ...forked, ownerToken: undefined, passwordHash: undefined },
      ownerToken,
      url: `${request.nextUrl.origin}/${forked.slug}`,
    },
    { status: 201 }
  )
}
