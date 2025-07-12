import { Github, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function () {
  return (
    <header className="flex items-center justify-between py-4 mb-8">
      {/* Logo and Title */}
      <div className="flex items-center gap-6">
        <Image
          src="/logos/duckbin.svg"
          alt="Duckbin Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="font-title text-2xl text-[var(--color-text)]">
          duckbin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-12">
        {/* TypeScript Dropdown */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors">
          <span className="text-[var(--color-text)] font-medium">
            TypeScript
          </span>
          <ChevronDown size={16} className="text-[var(--color-text-muted)]" />
        </div>

        {/* Theme Dropdown */}
        <div className="flex items-center gap-2 cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors">
          <span className="text-[var(--color-text)] font-medium">
            Theme
          </span>
          <ChevronDown size={16} className="text-[var(--color-text-muted)]" />
        </div>

        {/* GitHub Icon */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-text)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          <Github size={24} />
        </a>
      </nav>
    </header>
  );
}