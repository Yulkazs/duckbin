// lib/utils/slug.ts
import CodeSnippet from '@/lib/models/CodeSnippet';

/**
 * Generate a random 7-character alphanumeric string
 */
export function generateSlug(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a unique slug by checking against existing slugs in the database
 */
export async function generateUniqueSlug(): Promise<string> {
  let slug: string;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    slug = generateSlug();
    const existing = await CodeSnippet.findOne({ slug });
    if (!existing) {
      return slug;
    }
    attempts++;
  } while (attempts < maxAttempts);
  
  throw new Error('Unable to generate unique slug after maximum attempts');
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9]{7}$/.test(slug);
}