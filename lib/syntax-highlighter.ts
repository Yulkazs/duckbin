// lib/syntax-highlighter.ts

import { Language } from './languages';

// Prism.js language mapping
const PRISM_LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  dart: 'dart',
  html: 'markup',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  markdown: 'markdown',
  xml: 'markup',
  bash: 'bash',
  powershell: 'powershell',
  batch: 'batch',
  perl: 'perl',
  lua: 'lua',
  json: 'json',
  yaml: 'yaml',
  toml: 'toml',
  ini: 'ini',
  dockerfile: 'docker',
  sql: 'sql',
  graphql: 'graphql',
  plaintext: 'none'
};

// Language-specific color themes using Tailwind classes
const SYNTAX_COLORS = {
  keyword: 'text-purple-400',
  string: 'text-green-400',
  comment: 'text-gray-500',
  number: 'text-blue-400',
  operator: 'text-yellow-400',
  punctuation: 'text-gray-300',
  function: 'text-blue-300',
  variable: 'text-red-300',
  property: 'text-cyan-300',
  class: 'text-yellow-300',
  tag: 'text-red-400',
  attribute: 'text-cyan-400',
  value: 'text-green-400',
  default: 'text-gray-200'
};

export class SyntaxHighlighter {
  private static prismLoaded = false;
  private static loadingPromise: Promise<void> | null = null;

  /**
   * Load Prism.js dynamically
   */
  static async loadPrism(): Promise<void> {
    if (this.prismLoaded) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadPrismCore();
    await this.loadingPromise;
  }

  private static async loadPrismCore(): Promise<void> {
    try {
      // Load Prism core
      const Prism = (await import('prismjs')).default;
      
      // Manually configure Prism for client-side use
      if (typeof window !== 'undefined') {
        (window as any).Prism = Prism;
      }
      
      // Load common languages with error handling
      const languageComponents = [
        'prismjs/components/prism-javascript',
        'prismjs/components/prism-typescript',
        'prismjs/components/prism-python',
        'prismjs/components/prism-java',
        'prismjs/components/prism-cpp',
        'prismjs/components/prism-c',
        'prismjs/components/prism-csharp',
        'prismjs/components/prism-go',
        'prismjs/components/prism-rust',
        'prismjs/components/prism-php',
        'prismjs/components/prism-ruby',
        'prismjs/components/prism-swift',
        'prismjs/components/prism-kotlin',
        'prismjs/components/prism-scala',
        'prismjs/components/prism-dart',
        'prismjs/components/prism-css',
        'prismjs/components/prism-scss',
        'prismjs/components/prism-sass',
        'prismjs/components/prism-markdown',
        'prismjs/components/prism-bash',
        'prismjs/components/prism-powershell',
        'prismjs/components/prism-batch',
        'prismjs/components/prism-perl',
        'prismjs/components/prism-lua',
        'prismjs/components/prism-json',
        'prismjs/components/prism-yaml',
        'prismjs/components/prism-toml',
        'prismjs/components/prism-docker',
        'prismjs/components/prism-sql',
        'prismjs/components/prism-graphql'
      ];

      // Load languages with individual error handling
      await Promise.allSettled(
        languageComponents.map(async (component) => {
          try {
            await import(component);
          } catch (error) {
            console.warn(`Failed to load Prism component: ${component}`, error);
          }
        })
      );

      this.prismLoaded = true;
    } catch (error) {
      console.error('Failed to load Prism.js:', error);
      throw error;
    }
  }

  /**
   * Get the Prism language identifier for a given language
   */
  static getPrismLanguage(language: Language): string {
    return PRISM_LANGUAGE_MAP[language.id] || 'none';
  }

  /**
   * Highlight code using Prism.js
   */
  static async highlightCode(code: string, language: Language): Promise<string> {
    if (!code.trim()) return code;

    try {
      await this.loadPrism();
      
      const prismLanguage = this.getPrismLanguage(language);
      
      if (prismLanguage === 'none') {
        return this.escapeHtml(code);
      }

      // Get Prism instance
      const Prism = (await import('prismjs')).default;
      
      if (!Prism.languages[prismLanguage]) {
        console.warn(`Prism language "${prismLanguage}" not found, falling back to plain text`);
        return this.escapeHtml(code);
      }

      // Tokenize and highlight
      const tokens = Prism.tokenize(code, Prism.languages[prismLanguage]);
      return this.renderTokens(tokens);
      
    } catch (error) {
      console.error('Syntax highlighting failed:', error);
      return this.escapeHtml(code);
    }
  }

  /**
   * Render tokens with Tailwind classes
   */
  private static renderTokens(tokens: any[]): string {
    return tokens.map(token => {
      if (typeof token === 'string') {
        return this.escapeHtml(token);
      }

      const type = token.type || 'default';
      const content = Array.isArray(token.content) 
        ? this.renderTokens(token.content)
        : this.escapeHtml(token.content);

      const colorClass = this.getColorClass(type);
      return `<span class="${colorClass}">${content}</span>`;
    }).join('');
  }

  /**
   * Get Tailwind color class for token type
   */
  private static getColorClass(type: string): string {
    // Handle nested token types (e.g., 'keyword.control')
    const baseType = type.split('.')[0];
    
    return SYNTAX_COLORS[baseType as keyof typeof SYNTAX_COLORS] || 
           SYNTAX_COLORS.default;
  }

  /**
   * Escape HTML entities
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get theme CSS classes for the editor container
   */
  static getThemeClasses(): string {
    return [
      'bg-gray-900',
      'text-gray-200',
      'font-mono',
      'text-sm',
      'leading-relaxed'
    ].join(' ');
  }

  /**
   * Simple line-by-line highlighting for better performance
   */
  static async highlightLines(lines: string[], language: Language): Promise<string[]> {
    if (!lines.length) return [];

    try {
      await this.loadPrism();
      
      const prismLanguage = this.getPrismLanguage(language);
      
      if (prismLanguage === 'none') {
        return lines.map(line => this.escapeHtml(line));
      }

      const Prism = (await import('prismjs')).default;
      
      if (!Prism.languages[prismLanguage]) {
        return lines.map(line => this.escapeHtml(line));
      }

      return lines.map(line => {
        if (!line.trim()) return line;
        
        try {
          const tokens = Prism.tokenize(line, Prism.languages[prismLanguage]);
          return this.renderTokens(tokens);
        } catch (error) {
          console.error('Line highlighting failed:', error);
          return this.escapeHtml(line);
        }
      });
      
    } catch (error) {
      console.error('Lines highlighting failed:', error);
      return lines.map(line => this.escapeHtml(line));
    }
  }

  /**
   * Check if a language is supported
   */
  static isLanguageSupported(language: Language): boolean {
    const prismLanguage = this.getPrismLanguage(language);
    return prismLanguage !== 'none';
  }

  /**
   * Get all supported languages
   */
  static getSupportedLanguages(): string[] {
    return Object.keys(PRISM_LANGUAGE_MAP).filter(
      key => PRISM_LANGUAGE_MAP[key] !== 'none'
    );
  }
}