// app/api/snippets/route.ts
// Replaces app/api/code-snippets/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/utils/slug'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Generate a secure owner token
function generateOwnerToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Hash the owner token for storage (one-way, compared client-side by sending raw)
// We store the raw token hashed so it can be verified on future requests
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, code, language, theme, password, burnAfterReading, expiresIn } = body

    // Validation
    if (!title?.trim() || !code?.trim() || !language?.trim() || !theme?.trim()) {
      const missing = ['title', 'code', 'language', 'theme'].filter(f => !body[f]?.trim())
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    if (title.length > 100) {
      return NextResponse.json({ error: 'Title must be 100 characters or less' }, { status: 400 })
    }

    // Hash password if provided
    let passwordHash: string | null = null
    if (password?.trim()) {
      passwordHash = await bcrypt.hash(password.trim(), 10)
    }

    // Calculate expiry
    let expiresAt: Date | null = null
    if (expiresIn && expiresIn !== 'never') {
      const durations: Record<string, number> = {
        '1h':  1 * 60 * 60 * 1000,
        '1d':  24 * 60 * 60 * 1000,
        '7d':  7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      }
      if (durations[expiresIn]) {
        expiresAt = new Date(Date.now() + durations[expiresIn])
      }
    }

    const slug = await generateUniqueSlug()
    const ownerToken = generateOwnerToken()
    const ownerTokenHash = hashToken(ownerToken)

    const snippet = await prisma.snippet.create({
      data: {
        slug,
        title: title.trim(),
        code,
        language,
        theme,
        ownerToken: ownerTokenHash,
        passwordHash,
        burnAfterReading: Boolean(burnAfterReading),
        expiresAt,
      },
    })

    // Return the raw owner token (only time it's ever sent to client)
    return NextResponse.json(
      {
        message: 'Snippet created successfully',
        snippet: sanitizeSnippet(snippet),
        ownerToken, // raw token — frontend saves this to localStorage
        url: `${request.nextUrl.origin}/${snippet.slug}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/snippets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const language = searchParams.get('language')
    const search = searchParams.get('search')

    const where: any = {
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      burnedAt: null,
    }
    if (language) where.language = language
    if (search) {
      where.AND = [
        { OR: [{ title: { contains: search, mode: 'insensitive' } }] }
      ]
    }

    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, slug: true, title: true, language: true,
          theme: true, createdAt: true, expiresAt: true,
          burnAfterReading: true, viewCount: true,
          passwordHash: true, // boolean presence only
        },
      }),
      prisma.snippet.count({ where }),
    ])

    return NextResponse.json({
      snippets: snippets.map(s => ({ ...s, hasPassword: Boolean(s.passwordHash), passwordHash: undefined })),
      pagination: {
        page, limit, total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('GET /api/snippets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Strip sensitive fields before sending to client
function sanitizeSnippet(snippet: any) {
  const { ownerToken, passwordHash, ...safe } = snippet
  return { ...safe, hasPassword: Boolean(passwordHash) }
}
