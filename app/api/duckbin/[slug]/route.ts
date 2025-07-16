// app/api/duckbin/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { DuckbinService } from '@/lib/models/duckbin';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const duckbin = await DuckbinService.findBySlug(slug);

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
    console.error('Error fetching duckbin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const deleted = await DuckbinService.deleteBySlug(slug);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Duckbin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Duckbin deleted successfully' });

  } catch (error) {
    console.error('Error deleting duckbin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}