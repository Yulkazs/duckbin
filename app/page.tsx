"use client";

import { useThemeContext } from "@/components/ThemeProvider";

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useThemeContext();

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => changeTheme(key)}
          className={`
            px-3 py-1 rounded-md border transition-all duration-200
            ${currentTheme === key 
              ? 'border-2 font-semibold' 
              : 'border hover:bg-opacity-10'
            }
          `}
          style={{
            borderColor: theme.primary,
            color: theme.primary,
            backgroundColor: currentTheme === key ? `${theme.primary}20` : 'transparent',
          }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

// Logo component
const ThemeLogo = ({ className = "" }: { className?: string }) => {
  const { theme } = useThemeContext();

  return (
    <img
      src={theme.logo}
      alt="Duckbin Logo"
      className={className}
    />
  );
};

export default function Page() {
  const { currentTheme, theme } = useThemeContext();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: theme.background, color: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          <ThemeLogo className="w-12 h-12" />
          <h1 className="text-4xl font-display">duckbin</h1>
        </div>

        {/* Current Theme Info */}
        <div className="mb-8 p-4 rounded-lg" style={{ border: `1px solid ${theme.primary}` }}>
          <h2 className="text-xl font-semibold mb-2">Current Theme</h2>
          <p className="text-sm opacity-80">
            Theme: <span className="font-code">{currentTheme}</span> | 
            Background: <span className="font-code">{theme.background}</span> | 
            Primary: <span className="font-code">{theme.primary}</span>
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Theme</h2>
          <ThemeSelector />
        </div>

        {/* Sample Content */}
        <div className="space-y-6">
          <div className="p-6 rounded-lg" style={{ border: `1px solid ${theme.primary}` }}>
            <h3 className="text-lg font-semibold mb-2">Sample Content</h3>
            <p className="mb-4">
              This is some sample content to demonstrate how the theme affects the appearance.
              The background and text colors change based on the selected theme.
            </p>
            <button 
              className="px-4 py-2 rounded hover:bg-opacity-10 transition-colors"
              style={{ 
                border: `1px solid ${theme.primary}`,
                color: theme.primary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sample Button
            </button>
          </div>

          <div className="p-6 rounded-lg" style={{ border: `1px solid ${theme.primary}` }}>
            <h3 className="text-lg font-semibold mb-2 font-display">Font Showcase</h3>
            <div className="space-y-2">
              <p className="font-sans">Poppins (Sans): The quick brown fox jumps over the lazy dog</p>
              <p className="font-code">Chivo Mono (Code): const greeting = "Hello, World!";</p>
              <p className="font-display">Krona One (Display): DUCKBIN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}