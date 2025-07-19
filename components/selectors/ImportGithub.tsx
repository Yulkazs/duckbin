"use client";

import { useState, useEffect } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { Download, Loader2, Check, X, Folder, File, ChevronRight, ArrowLeft, Github } from 'lucide-react';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  url?: string;
}

interface RepoInfo {
  owner: string;
  repo: string;
  branch: string;
}

interface ImportGithubProps {
  onImport: (content: string, filename: string, language: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

export const ImportGithub: React.FC<ImportGithubProps> = ({
  onImport,
  onClose,
  isVisible
}) => {
  const { theme } = useThemeContext();
  const [step, setStep] = useState<'input' | 'browsing' | 'importing'>('input');
  const [repoUrl, setRepoUrl] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);

  // Reset state when component becomes visible
  useEffect(() => {
    if (isVisible) {
      setStep('input');
      setRepoUrl('');
      setCurrentPath('');
      setFiles([]);
      setBreadcrumbs([]);
      setError(null);
      setRepoInfo(null);
    }
  }, [isVisible]);

  // Parse GitHub URL
  const parseGitHubUrl = (url: string): RepoInfo & { initialPath?: string } => {
    try {
      // Clean up the URL
      let cleanUrl = url.trim();
      
      // Handle different GitHub URL formats
      const patterns = [
        // https://github.com/owner/repo/tree/branch/path
        { regex: /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.*)/, hasPath: true },
        // https://github.com/owner/repo/tree/branch
        { regex: /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/\?#]+)/, hasPath: false },
        // https://github.com/owner/repo
        { regex: /github\.com\/([^\/]+)\/([^\/\?#]+)(?:\.git)?(?:\/)?$/, hasPath: false },
        // Handle .git URLs
        { regex: /github\.com\/([^\/]+)\/([^\/\?#]+)\.git$/, hasPath: false }
      ];

      let match = null;
      let matchedPattern = null;
      
      for (const pattern of patterns) {
        match = cleanUrl.match(pattern.regex);
        if (match) {
          matchedPattern = pattern;
          break;
        }
      }
      
      if (!match) {
        throw new Error('Invalid GitHub repository URL format');
      }

      const owner = match[1];
      let repo = match[2];
      
      // Remove .git suffix if present
      repo = repo.replace(/\.git$/, '');
      
      // Get branch and path
      let branch = match[3] || 'main';
      let initialPath = '';
      
      if (matchedPattern?.hasPath && match[4]) {
        initialPath = match[4];
      }

      return { owner, repo, branch, initialPath };
    } catch (error) {
      throw new Error('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
    }
  };

  // Fetch directory contents (non-recursive, like GitHub)
  const fetchDirectoryContents = async (path: string = ''): Promise<GitHubFile[]> => {
    if (!repoInfo) return [];

    try {
      let apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents`;
      if (path) {
        apiUrl += `/${path}`;
      }
      apiUrl += `?ref=${repoInfo.branch}`;
      
      console.log('Fetching:', apiUrl);
      
      let response = await fetch(apiUrl);
      let currentBranch = repoInfo.branch;
      
      // If 404 and using 'main', try 'master'
      if (!response.ok && response.status === 404 && repoInfo.branch === 'main') {
        console.log('Main branch failed, trying master...');
        const masterUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents${path ? `/${path}` : ''}?ref=master`;
        response = await fetch(masterUrl);
        currentBranch = 'master';
        
        if (response.ok) {
          setRepoInfo(prev => prev ? { ...prev, branch: 'master' } : null);
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        
        if (response.status === 404) {
          throw new Error('Repository not found or is private');
        } else if (response.status === 403) {
          throw new Error('API rate limit exceeded or access forbidden');
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data) {
        throw new Error('No data received from GitHub API');
      }
      
      return processDirectoryData(data, path);
      
    } catch (error) {
      console.error('Error fetching directory:', error);
      throw error;
    }
  };

  // Process directory data
  const processDirectoryData = (data: any, currentPath: string): GitHubFile[] => {
    console.log('Processing data:', data);
    
    if (!data) {
      console.log('No data to process');
      return [];
    }
    
    if (!Array.isArray(data)) {
      // If it's a single file, return it
      console.log('Single file detected');
      return [{
        ...data,
        path: currentPath || data.name
      }];
    }

    if (data.length === 0) {
      console.log('Empty array received');
      return [];
    }

    console.log(`Processing ${data.length} items`);
    
    // Sort: directories first, then files, both alphabetically
    const processed = data
      .filter((item: any) => item && item.name) // Filter out invalid items
      .map((item: any) => ({
        ...item,
        path: currentPath ? `${currentPath}/${item.name}` : item.name
      }))
      .sort((a: GitHubFile, b: GitHubFile) => {
        if (a.type !== b.type) {
          return a.type === 'dir' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
    console.log('Processed items:', processed);
    return processed;
  };

  // Handle repository URL submission
  const handleRepoSubmit = async () => {
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Parsing URL:', repoUrl.trim());
      const parsed = parseGitHubUrl(repoUrl.trim());
      console.log('Parsed:', parsed);
      
      const { initialPath, ...repoData } = parsed;
      setRepoInfo(repoData);
      
      console.log('Fetching repository contents...');
      // Fetch root directory contents
      const rootFiles = await fetchDirectoryContents(initialPath || '');
      console.log('Received files:', rootFiles);
      
      setFiles(rootFiles);
      setCurrentPath(initialPath || '');
      setBreadcrumbs(initialPath ? initialPath.split('/') : []);
      setStep('browsing');
      
    } catch (error) {
      console.error('Error in handleRepoSubmit:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch repository contents');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to folder
  const navigateToFolder = async (folderPath: string) => {
    setLoading(true);
    setError(null);

    try {
      const newFiles = await fetchDirectoryContents(folderPath);
      setFiles(newFiles);
      setCurrentPath(folderPath);
      setBreadcrumbs(folderPath ? folderPath.split('/') : []);
    } catch (error) {
      console.error('Error navigating to folder:', error);
      setError(error instanceof Error ? error.message : 'Failed to load folder contents');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back
  const navigateBack = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const parentPath = pathParts.join('/');
    navigateToFolder(parentPath);
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (index: number) => {
    const newPath = breadcrumbs.slice(0, index + 1).join('/');
    navigateToFolder(newPath);
  };

  // Navigate to root
  const navigateToRoot = () => {
    navigateToFolder('');
  };

  // Detect language from file extension
  const detectLanguageFromFilename = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'mjs': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'pyw': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'h': 'c',
      'hpp': 'cpp',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'r': 'r',
      'R': 'r',
      'sql': 'sql',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'markdown': 'markdown',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'fish': 'shell',
      'dockerfile': 'dockerfile',
      'toml': 'toml',
      'ini': 'ini',
      'cfg': 'ini',
      'conf': 'ini',
    };

    return languageMap[extension] || 'plaintext';
  };

  // Import file
  const handleFileImport = async (file: GitHubFile) => {
    if (!file.download_url) {
      setError('Cannot import this file type');
      return;
    }

    setStep('importing');
    setError(null);

    try {
      const response = await fetch(file.download_url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }

      const content = await response.text();
      const language = detectLanguageFromFilename(file.name);

      onImport(content, file.name, language);
      onClose();
      
    } catch (error) {
      console.error('Error importing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to import file');
      setStep('browsing');
    }
  };

  // Get file icon based on extension
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const iconMap: { [key: string]: string } = {
      'js': '📄',
      'jsx': '⚛️',
      'ts': '📘',
      'tsx': '⚛️',
      'py': '🐍',
      'java': '☕',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'md': '📝',
      'yml': '⚙️',
      'yaml': '⚙️',
      'sh': '🐚',
      'bash': '🐚',
    };

    return iconMap[extension] || '📄';
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: theme.background,
          border: `1px solid ${theme.primary}40`
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: theme.primary + '20' }}
        >
          <div className="flex items-center gap-2">
            <Github size={20} style={{ color: theme.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.primary }}>
              Import from GitHub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:opacity-70"
            style={{ color: theme.primary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 'input' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.primary }}>
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.primary + '40',
                    color: theme.primary,
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleRepoSubmit()}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <X size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded hover:opacity-70"
                  style={{ color: theme.primary }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRepoSubmit}
                  disabled={!repoUrl.trim() || loading}
                  className="px-4 py-2 text-sm rounded font-medium disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.background
                  }}
                >
                  {loading ? 'Loading...' : 'Browse Repository'}
                </button>
              </div>
            </div>
          )}

          {step === 'browsing' && (
            <div className="flex-1 flex flex-col">
              {/* Repository info and breadcrumbs */}
              <div 
                className="p-4 border-b space-y-2"
                style={{ borderColor: theme.primary + '20' }}
              >
                <div className="text-sm" style={{ color: theme.primary, opacity: 0.8 }}>
                  {repoInfo && `${repoInfo.owner}/${repoInfo.repo} (${repoInfo.branch})`}
                </div>
                
                {/* Breadcrumbs */}
                {breadcrumbs.length > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <button
                      onClick={navigateToRoot}
                      className="hover:opacity-70"
                      style={{ color: theme.primary }}
                    >
                      root
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <ChevronRight size={12} style={{ color: theme.primary, opacity: 0.5 }} />
                        <button
                          onClick={() => navigateToBreadcrumb(index)}
                          className="hover:opacity-70"
                          style={{ color: theme.primary }}
                        >
                          {crumb}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Back button */}
                {currentPath && (
                  <button
                    onClick={navigateBack}
                    className="flex items-center gap-1 text-sm hover:opacity-70"
                    style={{ color: theme.primary }}
                  >
                    <ArrowLeft size={12} />
                    Back
                  </button>
                )}
              </div>

              {/* File listing */}
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 size={24} className="animate-spin" style={{ color: theme.primary }} />
                    <span className="ml-2" style={{ color: theme.primary }}>Loading...</span>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <div className="text-red-500 flex items-center justify-center gap-2 mb-2">
                      <X size={20} />
                      <span>Error</span>
                    </div>
                    <p className="text-red-500 text-sm">{error}</p>
                    <button
                      onClick={() => setStep('input')}
                      className="mt-3 px-3 py-1 text-sm rounded"
                      style={{
                        backgroundColor: theme.primary + '20',
                        color: theme.primary
                      }}
                    >
                      Try Different Repository
                    </button>
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: theme.primary, opacity: 0.6 }}>
                    This directory is empty
                  </div>
                ) : (
                  <div className="p-2">
                    {files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => file.type === 'file' ? handleFileImport(file) : navigateToFolder(file.path)}
                        className="w-full flex items-center gap-3 p-3 rounded text-left hover:opacity-70 cursor-pointer"
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.primary + '10';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {file.type === 'dir' ? (
                          <Folder size={18} style={{ color: theme.primary }} />
                        ) : (
                          <div className="flex items-center">
                            <span className="mr-1">{getFileIcon(file.name)}</span>
                            <File size={16} style={{ color: theme.primary, opacity: 0.7 }} />
                          </div>
                        )}
                        <span 
                          style={{ color: theme.primary }}
                          className="font-mono text-sm"
                        >
                          {file.name}
                        </span>
                        {file.type === 'dir' && (
                          <ChevronRight size={16} className="ml-auto" style={{ color: theme.primary, opacity: 0.5 }} />
                        )}
                        {file.type === 'file' && (
                          <span className="text-xs ml-auto" style={{ color: theme.primary, opacity: 0.5 }}>
                            Click to import
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="p-8 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: theme.primary }} />
              <p style={{ color: theme.primary }}>Importing file...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};