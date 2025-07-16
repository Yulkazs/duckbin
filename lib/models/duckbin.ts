// lib/models/duckbin.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDuckbin extends Document {
  slug: string;
  title: string;
  code: string;
  language: string;
  theme: string;
  createdAt: Date;
}

export interface CreateDuckbinData {
  slug: string;
  title: string;
  code: string;
  language: string;
  theme: string;
}

// Define static methods interface
interface IDuckbinModel extends Model<IDuckbin> {
  findBySlug(slug: string): Promise<IDuckbin | null>;
  slugExists(slug: string): Promise<boolean>;
}

const DuckbinSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    length: 7,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
DuckbinSchema.index({ slug: 1 });
DuckbinSchema.index({ createdAt: -1 });

// Static methods
DuckbinSchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug });
};

DuckbinSchema.statics.slugExists = function(slug: string) {
  return this.exists({ slug });
};

// Instance methods
DuckbinSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Export the model with proper typing
const Duckbin = (mongoose.models.Duckbin || mongoose.model<IDuckbin, IDuckbinModel>('Duckbin', DuckbinSchema)) as IDuckbinModel;
export default Duckbin;

// Utility functions
export function generateSlug(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateUniqueSlug(): Promise<string> {
  let slug: string;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    slug = generateSlug();
    attempts++;
    
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate unique slug after multiple attempts');
    }
  } while (await Duckbin.slugExists(slug));
  
  return slug;
}

// Service class for database operations
export class DuckbinService {
  static async create(data: CreateDuckbinData): Promise<IDuckbin> {
    const duckbin = new Duckbin(data);
    return await duckbin.save();
  }

  static async findBySlug(slug: string): Promise<IDuckbin | null> {
    return await Duckbin.findBySlug(slug);
  }

  static async findById(id: string): Promise<IDuckbin | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Duckbin.findById(id);
  }

  static async updateBySlug(slug: string, data: Partial<CreateDuckbinData>): Promise<IDuckbin | null> {
    return await Duckbin.findOneAndUpdate(
      { slug },
      data,
      { new: true, runValidators: true }
    );
  }

  static async deleteBySlug(slug: string): Promise<boolean> {
    const result = await Duckbin.deleteOne({ slug });
    return result.deletedCount === 1;
  }

  static async exists(slug: string): Promise<boolean> {
    return !!(await Duckbin.slugExists(slug));
  }

  static async getRecent(limit: number = 10): Promise<IDuckbin[]> {
    return await Duckbin.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-code'); // Exclude code content for listing
  }
}