import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CodeSnippet, { ICodeSnippet } from '@/lib/models/CodeSnippet';

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

    // Get specific snippet by ID
    if (id) {
      const snippet = await CodeSnippet.findById(id);
      if (!snippet) {
        return NextResponse.json(
          { error: 'Code snippet not found' },
          { status: 404 }
        );
      }
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

    // Get paginated snippets
    const skip = (page - 1) * limit;
    const snippets = await CodeSnippet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CodeSnippet.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

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
    console.error('Error fetching code snippets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new code snippet
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, code, language, theme } = body;

    // Validation
    if (!title || !code || !language || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields: title, code, language, theme' },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Create new snippet
    const newSnippet = new CodeSnippet({
      title: title.trim(),
      code,
      language,
      theme
    });

    const savedSnippet = await newSnippet.save();

    return NextResponse.json(
      { 
        message: 'Code snippet created successfully',
        snippet: savedSnippet,
        url: `${request.nextUrl.origin}/${savedSnippet.slug}`
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating code snippet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing code snippet
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Snippet ID is required' },
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

    // Build update object
    const updateData: Partial<ICodeSnippet> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (code !== undefined) updateData.code = code;
    if (language !== undefined) updateData.language = language;
    if (theme !== undefined) updateData.theme = theme;

    const updatedSnippet = await CodeSnippet.findByIdAndUpdate(
      id,
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
      url: `${request.nextUrl.origin}/${updatedSnippet.slug}`
    });

  } catch (error) {
    console.error('Error updating code snippet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a code snippet
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    const deletedSnippet = await CodeSnippet.findByIdAndDelete(id);
    
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
    console.error('Error deleting code snippet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}