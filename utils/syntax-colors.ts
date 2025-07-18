export interface SyntaxColors {
  keyword: string;
  string: string;
  number: string;
  comment: string;
  operator: string;
  punctuation: string;
  function: string;
  variable: string;
  type: string;
  constant: string;
  error: string;
  warning: string;
  info: string;
  identifier: string;
  literal: string;
  tag: string;
  attribute: string;
  property: string;
  method: string;
  class: string;
  namespace: string;
  module: string;
  regexp: string;
  escape: string;
  delimiter: string;
  background: string;
  foreground: string;
  selection: string;
  lineHighlight: string;
  cursor: string;
  lineNumber: string;
  activeLineNumber: string;
  gutter: string;
  border: string;
}

export const syntaxColors: Record<string, SyntaxColors> = {
  dark: {
    keyword: '#FE3E3E',
    string: '#3783F4',
    number: '#3783F4',
    comment: '#565454',
    operator: '#A4E1FF',
    punctuation: '#FFFFFF',
    function: '#CB87FF',
    variable: '#CB87FF',
    type: '#CB87FF',
    constant: '#3783F4',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#CB87FF',
    literal: '#3783F4',
    tag: '#FE3E3E',
    attribute: '#CB87FF',
    property: '#CB87FF',
    method: '#CB87FF',
    class: '#CB87FF',
    namespace: '#FE3E3E',
    module: '#FE3E3E',
    regexp: '#3783F4',
    escape: '#3783F4',
    delimiter: '#FFFFFF',
    background: '#020202',
    foreground: '#FFFFFF',
    selection: '#ffffff30',
    lineHighlight: '#ffffff10',
    cursor: '#FFFFFF',
    lineNumber: '#ffffff60',
    activeLineNumber: '#FFFFFF',
    gutter: '#020202',
    border: '#ffffff40'
  },
  midnight: {
    keyword: '#3EFEFE',
    string: '#F4A537',
    number: '#F4A537',
    comment: '#658083',
    operator: '#C4FFF8',
    punctuation: '#FFFFFF',
    function: '#DD8BFE',
    variable: '#8BFEAD',
    type: '#8BFEAD',
    constant: '#F4A537',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#8BFEAD',
    literal: '#F4A537',
    tag: '#3EFEFE',
    attribute: '#8BFEAD',
    property: '#8BFEAD',
    method: '#DD8BFE',
    class: '#8BFEAD',
    namespace: '#3EFEFE',
    module: '#3EFEFE',
    regexp: '#F4A537',
    escape: '#F4A537',
    delimiter: '#FFFFFF',
    background: '#020015',
    foreground: '#FFFFFF',
    selection: '#ffffff30',
    lineHighlight: '#ffffff10',
    cursor: '#FFFFFF',
    lineNumber: '#ffffff60',
    activeLineNumber: '#FFFFFF',
    gutter: '#020015',
    border: '#ffffff40'
  },
  wine: {
    keyword: '#FE883E',
    string: '#AB5CFF',
    number: '#AB5CFF',
    comment: '#813E3E',
    operator: '#FFD9D9',
    punctuation: '#FFFFFF',
    function: '#8BE5FE',
    variable: '#9EFE8B',
    type: '#9EFE8B',
    constant: '#AB5CFF',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#9EFE8B',
    literal: '#AB5CFF',
    tag: '#FE883E',
    attribute: '#9EFE8B',
    property: '#9EFE8B',
    method: '#8BE5FE',
    class: '#9EFE8B',
    namespace: '#FE883E',
    module: '#FE883E',
    regexp: '#AB5CFF',
    escape: '#AB5CFF',
    delimiter: '#FFFFFF',
    background: '#160000',
    foreground: '#FFFFFF',
    selection: '#ffffff30',
    lineHighlight: '#ffffff10',
    cursor: '#FFFFFF',
    lineNumber: '#ffffff60',
    activeLineNumber: '#FFFFFF',
    gutter: '#160000',
    border: '#ffffff40'
  },
  spruce: {
    keyword: '#3EFE68',
    string: '#FFC355',
    number: '#FFC355',
    comment: '#658083',
    operator: '#D3E9FD',
    punctuation: '#FFFFFF',
    function: '#CC8BFE',
    variable: '#427EFF',
    type: '#427EFF',
    constant: '#FFC355',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#427EFF',
    literal: '#FFC355',
    tag: '#3EFE68',
    attribute: '#427EFF',
    property: '#427EFF',
    method: '#CC8BFE',
    class: '#427EFF',
    namespace: '#3EFE68',
    module: '#3EFE68',
    regexp: '#FFC355',
    escape: '#FFC355',
    delimiter: '#FFFFFF',
    background: '#0d1117',
    foreground: '#FFFFFF',
    selection: '#ffffff30',
    lineHighlight: '#ffffff10',
    cursor: '#FFFFFF',
    lineNumber: '#ffffff60',
    activeLineNumber: '#FFFFFF',
    gutter: '#0d1117',
    border: '#ffffff40'
  },
  forest: {
    keyword: '#3EFE68',
    string: '#FFC355',
    number: '#FFC355',
    comment: '#41813E',
    operator: '#D3E9FD',
    punctuation: '#FFFFFF',
    function: '#CC8BFE',
    variable: '#427EFF',
    type: '#427EFF',
    constant: '#FFC355',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#427EFF',
    literal: '#FFC355',
    tag: '#3EFE68',
    attribute: '#427EFF',
    property: '#427EFF',
    method: '#CC8BFE',
    class: '#427EFF',
    namespace: '#3EFE68',
    module: '#3EFE68',
    regexp: '#FFC355',
    escape: '#FFC355',
    delimiter: '#FFFFFF',
    background: '#0b120c',
    foreground: '#FFFFFF',
    selection: '#ffffff30',
    lineHighlight: '#ffffff10',
    cursor: '#FFFFFF',
    lineNumber: '#ffffff60',
    activeLineNumber: '#FFFFFF',
    gutter: '#0b120c',
    border: '#ffffff40'
  },
  coffee: {
    keyword: '#FF8205',
    string: '#F44737',
    number: '#F44737',
    comment: '#8E7045',
    operator: '#FFEAD7',
    punctuation: '#FFFFFF',
    function: '#0984E9',
    variable: '#FFF587',
    type: '#FFF587',
    constant: '#F44737',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#FFF587',
    literal: '#F44737',
    tag: '#FF8205',
    attribute: '#FFF587',
    property: '#FFF587',
    method: '#0984E9',
    class: '#FFF587',
    namespace: '#FF8205',
    module: '#FF8205',
    regexp: '#F44737',
    escape: '#F44737',
    delimiter: '#FFFFFF',
    background: '#362217',
    foreground: '#FFFFFF',
    selection: '#ffffff30',
    lineHighlight: '#ffffff10',
    cursor: '#FFFFFF',
    lineNumber: '#ffffff60',
    activeLineNumber: '#FFFFFF',
    gutter: '#362217',
    border: '#ffffff40'
  },
  pinky: {
    keyword: '#9B05FF',
    string: '#943D3D',
    number: '#943D3D',
    comment: '#F191F6',
    operator: '#FF48E7',
    punctuation: '#000000',
    function: '#FF4209',
    variable: '#D50F13',
    type: '#D50F13',
    constant: '#943D3D',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#D50F13',
    literal: '#943D3D',
    tag: '#9B05FF',
    attribute: '#D50F13',
    property: '#D50F13',
    method: '#FF4209',
    class: '#D50F13',
    namespace: '#9B05FF',
    module: '#9B05FF',
    regexp: '#943D3D',
    escape: '#943D3D',
    delimiter: '#000000',
    background: '#ffdaf6',
    foreground: '#000000',
    selection: '#00000030',
    lineHighlight: '#00000010',
    cursor: '#000000',
    lineNumber: '#00000060',
    activeLineNumber: '#000000',
    gutter: '#ffdaf6',
    border: '#00000040'
  },
  greeny: {
    keyword: '#005300',
    string: '#FF7B1D',
    number: '#FF7B1D',
    comment: '#638657',
    operator: '#03D492',
    punctuation: '#000000',
    function: '#4D25FF',
    variable: '#0A99FF',
    type: '#0A99FF',
    constant: '#FF7B1D',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#0A99FF',
    literal: '#FF7B1D',
    tag: '#005300',
    attribute: '#0A99FF',
    property: '#0A99FF',
    method: '#4D25FF',
    class: '#0A99FF',
    namespace: '#005300',
    module: '#005300',
    regexp: '#FF7B1D',
    escape: '#FF7B1D',
    delimiter: '#000000',
    background: '#e5ffd8',
    foreground: '#000000',
    selection: '#00000030',
    lineHighlight: '#00000010',
    cursor: '#000000',
    lineNumber: '#00000060',
    activeLineNumber: '#000000',
    gutter: '#e5ffd8',
    border: '#00000040'
  },
  lightShade: {
    keyword: '#1A1DD8',
    string: '#FF1D1D',
    number: '#FF1D1D',
    comment: '#8E6B65',
    operator: '#946F6F',
    punctuation: '#000000',
    function: '#915F26',
    variable: '#D85151',
    type: '#D85151',
    constant: '#FF1D1D',
    error: '#f44747',
    warning: '#ffcc02',
    info: '#75beff',
    identifier: '#D85151',
    literal: '#FF1D1D',
    tag: '#1A1DD8',
    attribute: '#D85151',
    property: '#D85151',
    method: '#915F26',
    class: '#D85151',
    namespace: '#1A1DD8',
    module: '#1A1DD8',
    regexp: '#FF1D1D',
    escape: '#FF1D1D',
    delimiter: '#000000',
    background: '#d0d0d0',
    foreground: '#000000',
    selection: '#00000030',
    lineHighlight: '#00000010',
    cursor: '#000000',
    lineNumber: '#00000060',
    activeLineNumber: '#000000',
    gutter: '#d0d0d0',
    border: '#00000040'
  }
};

