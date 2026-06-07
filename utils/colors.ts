// utils/colors.ts

export interface Theme {
  name: string
  background: string
  primary: string
  secondary: string
  accent: string
  surface: string
  surfaceSecondary: string
  gradientEnabled: string
  gradientDisabled: string
  logo: string
}

export const themes: Record<string, Theme> = {

  // ── Dark ──────────────────────────────────────────────────────────────────
  dark: {
    name: 'Dark',
    background: '#050505',
    primary: '#FFFFFF',
    secondary: '#848489',
    accent: '#56F337',
    surface: '#434343',
    surfaceSecondary: '#848489',
    gradientEnabled: 'linear-gradient(to right, #56F337, #434343)',
    gradientDisabled: 'linear-gradient(to right, #434343, #D9D9D9)',
    logo: '/icons/duck-dark.svg',
  },

  // ── Light ─────────────────────────────────────────────────────────────────
  light: {
    name: 'Light',
    background: '#FFFFFF',
    primary: '#050505',
    secondary: '#6B6B6B',
    accent: '#050505',
    surface: '#F0F0F0',
    surfaceSecondary: '#D9D9D9',
    gradientEnabled: 'linear-gradient(to right, #050505, #6B6B6B)',
    gradientDisabled: 'linear-gradient(to right, #D9D9D9, #F0F0F0)',
    logo: '/icons/duck-light.svg',
  },

  // ── Coffee ────────────────────────────────────────────────────────────────
  coffee: {
    name: 'Coffee',
    background: '#38220F',
    primary: '#967259',
    secondary: '#6B4F38',
    accent: '#D4813A',
    surface: '#4E3020',
    surfaceSecondary: '#6B4F38',
    gradientEnabled: 'linear-gradient(to right, #D4813A, #4E3020)',
    gradientDisabled: 'linear-gradient(to right, #4E3020, #967259)',
    logo: '/icons/duck-coffee.svg',
  },

  // ── Wine ──────────────────────────────────────────────────────────────────
  wine: {
    name: 'Wine',
    background: '#3F0112',
    primary: '#9A0000',
    secondary: '#6B0020',
    accent: '#C1435A',
    surface: '#5A0120',
    surfaceSecondary: '#6B0020',
    gradientEnabled: 'linear-gradient(to right, #C1435A, #5A0120)',
    gradientDisabled: 'linear-gradient(to right, #5A0120, #9A0000)',
    logo: '/icons/duck-wine.svg',
  },

  // ── Pink ──────────────────────────────────────────────────────────────────
  pink: {
    name: 'Pink',
    background: '#F9CEE7',
    primary: '#E68BBE',
    secondary: '#C490B8',
    accent: '#C0369A',
    surface: '#F0B8D8',
    surfaceSecondary: '#C490B8',
    gradientEnabled: 'linear-gradient(to right, #C0369A, #F0B8D8)',
    gradientDisabled: 'linear-gradient(to right, #F0B8D8, #E68BBE)',
    logo: '/icons/duck-pink.svg',
  },

  // ── Forest ────────────────────────────────────────────────────────────────
  forest: {
    name: 'Forest',
    background: '#22311D',
    primary: '#4A6741',
    secondary: '#3A5232',
    accent: '#5BAD6F',
    surface: '#2E4228',
    surfaceSecondary: '#3A5232',
    gradientEnabled: 'linear-gradient(to right, #5BAD6F, #2E4228)',
    gradientDisabled: 'linear-gradient(to right, #2E4228, #4A6741)',
    logo: '/icons/duck-forest.svg',
  },

  // ── Honey ─────────────────────────────────────────────────────────────────
  honey: {
    name: 'Honey',
    background: '#DF6206',
    primary: '#F6C25C',
    secondary: '#C8832A',
    accent: '#F6C25C',
    surface: '#C85A05',
    surfaceSecondary: '#C8832A',
    gradientEnabled: 'linear-gradient(to right, #F6C25C, #C85A05)',
    gradientDisabled: 'linear-gradient(to right, #C85A05, #F6C25C)',
    logo: '/icons/duck-honey.svg',
  },

}

// Legacy aliases — old localStorage values fall back gracefully
Object.defineProperty(themes, 'obsidian',   { get: () => themes.dark,   enumerable: false })
Object.defineProperty(themes, 'carbon',     { get: () => themes.dark,   enumerable: false })
Object.defineProperty(themes, 'abyss',      { get: () => themes.dark,   enumerable: false })
Object.defineProperty(themes, 'midnight',   { get: () => themes.dark,   enumerable: false })
Object.defineProperty(themes, 'merlot',     { get: () => themes.wine,   enumerable: false })
Object.defineProperty(themes, 'ember',      { get: () => themes.coffee, enumerable: false })
Object.defineProperty(themes, 'chalk',      { get: () => themes.light,  enumerable: false })
Object.defineProperty(themes, 'petal',      { get: () => themes.pink,   enumerable: false })
Object.defineProperty(themes, 'pinky',      { get: () => themes.pink,   enumerable: false })
Object.defineProperty(themes, 'moss',       { get: () => themes.forest, enumerable: false })
Object.defineProperty(themes, 'sage',       { get: () => themes.forest, enumerable: false })
Object.defineProperty(themes, 'greeny',     { get: () => themes.forest, enumerable: false })
Object.defineProperty(themes, 'slate',      { get: () => themes.light,  enumerable: false })
Object.defineProperty(themes, 'lightShade', { get: () => themes.light,  enumerable: false })
Object.defineProperty(themes, 'spruce',     { get: () => themes.dark,   enumerable: false })

export function getTheme(name: string): Theme {
  return themes[name] ?? themes.dark
}

export function getThemeNames(): string[] {
  return Object.keys(themes)
}