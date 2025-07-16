// lib/languages.ts

export interface Language {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  category: 'programming' | 'markup' | 'scripting' | 'config' | 'data';
}

export const languages: Language[] = [
  // Programming Languages
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    mimeType: 'text/javascript',
    category: 'programming'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    mimeType: 'text/typescript',
    category: 'programming'
  },
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    mimeType: 'text/x-python',
    category: 'programming'
  },
  {
    id: 'java',
    name: 'Java',
    extension: 'java',
    mimeType: 'text/x-java',
    category: 'programming'
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    mimeType: 'text/x-c++src',
    category: 'programming'
  },
  {
    id: 'c',
    name: 'C',
    extension: 'c',
    mimeType: 'text/x-csrc',
    category: 'programming'
  },
  {
    id: 'csharp',
    name: 'C#',
    extension: 'cs',
    mimeType: 'text/x-csharp',
    category: 'programming'
  },
  {
    id: 'go',
    name: 'Go',
    extension: 'go',
    mimeType: 'text/x-go',
    category: 'programming'
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: 'rs',
    mimeType: 'text/x-rustsrc',
    category: 'programming'
  },
  {
    id: 'php',
    name: 'PHP',
    extension: 'php',
    mimeType: 'text/x-php',
    category: 'programming'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extension: 'rb',
    mimeType: 'text/x-ruby',
    category: 'programming'
  },
  {
    id: 'swift',
    name: 'Swift',
    extension: 'swift',
    mimeType: 'text/x-swift',
    category: 'programming'
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    extension: 'kt',
    mimeType: 'text/x-kotlin',
    category: 'programming'
  },
  {
    id: 'scala',
    name: 'Scala',
    extension: 'scala',
    mimeType: 'text/x-scala',
    category: 'programming'
  },
  {
    id: 'dart',
    name: 'Dart',
    extension: 'dart',
    mimeType: 'text/x-dart',
    category: 'programming'
  },

  // Markup Languages
  {
    id: 'html',
    name: 'HTML',
    extension: 'html',
    mimeType: 'text/html',
    category: 'markup'
  },
  {
    id: 'css',
    name: 'CSS',
    extension: 'css',
    mimeType: 'text/css',
    category: 'markup'
  },
  {
    id: 'scss',
    name: 'SCSS',
    extension: 'scss',
    mimeType: 'text/x-scss',
    category: 'markup'
  },
  {
    id: 'sass',
    name: 'Sass',
    extension: 'sass',
    mimeType: 'text/x-sass',
    category: 'markup'
  },
  {
    id: 'markdown',
    name: 'Markdown',
    extension: 'md',
    mimeType: 'text/markdown',
    category: 'markup'
  },
  {
    id: 'xml',
    name: 'XML',
    extension: 'xml',
    mimeType: 'application/xml',
    category: 'markup'
  },

  // Scripting Languages
  {
    id: 'bash',
    name: 'Bash',
    extension: 'sh',
    mimeType: 'text/x-sh',
    category: 'scripting'
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    extension: 'ps1',
    mimeType: 'text/x-powershell',
    category: 'scripting'
  },
  {
    id: 'batch',
    name: 'Batch',
    extension: 'bat',
    mimeType: 'text/x-bat',
    category: 'scripting'
  },
  {
    id: 'perl',
    name: 'Perl',
    extension: 'pl',
    mimeType: 'text/x-perl',
    category: 'scripting'
  },
  {
    id: 'lua',
    name: 'Lua',
    extension: 'lua',
    mimeType: 'text/x-lua',
    category: 'scripting'
  },

  // Config & Data Languages
  {
    id: 'json',
    name: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    category: 'data'
  },
  {
    id: 'yaml',
    name: 'YAML',
    extension: 'yml',
    mimeType: 'text/yaml',
    category: 'config'
  },
  {
    id: 'toml',
    name: 'TOML',
    extension: 'toml',
    mimeType: 'text/x-toml',
    category: 'config'
  },
  {
    id: 'ini',
    name: 'INI',
    extension: 'ini',
    mimeType: 'text/x-ini',
    category: 'config'
  },
  {
    id: 'dockerfile',
    name: 'Dockerfile',
    extension: 'dockerfile',
    mimeType: 'text/x-dockerfile',
    category: 'config'
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: 'sql',
    mimeType: 'text/x-sql',
    category: 'data'
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    extension: 'graphql',
    mimeType: 'application/graphql',
    category: 'data'
  },

  // Plain Text
  {
    id: 'plaintext',
    name: 'Plain Text',
    extension: 'txt',
    mimeType: 'text/plain',
    category: 'data'
  }
];

export const getLanguageById = (id: string): Language | undefined => {
  return languages.find(lang => lang.id === id);
};

export const getLanguagesByCategory = (category: Language['category']): Language[] => {
  return languages.filter(lang => lang.category === category);
};

export const getLanguageNames = (): string[] => {
  return languages.map(lang => lang.name);
};

export const getLanguageIds = (): string[] => {
  return languages.map(lang => lang.id);
};

export const searchLanguages = (query: string): Language[] => {
  const lowerQuery = query.toLowerCase();
  return languages.filter(lang => 
    lang.name.toLowerCase().includes(lowerQuery) ||
    lang.extension.toLowerCase().includes(lowerQuery)
  );
};

export const getDefaultLanguage = (): Language => {
  return languages.find(lang => lang.id === 'plaintext') || languages[0];
};