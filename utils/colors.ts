// utils/colors.ts
// Refreshed theme palette for duckbin v2

export interface Theme {
  name: string
  background: string
  primary: string
  secondary: string    // muted text, borders
  accent: string       // highlight color for badges/buttons
  surface: string      // slightly lifted background (cards, panels)
  logo: string
}

export const themes: Record<string, Theme> = {
  // ── Dark ──────────────────────────────────────────────────────────────────
  obsidian: {
    name: 'Obsidian',
    background: '#0A0A0F',
    primary: '#E8E8F0',
    secondary: '#52525E',
    accent: '#7C6AF7',
    surface: '#111118',
    logo: '/svg/duckbin.svg',
  },
  // ── Neutral dark — the old "dark" feel, refined ───────────────────────────
  carbon: {
    name: 'Carbon',
    background: '#0D0D0D',
    primary: '#F0EFE9',
    secondary: '#4A4A4A',
    accent: '#E05C2B',
    surface: '#161616',
    logo: '/svg/duckbin.svg',
  },
  // ── Deep midnight blue ─────────────────────────────────────────────────────
  abyss: {
    name: 'Abyss',
    background: '#060912',
    primary: '#C8D8FF',
    secondary: '#2E3D5C',
    accent: '#4F8EF7',
    surface: '#0C1220',
    logo: '/svg/duckbin-midnight.svg',
  },
  // ── Dark forest green ──────────────────────────────────────────────────────
  moss: {
    name: 'Moss',
    background: '#080E09',
    primary: '#C8DCC4',
    secondary: '#2D3E2C',
    accent: '#5BAD6F',
    surface: '#0D160E',
    logo: '/svg/duckbin-forest.svg',
  },
  // ── Dark wine / deep crimson ──────────────────────────────────────────────
  merlot: {
    name: 'Merlot',
    background: '#0E0508',
    primary: '#F5D0D8',
    secondary: '#3D1825',
    accent: '#C1435A',
    surface: '#160B10',
    logo: '/svg/duckbin-wine.svg',
  },
  // ── Warm dark (coffee/amber) ──────────────────────────────────────────────
  ember: {
    name: 'Ember',
    background: '#0F0A06',
    primary: '#F0E0C8',
    secondary: '#3D2D1A',
    accent: '#D4813A',
    surface: '#180F08',
    logo: '/svg/duckbin-coffee.svg',
  },
  // ── Light themes ──────────────────────────────────────────────────────────
  chalk: {
    name: 'Chalk',
    background: '#F5F4F0',
    primary: '#1A1A24',
    secondary: '#9090A0',
    accent: '#5047CC',
    surface: '#ECEAE4',
    logo: '/svg/duckbin-light.svg',
  },
  petal: {
    name: 'Petal',
    background: '#FDF0F8',
    primary: '#2A102A',
    secondary: '#C490B8',
    accent: '#C0369A',
    surface: '#F5E4F0',
    logo: '/svg/duckbin-pinky.svg',
  },
  sage: {
    name: 'Sage',
    background: '#F0F7EE',
    primary: '#152415',
    secondary: '#7AAA72',
    accent: '#3A8A2C',
    surface: '#E4F0E0',
    logo: '/svg/duckbin-greeny.svg',
  },
  slate: {
    name: 'Slate',
    background: '#EDF0F4',
    primary: '#1C2030',
    secondary: '#8898B0',
    accent: '#3460C8',
    surface: '#E2E6ED',
    logo: '/svg/duckbin-lightShade.svg',
  },
}

// Keep a "dark" alias so existing localStorage values still resolve
Object.defineProperty(themes, 'dark', { get: () => themes.obsidian, enumerable: false })
Object.defineProperty(themes, 'midnight', { get: () => themes.abyss, enumerable: false })
Object.defineProperty(themes, 'wine', { get: () => themes.merlot, enumerable: false })
Object.defineProperty(themes, 'forest', { get: () => themes.moss, enumerable: false })
Object.defineProperty(themes, 'coffee', { get: () => themes.ember, enumerable: false })
Object.defineProperty(themes, 'light', { get: () => themes.chalk, enumerable: false })
Object.defineProperty(themes, 'pinky', { get: () => themes.petal, enumerable: false })
Object.defineProperty(themes, 'greeny', { get: () => themes.sage, enumerable: false })
Object.defineProperty(themes, 'lightShade', { get: () => themes.slate, enumerable: false })
Object.defineProperty(themes, 'spruce', { get: () => themes.abyss, enumerable: false })

export function getTheme(name: string): Theme {
  return themes[name] ?? themes.obsidian
}

export function getThemeNames(): string[] {
  return Object.keys(themes)
}
