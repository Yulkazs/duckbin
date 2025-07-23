// app/api/code-snippets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CodeSnippet from '@/lib/models/CodeSnippet';
import { generateUniqueSlug } from '@/utils/slug';

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

// GET - Retrieve all code snippets or a specific one by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const language = searchParams.get('language');
    const search = searchParams.get('search');

    console.log('Query params:', { id, limit, page, language, search });

    // Get specific snippet by ID
    if (id) {
      console.log('Fetching snippet by ID:', id);
      const snippet = await CodeSnippet.findById(id);
      if (!snippet) {
        console.log('Snippet not found for ID:', id);
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
    }

    // Build query filters
    const query: any = {};
    if (language) query.language = language;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Database query:', query);

    // Get paginated snippets
    const skip = (page - 1) * limit;
    const snippets = await CodeSnippet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CodeSnippet.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    console.log(`Found ${snippets.length} snippets out of ${total} total`);

    return NextResponse.json({
      snippets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error in GET /api/code-snippets:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create a new code snippet
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Parse request body
    console.log('Parsing request body...');
    const body = await safeParseJSON(request);
    
    if (body.error) {
      console.log('Request body parsing error:', body.error);
      return NextResponse.json(
        { error: body.error },
        { status: 400 }
      );
    }

    console.log('Request body parsed successfully:', {
      title: body.title?.substring(0, 50) + '...',
      codeLength: body.code?.length,
      language: body.language,
      theme: body.theme
    });

    const { title, code, language, theme } = body;

    // Validation
    if (!title || !code || !language || !theme) {
      const missing = [];
      if (!title) missing.push('title');
      if (!code) missing.push('code');
      if (!language) missing.push('language');
      if (!theme) missing.push('theme');
      
      console.log('Missing required fields:', missing);
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      console.log('Title too long:', title.length);
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug();

    const snippetData = {
      title: title.trim(),
      code,
      language,
      theme,
      slug
    };

    const newSnippet = new CodeSnippet(snippetData);
    
    const savedSnippet = await newSnippet.save();

    const response = {
      message: 'Code snippet created successfully',
      snippet: savedSnippet,
      url: `${request.nextUrl.origin}/${savedSnippet.slug}`
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/code-snippets:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return more specific error information in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: isDevelopment && error instanceof Error ? error.message : undefined,
        stack: isDevelopment && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update an existing code snippet by ID
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log('Missing snippet ID in PUT request');
      return NextResponse.json(
        { error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    console.log('Updating snippet with ID:', id);

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

    const updatedSnippet = await CodeSnippet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSnippet) {
      console.log('Snippet not found for update:', id);
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
    console.error('Error in PUT /api/code-snippets:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a code snippet by ID
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log('Missing snippet ID in DELETE request');
      return NextResponse.json(
        { error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting snippet with ID:', id);

    const deletedSnippet = await CodeSnippet.findByIdAndDelete(id);
    
    if (!deletedSnippet) {
      console.log('Snippet not found for deletion:', id);
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
    console.error('Error in DELETE /api/code-snippets:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}