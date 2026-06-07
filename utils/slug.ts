// utils/slug.ts

import { prisma } from '@/lib/prisma'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function generateSlug(): string {
  let result = ''
  for (let i = 0; i < 7; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

export async function generateUniqueSlug(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const slug = generateSlug()
    const existing = await prisma.snippet.findUnique({ where: { slug } })
    if (!existing) return slug
  }
  throw new Error('Unable to generate unique slug after 10 attempts')
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9]{7}$/.test(slug)
}
