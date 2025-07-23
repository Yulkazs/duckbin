// lib/snippets.ts
export interface CodeSnippetData {
  _id?: string;
  title: string;
  code: string;
  language: string;
  theme: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSnippetRequest {
  title: string;
  code: string;
  language: string;
  theme: string;
}

export interface UpdateSnippetRequest extends Partial<CreateSnippetRequest> {}

export interface SnippetResponse {
  snippet: CodeSnippetData;
  message?: string;
  url?: string;
}

export interface SnippetsListResponse {
  snippets: CodeSnippetData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetSnippetsParams {
  page?: number;
  limit?: number;
  language?: string;
  search?: string;
}

class CodeSnippetService {
  private baseUrl = '/api/code-snippets';

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  }

  // Create a new snippet (also used for forking)
  async createSnippet(data: CreateSnippetRequest): Promise<SnippetResponse> {
    console.log('Creating snippet with data:', {
      title: data.title.substring(0, 50) + (data.title.length > 50 ? '...' : ''),
      codeLength: data.code.length,
      language: data.language,
      theme: data.theme
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<SnippetResponse>(response);
      
      // Ensure URL is properly formatted
      if (result.snippet && !result.url) {
        result.url = this.getSnippetUrl(result.snippet.slug);
      }
      
      return result;
    } catch (error) {
      console.error('Error creating snippet:', error);
      throw error;
    }
  }

  // Fork an existing snippet (create new one based on existing)
  async forkSnippet(originalSlug: string, data: CreateSnippetRequest): Promise<SnippetResponse> {
    console.log('Forking snippet from:', originalSlug);
    
    // Add a note to the title if it doesn't already indicate it's a fork
    const forkTitle = data.title.includes('(fork)') ? data.title : `${data.title} (fork)`;
    
    return this.createSnippet({
      ...data,
      title: forkTitle
    });
  }

  // Get snippet by slug
  async getSnippetBySlug(slug: string): Promise<SnippetResponse> {
    if (!this.isValidSlug(slug)) {
      throw new Error('Invalid slug format. Slug must be exactly 7 alphanumeric characters.');
    }

    console.log('Fetching snippet by slug:', slug);

    try {
      const response = await fetch(`${this.baseUrl}/${slug}`);
      const result = await this.handleResponse<SnippetResponse>(response);
      
      // Ensure URL is properly formatted
      if (result.snippet && !result.url) {
        result.url = this.getSnippetUrl(result.snippet.slug);
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching snippet by slug:', error);
      throw error;
    }
  }

  // Update snippet by slug (this should rarely be used, prefer forking)
  async updateSnippetBySlug(slug: string, data: UpdateSnippetRequest): Promise<SnippetResponse> {
    if (!this.isValidSlug(slug)) {
      throw new Error('Invalid slug format. Slug must be exactly 7 alphanumeric characters.');
    }

    console.log('Updating snippet by slug:', slug, data);

    try {
      const response = await fetch(`${this.baseUrl}/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<SnippetResponse>(response);
      
      // Ensure URL is properly formatted
      if (result.snippet && !result.url) {
        result.url = this.getSnippetUrl(result.snippet.slug);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating snippet by slug:', error);
      throw error;
    }
  }

  // Delete snippet by slug
  async deleteSnippetBySlug(slug: string): Promise<SnippetResponse> {
    if (!this.isValidSlug(slug)) {
      throw new Error('Invalid slug format. Slug must be exactly 7 alphanumeric characters.');
    }

    console.log('Deleting snippet by slug:', slug);

    try {
      const response = await fetch(`${this.baseUrl}/${slug}`, {
        method: 'DELETE',
      });

      return await this.handleResponse<SnippetResponse>(response);
    } catch (error) {
      console.error('Error deleting snippet by slug:', error);
      throw error;
    }
  }

  // Get all snippets with pagination and filtering
  async getSnippets(params: GetSnippetsParams = {}): Promise<SnippetsListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.language) searchParams.set('language', params.language);
    if (params.search) searchParams.set('search', params.search);

    const url = `${this.baseUrl}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    console.log('Fetching snippets:', url);

    try {
      const response = await fetch(url);
      return await this.handleResponse<SnippetsListResponse>(response);
    } catch (error) {
      console.error('Error fetching snippets:', error);
      throw error;
    }
  }

  // Get snippet by ID
  async getSnippetById(id: string): Promise<SnippetResponse> {
    console.log('Fetching snippet by ID:', id);

    try {
      const response = await fetch(`${this.baseUrl}?id=${encodeURIComponent(id)}`);
      const result = await this.handleResponse<SnippetResponse>(response);
      
      // Ensure URL is properly formatted
      if (result.snippet && !result.url) {
        result.url = this.getSnippetUrl(result.snippet.slug);
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching snippet by ID:', error);
      throw error;
    }
  }

  // Update snippet by ID
  async updateSnippet(id: string, data: UpdateSnippetRequest): Promise<SnippetResponse> {
    console.log('Updating snippet by ID:', id, data);

    try {
      const response = await fetch(`${this.baseUrl}?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse<SnippetResponse>(response);
      
      // Ensure URL is properly formatted
      if (result.snippet && !result.url) {
        result.url = this.getSnippetUrl(result.snippet.slug);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating snippet by ID:', error);
      throw error;
    }
  }

  // Delete snippet by ID
  async deleteSnippet(id: string): Promise<SnippetResponse> {
    console.log('Deleting snippet by ID:', id);

    try {
      const response = await fetch(`${this.baseUrl}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      return await this.handleResponse<SnippetResponse>(response);
    } catch (error) {
      console.error('Error deleting snippet by ID:', error);
      throw error;
    }
  }

  // Utility methods
  getSnippetUrl(slug: string): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${slug}`;
    }
    return `/${slug}`;
  }

  isValidSlug(slug: string): boolean {
    return /^[a-zA-Z0-9]{7}$/.test(slug);
  }

  // Check if two snippets are different (for fork detection)
  hasSnippetChanged(original: CodeSnippetData, current: Partial<CodeSnippetData>): boolean {
    return (
      (current.title !== undefined && current.title.trim() !== original.title) ||
      (current.code !== undefined && current.code !== original.code) ||
      (current.language !== undefined && current.language !== original.language) ||
      (current.theme !== undefined && current.theme !== original.theme)
    );
  }

  // Utility method to validate snippet data before sending
  validateSnippetData(data: CreateSnippetRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Title is required');
    } else if (data.title.length > 100) {
      errors.push('Title must be 100 characters or less');
    }

    if (!data.code?.trim()) {
      errors.push('Code content is required');
    }

    if (!data.language?.trim()) {
      errors.push('Language is required');
    }

    if (!data.theme?.trim()) {
      errors.push('Theme is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to format error messages for UI display
  formatError(error: Error): string {
    if (error.message.includes('fetch')) {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    
    if (error.message.includes('JSON')) {
      return 'Server returned invalid response. Please try again.';
    }
    
    if (error.message.includes('not found')) {
      return 'Snippet not found. It may have been deleted or the URL is incorrect.';
    }
    
    return error.message || 'An unexpected error occurred';
  }

  // Helper method to generate a preview of code content
  getCodePreview(code: string, maxLength: number = 100): string {
    if (code.length <= maxLength) {
      return code;
    }
    
    return code.substring(0, maxLength) + '...';
  }

  // Helper method to extract first line as potential title
  extractTitleFromCode(code: string): string {
    const firstLine = code.split('\n')[0].trim();
    
    // Remove common comment prefixes
    const cleanedLine = firstLine
      .replace(/^(\/\/|#|\/\*|\*|<!--|\-\-)/g, '')
      .trim();
    
    if (cleanedLine.length > 0 && cleanedLine.length <= 50) {
      return cleanedLine.charAt(0).toUpperCase() + cleanedLine.slice(1);
    }
    
    return 'Untitled Snippet';
  }
}

// Export singleton instance
export const snippetService = new CodeSnippetService();
export const snippets = snippetService;
export default snippetService;