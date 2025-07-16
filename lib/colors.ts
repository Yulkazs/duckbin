// lib/colors.ts

export interface Theme {
  name: string;
  background: string;
  primary: string;
  logo: string;
}

export const themes: Record<string, Theme> = {
  dark: {
    name: "Dark",
    background: "#020202",
    primary: "#FFFFFF",
    logo: "/svg/duckbin.svg"
  },
  midnight: {
    name: "Midnight",
    background: "#020015",
    primary: "#CACBFF",
    logo: "/svg/duckbin-midnight.svg"
  },
  wine: {
    name: "Wine",
    background: "#160000",
    primary: "#FFCACA",
    logo: "/svg/duckbin-wine.svg"
  },
  spruce: {
    name: "Spruce",
    background: "#0D1117",
    primary: "#455B6D",
    logo: "/svg/duckbin-spruce.svg"
  },
  forest: {
    name: "Forest",
    background: "#0B120C",
    primary: "#4B5B49",
    logo: "/svg/duckbin-forest.svg"
  },
  light: {
    name: "Light",
    background: "#F8F8F8",
    primary: "#363C4C",
    logo: "/svg/duckbin-light.svg"
  },
  coffee: {
    name: "Coffee",
    background: "#362217",
    primary: "#FFDCC3",
    logo: "/svg/duckbin-coffee.svg"
  },
  pinky: {
    name: "Pinky",
    background: "#FFDAF6",
    primary: "#FF43D6",
    logo: "/svg/duckbin-pinky.svg"
  },
  greeny: {
    name: "Greeny",
    background: "#E5FFD8",
    primary: "#2A670E",
    logo: "/svg/duckbin-greeny.svg"
  },
  lightShade: {
    name: "Light Shade",
    background: "#D0D0D0",
    primary: "#634C4C",
    logo: "/svg/duckbin-lightShade.svg"
  }
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes.dark;
};

export const getThemeNames = (): string[] => {
  return Object.keys(themes);
};

export const generateThemeCSS = (theme: Theme): string => {
  return `
    :root {
      --background: ${theme.background};
      --primary: ${theme.primary};
    }
  `;
};

export const getThemeClasses = (themeName: string) => {
  const theme = getTheme(themeName);
  return {
    background: theme.background,
    primary: theme.primary,
    backgroundClass: `bg-[${theme.background}]`,
    primaryClass: `text-[${theme.primary}]`,
    borderPrimaryClass: `border-[${theme.primary}]`,
  };
};