export const getSyntaxColors = (themeName: string): SyntaxColors => {
  return syntaxColors[themeName] || syntaxColors.dark;
};

export const getSyntaxColorsByTheme = (theme: any): SyntaxColors => {
  // Try to match by background color
  const themeEntry = Object.entries(syntaxColors).find(([_, colors]) => 
    colors.background === theme.background
  );
  
  if (themeEntry) {
    return themeEntry[1];
  }
  
  // Fallback to dark theme
  return syntaxColors.dark;
};

export const createMonacoTheme = (themeName: string, colors: SyntaxColors) => {
  const isLightTheme = colors.background === '#F8F8F8' || 
                       colors.background === '#FFDAF6' || 
                       colors.background === '#E5FFD8' || 
                       colors.background === '#D0D0D0';
  
  return {
    base: isLightTheme ? 'vs' : 'vs-dark',
    inherit: true,
    rules: [
      // Keywords
      { token: 'keyword', foreground: colors.keyword.replace('#', '') },
      { token: 'keyword.control', foreground: colors.keyword.replace('#', '') },
      { token: 'keyword.operator', foreground: colors.operator.replace('#', '') },
      { token: 'keyword.other', foreground: colors.keyword.replace('#', '') },
      
      // Strings
      { token: 'string', foreground: colors.string.replace('#', '') },
      { token: 'string.quoted', foreground: colors.string.replace('#', '') },
      { token: 'string.regexp', foreground: colors.regexp.replace('#', '') },
      { token: 'string.escape', foreground: colors.escape.replace('#', '') },
      
      // Numbers
      { token: 'number', foreground: colors.number.replace('#', '') },
      { token: 'number.integer', foreground: colors.number.replace('#', '') },
      { token: 'number.float', foreground: colors.number.replace('#', '') },
      { token: 'number.hex', foreground: colors.number.replace('#', '') },
      { token: 'number.octal', foreground: colors.number.replace('#', '') },
      { token: 'number.binary', foreground: colors.number.replace('#', '') },
      
      // Comments
      { token: 'comment', foreground: colors.comment.replace('#', '') },
      { token: 'comment.line', foreground: colors.comment.replace('#', '') },
      { token: 'comment.block', foreground: colors.comment.replace('#', '') },
      
      // Operators and punctuation
      { token: 'operator', foreground: colors.operator.replace('#', '') },
      { token: 'delimiter', foreground: colors.punctuation.replace('#', '') },
      { token: 'delimiter.bracket', foreground: colors.punctuation.replace('#', '') },
      { token: 'delimiter.parenthesis', foreground: colors.punctuation.replace('#', '') },
      { token: 'delimiter.square', foreground: colors.punctuation.replace('#', '') },
      { token: 'delimiter.angle', foreground: colors.punctuation.replace('#', '') },
      
      // Functions and methods
      { token: 'function', foreground: colors.function.replace('#', '') },
      { token: 'function.call', foreground: colors.function.replace('#', '') },
      { token: 'method', foreground: colors.method.replace('#', '') },
      { token: 'method.call', foreground: colors.method.replace('#', '') },
      
      // Variables and identifiers
      { token: 'variable', foreground: colors.variable.replace('#', '') },
      { token: 'variable.name', foreground: colors.variable.replace('#', '') },
      { token: 'variable.parameter', foreground: colors.variable.replace('#', '') },
      { token: 'identifier', foreground: colors.identifier.replace('#', '') },
      
      // Types and classes
      { token: 'type', foreground: colors.type.replace('#', '') },
      { token: 'type.identifier', foreground: colors.type.replace('#', '') },
      { token: 'class', foreground: colors.class.replace('#', '') },
      { token: 'class.name', foreground: colors.class.replace('#', '') },
      
      // Constants
      { token: 'constant', foreground: colors.constant.replace('#', '') },
      { token: 'constant.language', foreground: colors.constant.replace('#', '') },
      { token: 'constant.numeric', foreground: colors.number.replace('#', '') },
      { token: 'constant.character', foreground: colors.string.replace('#', '') },
      
      // HTML/XML specific
      { token: 'tag', foreground: colors.tag.replace('#', '') },
      { token: 'tag.name', foreground: colors.tag.replace('#', '') },
      { token: 'attribute', foreground: colors.attribute.replace('#', '') },
      { token: 'attribute.name', foreground: colors.attribute.replace('#', '') },
      { token: 'attribute.value', foreground: colors.string.replace('#', '') },
      
      // CSS specific
      { token: 'property', foreground: colors.property.replace('#', '') },
      { token: 'property.name', foreground: colors.property.replace('#', '') },
      { token: 'property.value', foreground: colors.string.replace('#', '') },
      
      // Namespaces and modules
      { token: 'namespace', foreground: colors.namespace.replace('#', '') },
      { token: 'module', foreground: colors.module.replace('#', '') },
      
      // Error states
      { token: 'invalid', foreground: colors.error.replace('#', '') },
      { token: 'invalid.illegal', foreground: colors.error.replace('#', '') },
      { token: 'invalid.deprecated', foreground: colors.warning.replace('#', '') },
    ],
    colors: {
      'editor.background': colors.background,
      'editor.foreground': colors.foreground,
      'editor.lineHighlightBackground': colors.lineHighlight,
      'editor.selectionBackground': colors.selection,
      'editor.inactiveSelectionBackground': colors.selection.replace('30', '20'),
      'editorLineNumber.foreground': colors.lineNumber,
      'editorLineNumber.activeForeground': colors.activeLineNumber,
      'editorCursor.foreground': colors.cursor,
      'editor.findMatchBackground': colors.selection.replace('30', '40'),
      'editor.findMatchHighlightBackground': colors.selection.replace('30', '20'),
      'editorWidget.background': colors.background,
      'editorWidget.border': colors.border,
      'editorSuggestWidget.background': colors.background,
      'editorSuggestWidget.border': colors.border,
      'editorSuggestWidget.foreground': colors.foreground,
      'editorSuggestWidget.selectedBackground': colors.selection.replace('30', '20'),
      'editorGutter.background': colors.gutter,
      'scrollbarSlider.background': colors.border,
      'scrollbarSlider.hoverBackground': colors.selection.replace('30', '40'),
      'scrollbarSlider.activeBackground': colors.selection.replace('30', '50'),
    }
  };
};