import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TEST API ROUTE ===');
    
    // Check environment variables
    const mongoUri = process.env.MONGODB_URI;
    console.log('MONGODB_URI exists:', !!mongoUri);
    console.log('MONGODB_URI starts with mongodb:', mongoUri?.startsWith('mongodb'));
    console.log('Node environment:', process.env.NODE_ENV);
    
    // Test database connection
    console.log('Attempting to connect to database...');
    const connection = await connectDB();
    console.log('Database connection successful');
    console.log('Connection state:', connection.readyState);
    console.log('Database name:', connection.name);
    
    return NextResponse.json({
      status: 'success',
      message: 'API route working',
      environment: process.env.NODE_ENV,
      mongoConnected: connection.readyState === 1,
      databaseName: connection.name,
      mongoUriExists: !!mongoUri,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test route error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      mongoUriExists: !!process.env.MONGODB_URI,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}