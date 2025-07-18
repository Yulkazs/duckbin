import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICodeSnippet extends Document {
  title: string;
  code: string;
  language: string;
  theme: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CodeSnippetSchema: Schema<ICodeSnippet> = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    default: 'Untitled Snippet'
  },
  code: {
    type: String,
    required: true,
    default: ''
  },
  language: {
    type: String,
    required: true,
    default: 'plaintext',
    trim: true
  },
  theme: {
    type: String,
    required: true,
    default: 'default',
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    length: 7,
    match: [/^[a-zA-Z0-9]{7}$/, 'Slug must be exactly 7 alphanumeric characters']
  }
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt
  collection: 'code_snippets'
});

// Generate unique slug function
const generateSlug = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let slug: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    slug = '';
    for (let i = 0; i < 7; i++) {
      slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    attempts++;
    
    // Check if slug already exists
    const existing = await mongoose.models.CodeSnippet?.findOne({ slug });
    if (!existing) break;
    
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique slug after maximum attempts');
    }
  } while (true);

  return slug;
};

// Pre-save middleware to generate slug
CodeSnippetSchema.pre('save', async function(next) {
  if (this.isNew && !this.slug) {
    try {
      this.slug = await generateSlug();
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Create indexes for better query performance
CodeSnippetSchema.index({ createdAt: -1 });
CodeSnippetSchema.index({ title: 1 });
CodeSnippetSchema.index({ language: 1 });
CodeSnippetSchema.index({ slug: 1 }, { unique: true });

// Prevent re-compilation during development
const CodeSnippet: Model<ICodeSnippet> = mongoose.models.CodeSnippet || mongoose.model<ICodeSnippet>('CodeSnippet', CodeSnippetSchema);

export default CodeSnippet;