// SyntaxHandler/themeColors.ts

export interface SyntaxThemeColors {
  keyword: string;
  string: string;
  comment: string;
  number: string;
  operator: string;
  function: string;
  variable: string;
  type: string;
  property: string;
  punctuation: string;
  tag: string;
  attribute: string;
  value: string;
  constant: string;
  class: string;
  namespace: string;
  regex: string;
  boolean: string;
  null: string;
  undefined: string;
  escape: string;
  delimiter: string;
  selector: string;
  important: string;
  error: string;
  warning: string;
}

export const syntaxThemes: Record<string, SyntaxThemeColors> = {
  dark: {
    keyword: '#569cd6',      // Blue
    string: '#ce9178',       // Orange
    comment: '#6a9955',      // Green
    number: '#b5cea8',       // Light green
    operator: '#d4d4d4',     // White
    function: '#dcdcaa',     // Yellow
    variable: '#9cdcfe',     // Light blue
    type: '#4ec9b0',         // Cyan
    property: '#92c5f8',     // Light blue
    punctuation: '#d4d4d4',  // White
    tag: '#569cd6',          // Blue
    attribute: '#92c5f8',    // Light blue
    value: '#ce9178',        // Orange
    constant: '#4fc1ff',     // Bright blue
    class: '#4ec9b0',        // Cyan
    namespace: '#4ec9b0',    // Cyan
    regex: '#d16969',        // Red
    boolean: '#569cd6',      // Blue
    null: '#569cd6',         // Blue
    undefined: '#569cd6',    // Blue
    escape: '#d7ba7d',       // Gold
    delimiter: '#d4d4d4',    // White
    selector: '#d7ba7d',     // Gold
    important: '#ff6b6b',    // Red
    error: '#f44747',        // Red
    warning: '#ffcc02'       // Yellow
  },

  midnight: {
    keyword: '#8b9cff',      // Purple-blue
    string: '#ffa07a',       // Light salmon
    comment: '#7fb069',      // Sage green
    number: '#b8e6b8',       // Light mint
    operator: '#cacbff',     // Light purple
    function: '#ffd07a',     // Light orange
    variable: '#a8c8ff',     // Light periwinkle
    type: '#6eb5ff',         // Sky blue
    property: '#b8a9ff',     // Light lavender
    punctuation: '#cacbff',  // Light purple
    tag: '#8b9cff',          // Purple-blue
    attribute: '#b8a9ff',    // Light lavender
    value: '#ffa07a',        // Light salmon
    constant: '#5eb3ff',     // Bright blue
    class: '#6eb5ff',        // Sky blue
    namespace: '#6eb5ff',    // Sky blue
    regex: '#ff9999',        // Light red
    boolean: '#8b9cff',      // Purple-blue
    null: '#8b9cff',         // Purple-blue
    undefined: '#8b9cff',    // Purple-blue
    escape: '#ffd700',       // Gold
    delimiter: '#cacbff',    // Light purple
    selector: '#ffd700',     // Gold
    important: '#ff6b6b',    // Red
    error: '#ff6b6b',        // Red
    warning: '#ffcc02'       // Yellow
  },

  wine: {
    keyword: '#ff9999',      // Light red
    string: '#ffb366',       // Light orange
    comment: '#99cc99',      // Light green
    number: '#b3d9b3',       // Pale green
    operator: '#ffcaca',     // Light pink
    function: '#ffd966',     // Light yellow
    variable: '#ffb3d1',     // Light pink
    type: '#66ccff',         // Light blue
    property: '#ffb3b3',     // Light rose
    punctuation: '#ffcaca',  // Light pink
    tag: '#ff9999',          // Light red
    attribute: '#ffb3b3',    // Light rose
    value: '#ffb366',        // Light orange
    constant: '#4da6ff',     // Bright blue
    class: '#66ccff',        // Light blue
    namespace: '#66ccff',    // Light blue
    regex: '#ff6666',        // Red
    boolean: '#ff9999',      // Light red
    null: '#ff9999',         // Light red
    undefined: '#ff9999',    // Light red
    escape: '#ffd700',       // Gold
    delimiter: '#ffcaca',    // Light pink
    selector: '#ffd700',     // Gold
    important: '#ff4444',    // Red
    error: '#ff4444',        // Red
    warning: '#ffaa00'       // Orange
  },

  spruce: {
    keyword: '#7aa3c0',      // Steel blue
    string: '#b8956d',       // Tan
    comment: '#6b8e6b',      // Forest green
    number: '#9cb89c',       // Sage
    operator: '#455b6d',     // Steel gray
    function: '#a3b8a3',     // Light sage
    variable: '#8db4d1',     // Light steel blue
    type: '#6ba3c0',         // Teal blue
    property: '#9bb3c7',     // Light steel
    punctuation: '#455b6d',  // Steel gray
    tag: '#7aa3c0',          // Steel blue
    attribute: '#9bb3c7',    // Light steel
    value: '#b8956d',        // Tan
    constant: '#5a9fd1',     // Bright steel blue
    class: '#6ba3c0',        // Teal blue
    namespace: '#6ba3c0',    // Teal blue
    regex: '#a67c7c',        // Dusty red
    boolean: '#7aa3c0',      // Steel blue
    null: '#7aa3c0',         // Steel blue
    undefined: '#7aa3c0',    // Steel blue
    escape: '#c7b895',       // Light tan
    delimiter: '#455b6d',    // Steel gray
    selector: '#c7b895',     // Light tan
    important: '#c76d6d',    // Dusty red
    error: '#c76d6d',        // Dusty red
    warning: '#b8956d'       // Tan
  },

  forest: {
    keyword: '#6b8e6b',      // Forest green
    string: '#a3856d',       // Brown
    comment: '#5a7a5a',      // Dark green
    number: '#8db38d',       // Light green
    operator: '#4b5b49',     // Dark olive
    function: '#99b899',     // Light forest green
    variable: '#7ba67b',     // Medium green
    type: '#6ba36b',         // Teal green
    property: '#8db38d',     // Light green
    punctuation: '#4b5b49',  // Dark olive
    tag: '#6b8e6b',          // Forest green
    attribute: '#8db38d',    // Light green
    value: '#a3856d',        // Brown
    constant: '#4d9966',     // Bright green
    class: '#6ba36b',        // Teal green
    namespace: '#6ba36b',    // Teal green
    regex: '#a36d6d',        // Dusty red
    boolean: '#6b8e6b',      // Forest green
    null: '#6b8e6b',         // Forest green
    undefined: '#6b8e6b',    // Forest green
    escape: '#b8a385',       // Light brown
    delimiter: '#4b5b49',    // Dark olive
    selector: '#b8a385',     // Light brown
    important: '#cc6666',    // Red
    error: '#cc6666',        // Red
    warning: '#cc9933'       // Orange
  },

  light: {
    keyword: '#0066cc',      // Blue
    string: '#cc6600',       // Orange
    comment: '#008000',      // Green
    number: '#009900',       // Dark green
    operator: '#363c4c',     // Dark gray
    function: '#cc9900',     // Gold
    variable: '#0080ff',     // Light blue
    type: '#008080',         // Teal
    property: '#0066cc',     // Blue
    punctuation: '#363c4c',  // Dark gray
    tag: '#0066cc',          // Blue
    attribute: '#0066cc',    // Blue
    value: '#cc6600',        // Orange
    constant: '#0066ff',     // Bright blue
    class: '#008080',        // Teal
    namespace: '#008080',    // Teal
    regex: '#cc0000',        // Red
    boolean: '#0066cc',      // Blue
    null: '#0066cc',         // Blue
    undefined: '#0066cc',    // Blue
    escape: '#cc9900',       // Gold
    delimiter: '#363c4c',    // Dark gray
    selector: '#cc9900',     // Gold
    important: '#ff0000',    // Red
    error: '#ff0000',        // Red
    warning: '#ff9900'       // Orange
  },

  coffee: {
    keyword: '#d4af37',      // Gold
    string: '#deb887',       // Burlywood
    comment: '#8fbc8f',      // Dark sea green
    number: '#f0e68c',       // Khaki
    operator: '#ffdcc3',     // Light peach
    function: '#daa520',     // Goldenrod
    variable: '#f5deb3',     // Wheat
    type: '#cd853f',         // Peru
    property: '#d2b48c',     // Tan
    punctuation: '#ffdcc3',  // Light peach
    tag: '#d4af37',          // Gold
    attribute: '#d2b48c',    // Tan
    value: '#deb887',        // Burlywood
    constant: '#b8860b',     // Dark goldenrod
    class: '#cd853f',        // Peru
    namespace: '#cd853f',    // Peru
    regex: '#dc143c',        // Crimson
    boolean: '#d4af37',      // Gold
    null: '#d4af37',         // Gold
    undefined: '#d4af37',    // Gold
    escape: '#ffd700',       // Gold
    delimiter: '#ffdcc3',    // Light peach
    selector: '#ffd700',     // Gold
    important: '#ff4500',    // Orange red
    error: '#ff4500',        // Orange red
    warning: '#ff8c00'       // Dark orange
  },

  pinky: {
    keyword: '#ff43d6',      // Hot pink
    string: '#ff6b9d',       // Light pink
    comment: '#8fbc8f',      // Dark sea green
    number: '#9370db',       // Medium orchid
    operator: '#ff43d6',     // Hot pink
    function: '#ff69b4',     // Hot pink
    variable: '#ff1493',     // Deep pink
    type: '#ba55d3',         // Medium orchid
    property: '#ff69b4',     // Hot pink
    punctuation: '#ff43d6',  // Hot pink
    tag: '#ff43d6',          // Hot pink
    attribute: '#ff69b4',    // Hot pink
    value: '#ff6b9d',        // Light pink
    constant: '#da70d6',     // Orchid
    class: '#ba55d3',        // Medium orchid
    namespace: '#ba55d3',    // Medium orchid
    regex: '#ff0000',        // Red
    boolean: '#ff43d6',      // Hot pink
    null: '#ff43d6',         // Hot pink
    undefined: '#ff43d6',    // Hot pink
    escape: '#ffd700',       // Gold
    delimiter: '#ff43d6',    // Hot pink
    selector: '#ffd700',     // Gold
    important: '#ff0000',    // Red
    error: '#ff0000',        // Red
    warning: '#ff8c00'       // Dark orange
  },

  greeny: {
    keyword: '#2a670e',      // Dark green
    string: '#8b4513',       // Saddle brown
    comment: '#228b22',      // Forest green
    number: '#006400',       // Dark green
    operator: '#2a670e',     // Dark green
    function: '#32cd32',     // Lime green
    variable: '#228b22',     // Forest green
    type: '#008000',         // Green
    property: '#2e8b57',     // Sea green
    punctuation: '#2a670e',  // Dark green
    tag: '#2a670e',          // Dark green
    attribute: '#2e8b57',    // Sea green
    value: '#8b4513',        // Saddle brown
    constant: '#008000',     // Green
    class: '#008000',        // Green
    namespace: '#008000',    // Green
    regex: '#dc143c',        // Crimson
    boolean: '#2a670e',      // Dark green
    null: '#2a670e',         // Dark green
    undefined: '#2a670e',    // Dark green
    escape: '#daa520',       // Goldenrod
    delimiter: '#2a670e',    // Dark green
    selector: '#daa520',     // Goldenrod
    important: '#ff0000',    // Red
    error: '#ff0000',        // Red
    warning: '#ff8c00'       // Dark orange
  },

  lightShade: {
    keyword: '#8b4513',      // Saddle brown
    string: '#d2691e',       // Chocolate
    comment: '#696969',      // Dim gray
    number: '#2e8b57',       // Sea green
    operator: '#634c4c',     // Dark gray
    function: '#b8860b',     // Dark goldenrod
    variable: '#4682b4',     // Steel blue
    type: '#008080',         // Teal
    property: '#5f9ea0',     // Cadet blue
    punctuation: '#634c4c',  // Dark gray
    tag: '#8b4513',          // Saddle brown
    attribute: '#5f9ea0',    // Cadet blue
    value: '#d2691e',        // Chocolate
    constant: '#483d8b',     // Dark slate blue
    class: '#008080',        // Teal
    namespace: '#008080',    // Teal
    regex: '#dc143c',        // Crimson
    boolean: '#8b4513',      // Saddle brown
    null: '#8b4513',         // Saddle brown
    undefined: '#8b4513',    // Saddle brown
    escape: '#daa520',       // Goldenrod
    delimiter: '#634c4c',    // Dark gray
    selector: '#daa520',     // Goldenrod
    important: '#ff0000',    // Red
    error: '#ff0000',        // Red
    warning: '#ff8c00'       // Dark orange
  }
};

export const getSyntaxTheme = (themeName: string): SyntaxThemeColors => {
  return syntaxThemes[themeName] || syntaxThemes.dark;
};