"use client";

import { useState, useEffect } from 'react';
import { useThemeContext } from '@/components/ui/ThemeProvider';
import { Download, Loader2, Check, X, Folder, File, ChevronRight, ArrowLeft, Github } from 'lucide-react';
import { 
  SiJavascript, SiTypescript, SiPython, SiCplusplus, SiC, SiGo, SiRust, 
  SiPhp, SiRuby, SiSwift, SiKotlin, SiScala, SiDart, SiHtml5, SiCss3, SiSass, SiMarkdown, 
  SiJson, SiYaml, SiToml, SiDocker, SiMysql, SiGraphql, SiGnubash, SiPerl, SiLua
} from 'react-icons/si';
import { TbBrandCSharp } from "react-icons/tb";
import { FaFileAlt, FaJava } from 'react-icons/fa';
import { VscTerminalPowershell } from 'react-icons/vsc';
import { BsFiletypeExe } from 'react-icons/bs';

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

  const parseGitHubUrl = (url: string): RepoInfo => {
    try {
      let cleanUrl = url.trim();
      
      cleanUrl = cleanUrl.replace(/\/$/, '');
      
      const patterns = [
        /^https?:\/\/github\.com\/([^\/]+)\/([^\/\?\#]+)(?:\.git)?$/,
        /^github\.com\/([^\/]+)\/([^\/\?\#]+)(?:\.git)?$/,
        /^([^\/]+)\/([^\/\?\#]+)$/,
      ];

      let match = null;
      
      for (const pattern of patterns) {
        match = cleanUrl.match(pattern);
        if (match) break;
      }
      
      if (!match) {
        throw new Error('Invalid GitHub repository URL format');
      }

      const owner = match[1];
      let repo = match[2];
      
      repo = repo.replace(/\.git$/, '');
      
      const branch = 'main';

      return { owner, repo, branch };
    } catch (error) {
      throw new Error('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
    }
  };

  const detectDefaultBranch = async (owner: string, repo: string): Promise<string> => {
    try {
      // First, try to get repository info to find default branch
      const repoApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      console.log('Fetching repo info from:', repoApiUrl);
      
      const response = await fetch(repoApiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Import-Tool'
        }
      });
      
      if (response.ok) {
        const repoData = await response.json();
        console.log('Repo data received:', { default_branch: repoData.default_branch });
        return repoData.default_branch || 'main';
      }
      
      console.log('Repo API failed, trying branch detection...');
      
      const branches = ['main', 'master'];
      for (const branch of branches) {
        const testUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;
        console.log('Testing branch:', branch, 'with URL:', testUrl);
        
        const testResponse = await fetch(testUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-Import-Tool'
          }
        });
        
        console.log('Branch test response:', testResponse.status, testResponse.ok);
        
        if (testResponse.ok) {
          console.log('Found working branch:', branch);
          return branch;
        }
      }
      
      return 'main';
    } catch (error) {
      console.error('Error detecting default branch:', error);
      return 'main';
    }
  };

  const fetchDirectoryContents = async (path: string = ''): Promise<GitHubFile[]> => {
    if (!repoInfo) return [];

    try {
      let apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents`;
      if (path) {
        apiUrl += `/${path}`;
      }
      apiUrl += `?ref=${repoInfo.branch}`;
      
      console.log('Fetching directory contents from:', apiUrl);
      console.log('Current repo info:', repoInfo);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Import-Tool'
        }
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('API Error details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 404) {
          throw new Error(`Repository or path not found. Please verify:\n- Repository exists and is public\n- Branch "${repoInfo.branch}" exists\n- Path "${path || 'root'}" exists`);
        } else if (response.status === 403) {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const remaining = response.headers.get('X-RateLimit-Remaining');
          throw new Error(`GitHub API rate limit exceeded${remaining ? ` (${remaining} requests remaining)` : ''}${resetTime ? `. Resets at ${new Date(parseInt(resetTime) * 1000).toLocaleTimeString()}` : ''}`);
        } else {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Raw API response:', {
        type: typeof data,
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : 'N/A',
        sample: Array.isArray(data) ? data.slice(0, 3) : data
      });
      
      if (!data) {
        console.warn('No data received from GitHub API');
        return [];
      }
      
      const processedFiles = processDirectoryData(data, path);
      console.log('Processed files:', processedFiles);
      
      return processedFiles;
      
    } catch (error) {
      console.error('Error in fetchDirectoryContents:', error);
      throw error;
    }
  };

  const processDirectoryData = (data: any, currentPath: string): GitHubFile[] => {
    console.log('Processing directory data:', {
      data,
      currentPath,
      dataType: typeof data,
      isArray: Array.isArray(data)
    });
    
    if (!data) {
      console.log('No data to process');
      return [];
    }
    
    if (!Array.isArray(data)) {
      console.log('Single file response detected');
      if (data.name && data.type) {
        return [{
          name: data.name,
          path: currentPath || data.name,
          type: data.type === 'file' ? 'file' : 'dir',
          download_url: data.download_url,
          url: data.url
        }];
      }
      return [];
    }

    if (data.length === 0) {
      console.log('Empty directory detected');
      return [];
    }

    const processed = data
      .filter((item: any) => {
        const isValid = item && item.name && item.type;
        if (!isValid) {
          console.warn('Filtering out invalid item:', item);
        }
        return isValid;
      })
      .map((item: any): GitHubFile => ({
        name: item.name,
        path: currentPath ? `${currentPath}/${item.name}` : item.name,
        type: item.type === 'file' ? 'file' : 'dir',
        download_url: item.download_url,
        url: item.url
      }))
      .sort((a: GitHubFile, b: GitHubFile) => {
        if (a.type !== b.type) {
          return a.type === 'dir' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
    console.log('Final processed items:', processed);
    return processed;
  };

  // Handle repository URL submission
  const handleRepoSubmit = async () => {
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('=== Starting repo submission ===');
      console.log('Input URL:', repoUrl.trim());
      
      const parsed = parseGitHubUrl(repoUrl.trim());
      console.log('Parsed repo info:', parsed);
      
      const defaultBranch = await detectDefaultBranch(parsed.owner, parsed.repo);
      console.log('Detected default branch:', defaultBranch);
      
      const finalRepoInfo = { ...parsed, branch: defaultBranch };
      
      console.log('Fetching root directory contents...');
      
      const tempRepoInfo = finalRepoInfo;
      let apiUrl = `https://api.github.com/repos/${tempRepoInfo.owner}/${tempRepoInfo.repo}/contents?ref=${tempRepoInfo.branch}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Import-Tool'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Repository or path not found. Please verify:\n- Repository exists and is public\n- Branch "${tempRepoInfo.branch}" exists`);
        } else if (response.status === 403) {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const remaining = response.headers.get('X-RateLimit-Remaining');
          throw new Error(`GitHub API rate limit exceeded${remaining ? ` (${remaining} requests remaining)` : ''}${resetTime ? `. Resets at ${new Date(parseInt(resetTime) * 1000).toLocaleTimeString()}` : ''}`);
        } else {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      const rootFiles = processDirectoryData(data, '');
      console.log('Root files received:', rootFiles);
      
      setRepoInfo(finalRepoInfo);
      setFiles(rootFiles);
      setCurrentPath('');
      setBreadcrumbs([]);
      setStep('browsing');
      
    } catch (error) {
      console.error('Error in handleRepoSubmit:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch repository contents');
    } finally {
      setLoading(false);
    }
  };

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

  const navigateBack = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const parentPath = pathParts.join('/');
    navigateToFolder(parentPath);
  };

  const navigateToBreadcrumb = (index: number) => {
    const newPath = breadcrumbs.slice(0, index + 1).join('/');
    navigateToFolder(newPath);
  };

  const navigateToRoot = () => {
    navigateToFolder('');
  };

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

  const getLanguageIcon = (filename: string) => {
        const extension = filename.split('.').pop()?.toLowerCase() || '';
        const baseName = filename.toLowerCase();
        
        // Special cases first
        if (baseName === 'dockerfile' || baseName.includes('dockerfile')) {
            return <SiDocker size={14} />;
        }
        
        // Extension-based mapping - store components, not elements
        const iconMap: { [key: string]: React.ComponentType<{ size: number }> } = {
            'js': SiJavascript,
            'jsx': SiJavascript,
            'mjs': SiJavascript,
            'ts': SiTypescript,
            'tsx': SiTypescript,
            'py': SiPython,
            'pyw': SiPython,
            'java': FaJava,
            'c': SiC,
            'cpp': SiCplusplus,
            'cc': SiCplusplus,
            'cxx': SiCplusplus,
            'h': SiC,
            'hpp': SiCplusplus,
            'cs': TbBrandCSharp,
            'php': SiPhp,
            'rb': SiRuby,
            'go': SiGo,
            'rs': SiRust,
            'swift': SiSwift,
            'kt': SiKotlin,
            'scala': SiScala,
            'dart': SiDart,
            'html': SiHtml5,
            'htm': SiHtml5,
            'css': SiCss3,
            'scss': SiSass,
            'sass': SiSass,
            'json': SiJson,
            'yaml': SiYaml,
            'yml': SiYaml,
            'toml': SiToml,
            'md': SiMarkdown,
            'markdown': SiMarkdown,
            'sql': SiMysql,
            'graphql': SiGraphql,
            'sh': SiGnubash,
            'bash': SiGnubash,
            'zsh': SiGnubash,
            'fish': SiGnubash,
            'ps1': VscTerminalPowershell,
            'bat': BsFiletypeExe,
            'pl': SiPerl,
            'lua': SiLua,
            'txt': FaFileAlt
        };
        
        const IconComponent = iconMap[extension];
        if (IconComponent) {
            return <IconComponent size={14} />;
        }
        
        return <File size={18} />;
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
          border: `1px solid ${theme.primary}40`,
          fontFamily: 'var(--font-poppins), sans-serif'
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
              {step === 'browsing' && repoInfo 
                ? `${repoInfo.owner}/${repoInfo.repo} (${repoInfo.branch})`
                : "Import from GitHub"
              }
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
                  placeholder="https://github.com/yulkazs/duckbin"
                  className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.primary + '40',
                    color: theme.primary,
                    fontFamily: 'var(--font-poppins), sans-serif'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleRepoSubmit()}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm flex items-center gap-2 p-3 rounded border border-red-200 bg-red-50">
                  <X size={16} />
                  <div className="whitespace-pre-line">{error}</div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded hover:opacity-70"
                  style={{ 
                    color: theme.primary,
                    fontFamily: 'var(--font-poppins), sans-serif'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRepoSubmit}
                  disabled={!repoUrl.trim() || loading}
                  className="px-4 py-2 text-sm rounded font-medium disabled:opacity-50 flex items-center gap-2"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.background,
                    fontFamily: 'var(--font-poppins), sans-serif'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Browse Repository'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'browsing' && (
            <div className="flex-1 flex flex-col">
              {/* Breadcrumbs and navigation */}
              {breadcrumbs.length > 0 && (
                <div 
                  className="p-4 border-b"
                  style={{ borderColor: theme.primary + '20' }}
                >
                  <div className="flex items-center gap-1 text-sm flex-wrap">
                    <button
                      onClick={navigateToRoot}
                      className="hover:opacity-70 px-1 py-0.5 rounded"
                      style={{ 
                        color: theme.primary,
                        fontFamily: 'var(--font-poppins), sans-serif'
                      }}
                    >
                      root
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <ChevronRight size={12} style={{ color: theme.primary, opacity: 0.5 }} />
                        <button
                          onClick={() => navigateToBreadcrumb(index)}
                          className="hover:opacity-70 px-1 py-0.5 rounded"
                          style={{ 
                            color: theme.primary,
                            fontFamily: 'var(--font-poppins), sans-serif'
                          }}
                        >
                          {crumb}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Back button */}
                  {currentPath && (
                    <button
                      onClick={navigateBack}
                      className="flex items-center gap-1 text-sm hover:opacity-70 px-2 py-1 rounded mt-2"
                      style={{ 
                        color: theme.primary,
                        backgroundColor: theme.primary + '10',
                        fontFamily: 'var(--font-poppins), sans-serif'
                      }}
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>
                  )}
                </div>
              )}

              {/* File listing */}
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 size={24} className="animate-spin" style={{ color: theme.primary }} />
                    <span 
                      className="ml-2" 
                      style={{ 
                        color: theme.primary,
                        fontFamily: 'var(--font-poppins), sans-serif'
                      }}
                    >
                      Loading...
                    </span>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <div className="text-red-500 flex items-center justify-center gap-2 mb-2">
                      <X size={20} />
                      <span>Error</span>
                    </div>
                    <p className="text-red-500 text-sm whitespace-pre-line mb-3">{error}</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => navigateToFolder(currentPath)}
                        disabled={loading}
                        className="px-3 py-1 text-sm rounded mr-2"
                        style={{
                          backgroundColor: theme.primary + '20',
                          color: theme.primary,
                          fontFamily: 'var(--font-poppins), sans-serif'
                        }}
                      >
                        Retry
                      </button>
                      <button
                        onClick={() => setStep('input')}
                        className="px-3 py-1 text-sm rounded"
                        style={{
                          backgroundColor: theme.primary + '10',
                          color: theme.primary,
                          fontFamily: 'var(--font-poppins), sans-serif'
                        }}
                      >
                        Try Different Repository
                      </button>
                    </div>
                  </div>
                ) : files.length === 0 ? (
                  <div 
                    className="p-8 text-center" 
                    style={{ 
                      color: theme.primary, 
                      opacity: 0.6,
                      fontFamily: 'var(--font-poppins), sans-serif'
                    }}
                  >
                    <div className="mb-2">This directory is empty</div>
                    <button
                      onClick={() => setStep('input')}
                      className="text-sm underline hover:no-underline"
                      style={{ 
                        color: theme.primary,
                        fontFamily: 'var(--font-poppins), sans-serif'
                      }}
                    >
                      Try a different repository
                    </button>
                  </div>
                ) : (
                  <div className="p-2">
                    {files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => file.type === 'file' ? handleFileImport(file) : navigateToFolder(file.path)}
                        className="w-full flex items-center gap-3 p-3 rounded text-left hover:opacity-70 cursor-pointer transition-colors"
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
                        <div style={{ color: theme.primary, opacity: file.type === 'dir' ? 0.8 : 0.7 }}>
                          {file.type === 'dir' ? (
                            <Folder size={18} />
                          ) : (
                            getLanguageIcon(file.name)
                          )}
                        </div>
                        <span 
                          style={{ 
                            color: theme.primary,
                            fontFamily: 'var(--font-poppins), sans-serif'
                          }}
                          className="text-sm flex-1"
                        >
                          {file.name}
                        </span>
                        {file.type === 'dir' && (
                          <ChevronRight size={16} className="ml-auto" style={{ color: theme.primary, opacity: 0.5 }} />
                        )}
                        {file.type === 'file' && (
                          <Download size={14} className="ml-auto opacity-50" style={{ color: theme.primary }} />
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 size={24} className="animate-spin" style={{ color: theme.primary }} />
                <span 
                  className="text-lg" 
                  style={{ 
                    color: theme.primary,
                    fontFamily: 'var(--font-poppins), sans-serif'
                  }}
                >
                  Importing file...
                </span>
              </div>
              <p 
                className="text-sm opacity-70" 
                style={{ 
                  color: theme.primary,
                  fontFamily: 'var(--font-poppins), sans-serif'
                }}
              >
                Please wait while we download and process the file
              </p>
            </div>
          )}
        </div>

        {/* Footer - Only show when browsing and not loading */}
        {step === 'browsing' && !loading && (
          <div 
            className="p-4 border-t text-center"
            style={{ borderColor: theme.primary + '20' }}
          >
            <p 
              className="text-xs opacity-60" 
              style={{ 
                color: theme.primary,
                fontFamily: 'var(--font-poppins), sans-serif'
              }}
            >
              Click on a file to import it into the editor
            </p>
          </div>
        )}
      </div>
    </div>
  );
};