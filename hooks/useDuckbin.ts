// hooks/useDuckbin.ts
"use client";

import { useState, useEffect } from 'react';
import { Language, getLanguageById, getDefaultLanguage } from '@/lib/languages';
import { getTheme } from '@/lib/colors';

interface DuckbinData {
  slug?: string;
  title: string;
  code: string;
  language: Language;
  theme: string;
  createdAt: Date;
}

interface UseDuckbinReturn {
  data: DuckbinData;
  isLoading: boolean;
  error: string | null;
  updateTitle: (title: string) => void;
  updateCode: (code: string) => void;
  updateLanguage: (language: Language) => void;
  updateTheme: (theme: string) => void;
  save: () => Promise<string | null>; // Returns slug on success
  load: (slug: string) => Promise<boolean>; // Returns success status
}

export const useDuckbin = (initialSlug?: string): UseDuckbinReturn => {
  const [data, setData] = useState<DuckbinData>({
    title: 'Your title',
    code: '',
    language: getDefaultLanguage(),
    theme: 'dark',
    createdAt: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing duckbin on mount if slug is provided
  useEffect(() => {
    if (initialSlug) {
      load(initialSlug);
    }
  }, [initialSlug]);

  const updateTitle = (title: string) => {
    setData(prev => ({ ...prev, title }));
  };

  const updateCode = (code: string) => {
    setData(prev => ({ ...prev, code }));
  };

  const updateLanguage = (language: Language) => {
    setData(prev => ({ ...prev, language }));
  };

  const updateTheme = (theme: string) => {
    setData(prev => ({ ...prev, theme }));
  };

  const save = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/duckbin', {
        method: data.slug ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: data.slug,
          title: data.title,
          code: data.code,
          language: data.language.id,
          theme: data.theme
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save duckbin');
      }

      const result = await response.json();
      
      // Update the data with the returned slug and timestamp
      setData(prev => ({
        ...prev,
        slug: result.slug,
        createdAt: new Date(result.createdAt)
      }));

      return result.slug;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save duckbin';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const load = async (slug: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/duckbin/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Duckbin not found');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load duckbin');
      }

      const result = await response.json();
      
      // Parse the response and update state
      const language = getLanguageById(result.language) || getDefaultLanguage();
      
      setData({
        slug: result.slug,
        title: result.title,
        code: result.code,
        language,
        theme: result.theme,
        createdAt: new Date(result.createdAt)
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load duckbin';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    updateTitle,
    updateCode,
    updateLanguage,
    updateTheme,
    save,
    load
  };
};