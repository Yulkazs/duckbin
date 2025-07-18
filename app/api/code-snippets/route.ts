import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CodeSnippet from '@/lib/models/CodeSnippet';

// GET - Retrieve code snippet by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const { slug } = params;

    // Validate slug format
    if (!slug || slug.length !== 7 || !/^[a-zA-Z0-9]{7}$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must be exactly 7 alphanumeric characters.' },
        { status: 400 }
      );
    }

    // Find snippet by slug
    const snippet = await CodeSnippet.findOne({ slug });
    
    if (!snippet) {
      return NextResponse.json(
        { error: 'Code snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      snippet,
      url: `${request.nextUrl.origin}/${slug}`
    });

  } catch (error) {
    console.error('Error fetching code snippet by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update code snippet by slug (optional - if you want to allow updates via slug)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const { slug } = params;

    // Validate slug format
    if (!slug || slug.length !== 7 || !/^[a-zA-Z0-9]{7}$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must be exactly 7 alphanumeric characters.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, code, language, theme } = body;

    // Validation
    if (title && title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Build update object (exclude slug from updates)
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (code !== undefined) updateData.code = code;
    if (language !== undefined) updateData.language = language;
    if (theme !== undefined) updateData.theme = theme;

    const updatedSnippet = await CodeSnippet.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSnippet) {
      return NextResponse.json(
        { error: 'Code snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Code snippet updated successfully',
      snippet: updatedSnippet,
      url: `${request.nextUrl.origin}/${slug}`
    });

  } catch (error) {
    console.error('Error updating code snippet by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete code snippet by slug (optional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const { slug } = params;

    // Validate slug format
    if (!slug || slug.length !== 7 || !/^[a-zA-Z0-9]{7}$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must be exactly 7 alphanumeric characters.' },
        { status: 400 }
      );
    }

    const deletedSnippet = await CodeSnippet.findOneAndDelete({ slug });
    
    if (!deletedSnippet) {
      return NextResponse.json(
        { error: 'Code snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Code snippet deleted successfully',
      snippet: deletedSnippet
    });

  } catch (error) {
    console.error('Error deleting code snippet by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}