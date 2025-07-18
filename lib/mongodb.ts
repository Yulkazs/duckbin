import mongoose from 'mongoose';

// Define the connection interface
interface MongoConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached: MongoConnection = (global as any).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<mongoose.Connection> {

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    // Configure mongoose options
    const opts = {
      bufferCommands: false,
      dbName: 'Snippets',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB - Snippets database');
      return mongoose.connection;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper function to disconnect (useful for testing)
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}

export function getConnectionStatus(): string {
  if (!cached.conn) return 'disconnected';
  
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  return states[cached.conn.readyState as keyof typeof states] || 'unknown';
}

// Export the connection function as default
export default connectDB;