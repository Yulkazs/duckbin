// app/api/code-snippets/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CodeSnippet from '@/lib/models/CodeSnippet';

// Helper function to safely parse JSON
async function safeParseJSON(request: NextRequest) {
  try {
    const text = await request.text();
    
    if (!text || text.trim() === '') {
      return { error: 'Request body is empty' };
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return { error: 'Invalid JSON format' };
  }
}

// Helper function to validate slug format
function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9]{7}$/.test(slug);
}

// GET - Retrieve a specific code snippet by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('GET /api/code-snippets/[slug] - Starting request');
    await connectDB();
    
    const { slug } = params;
    console.log('Fetching snippet by slug:', slug);

    if (!slug || !isValidSlug(slug)) {
      console.log('Invalid slug format:', slug);
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must be exactly 7 alphanumeric characters.' },
        { status: 400 }
      );
    }

    const snippet = await CodeSnippet.findOne({ slug });
    
    if (!snippet) {
      console.log('Snippet not found for slug:', slug);
      return NextResponse.json(
        { error: 'Code snippet not found' },
        { status: 404 }
      );
    }

    console.log('Snippet found:', snippet._id);
    return NextResponse.json({ 
      snippet,
      url: `${request.nextUrl.origin}/${snippet.slug}`
    });

  } catch (error) {
    console.error('Error in GET /api/code-snippets/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing code snippet by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('PUT /api/code-snippets/[slug] - Starting request');
    await connectDB();
    
    const { slug } = params;
    console.log('Updating snippet by slug:', slug);

    if (!slug || !isValidSlug(slug)) {
      console.log('Invalid slug format:', slug);
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must be exactly 7 alphanumeric characters.' },
        { status: 400 }
      );
    }

    const body = await safeParseJSON(request);
    
    if (body.error) {
      console.log('Request body parsing error:', body.error);
      return NextResponse.json(
        { error: body.error },
        { status: 400 }
      );
    }

    const { title, code, language, theme } = body;

    // Validation
    if (title && title.length > 100) {
      console.log('Title too long:', title.length);
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

    // Check if there's actually something to update
    if (Object.keys(updateData).length === 0) {
      console.log('No valid fields provided for update');
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }

    console.log('Update data:', updateData);

    const updatedSnippet = await CodeSnippet.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSnippet) {
      console.log('Snippet not found for update:', slug);
      return NextResponse.json(
        { error: 'Code snippet not found' },
        { status: 404 }
      );
    }

    console.log('Snippet updated successfully:', updatedSnippet._id);

    return NextResponse.json({
      message: 'Code snippet updated successfully',
      snippet: updatedSnippet,
      url: `${request.nextUrl.origin}/${updatedSnippet.slug}`
    });

  } catch (error) {
    console.error('Error in PUT /api/code-snippets/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a code snippet by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('DELETE /api/code-snippets/[slug] - Starting request');
    await connectDB();
    
    const { slug } = params;
    console.log('Deleting snippet by slug:', slug);

    if (!slug || !isValidSlug(slug)) {
      console.log('Invalid slug format:', slug);
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must be exactly 7 alphanumeric characters.' },
        { status: 400 }
      );
    }

    const deletedSnippet = await CodeSnippet.findOneAndDelete({ slug });
    
    if (!deletedSnippet) {
      console.log('Snippet not found for deletion:', slug);
      return NextResponse.json(
        { error: 'Code snippet not found' },
        { status: 404 }
      );
    }

    console.log('Snippet deleted successfully:', deletedSnippet._id);

    return NextResponse.json({
      message: 'Code snippet deleted successfully',
      snippet: deletedSnippet
    });

  } catch (error) {
    console.error('Error in DELETE /api/code-snippets/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}