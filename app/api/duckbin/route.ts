// app/api/duckbin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { DuckbinService, generateUniqueSlug } from '@/lib/models/duckbin';
import { getLanguageById } from '@/lib/languages';
import { getTheme } from '@/lib/colors';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, code, language, theme } = body;

    // Validate required fields
    if (!title || !code || !language || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate language exists
    const languageData = getLanguageById(language);
    if (!languageData) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    // Validate theme exists
    const themeData = getTheme(theme);
    if (!themeData) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = await generateUniqueSlug();

    // Create duckbin
    const duckbin = await DuckbinService.create({
      slug,
      title,
      code,
      language,
      theme
    });

    return NextResponse.json({
      slug: duckbin.slug,
      title: duckbin.title,
      code: duckbin.code,
      language: duckbin.language,
      theme: duckbin.theme,
      createdAt: duckbin.createdAt
    });

  } catch (error) {
    console.error('Error creating duckbin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { slug, title, code, language, theme } = body;

    // Validate required fields
    if (!slug || !title || !code || !language || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate language exists
    const languageData = getLanguageById(language);
    if (!languageData) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      );
    }

    // Validate theme exists
    const themeData = getTheme(theme);
    if (!themeData) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    // Update duckbin
    const duckbin = await DuckbinService.updateBySlug(slug, {
      title,
      code,
      language,
      theme
    });

    if (!duckbin) {
      return NextResponse.json(
        { error: 'Duckbin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      slug: duckbin.slug,
      title: duckbin.title,
      code: duckbin.code,
      language: duckbin.language,
      theme: duckbin.theme,
      createdAt: duckbin.createdAt
    });

  } catch (error) {
    console.error('Error updating duckbin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

