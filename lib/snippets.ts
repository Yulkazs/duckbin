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
  private slugUrl = '/api/slug';

  // Use slug endpoint for creating snippets since that's where the POST handler is
  async createSnippet(data: CreateSnippetRequest): Promise<SnippetResponse> {
    const response = await fetch(this.slugUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create snippet');
    }

    return response.json();
  }

  async getSnippetBySlug(slug: string): Promise<SnippetResponse> {
    if (!slug || slug.length !== 7 || !/^[a-zA-Z0-9]{7}$/.test(slug)) {
      throw new Error('Invalid slug format. Slug must be exactly 7 alphanumeric characters.');
    }

    const response = await fetch(`${this.slugUrl}/${slug}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch snippet');
    }

    return response.json();
  }

  async updateSnippetBySlug(slug: string, data: UpdateSnippetRequest): Promise<SnippetResponse> {
    if (!slug || slug.length !== 7 || !/^[a-zA-Z0-9]{7}$/.test(slug)) {
      throw new Error('Invalid slug format. Slug must be exactly 7 alphanumeric characters.');
    }

    const response = await fetch(`${this.slugUrl}/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update snippet');
    }

    return response.json();
  }

  async deleteSnippetBySlug(slug: string): Promise<SnippetResponse> {
    if (!slug || slug.length !== 7 || !/^[a-zA-Z0-9]{7}$/.test(slug)) {
      throw new Error('Invalid slug format. Slug must be exactly 7 alphanumeric characters.');
    }

    const response = await fetch(`${this.slugUrl}/${slug}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete snippet');
    }

    return response.json();
  }

  // Use code-snippets endpoint for listing (GET requests)
  async getSnippets(params: GetSnippetsParams = {}): Promise<SnippetsListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.language) searchParams.set('language', params.language);
    if (params.search) searchParams.set('search', params.search);

    const url = `${this.baseUrl}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch snippets');
    }

    return response.json();
  }

  async getSnippetById(id: string): Promise<SnippetResponse> {
    const response = await fetch(`${this.baseUrl}?id=${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch snippet');
    }

    return response.json();
  }

  async updateSnippet(id: string, data: UpdateSnippetRequest): Promise<SnippetResponse> {
    const response = await fetch(`${this.baseUrl}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update snippet');
    }

    return response.json();
  }

  async deleteSnippet(id: string): Promise<SnippetResponse> {
    const response = await fetch(`${this.baseUrl}?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete snippet');
    }

    return response.json();
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

  // Utility method to validate snippet data before sending
  validateSnippetData(data: CreateSnippetRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title.trim()) {
      errors.push('Title is required');
    } else if (data.title.length > 100) {
      errors.push('Title must be 100 characters or less');
    }

    if (!data.code.trim()) {
      errors.push('Code content is required');
    }

    if (!data.language) {
      errors.push('Language is required');
    }

    if (!data.theme) {
      errors.push('Theme is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const snippetService = new CodeSnippetService();
export const snippets = snippetService;
export default snippetService;