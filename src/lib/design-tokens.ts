/**
 * Design Tokens for Metro de Santiago
 * Centralized design system tokens for consistent styling across the application
 */

// Metro de Santiago Corporate Colors
export const METRO_CORPORATE_COLORS = {
  red: '#CE0E2D',
  black: '#000000',
  orange: '#E66300',
  burgundy: '#813030',
  gray: '#888A8C',
  turquoise: '#00ACA7',
} as const;

// Metro Lines Colors (Exact colors from the system)
export const METRO_LINE_COLORS = {
  1: '#E10E0E',    // Línea 1 - Roja
  2: '#FFD100',    // Línea 2 - Amarilla
  3: '#8B4513',    // Línea 3 - Café
  4: '#0066CC',    // Línea 4 - Azul
  '4A': '#00A4E4', // Línea 4A - Celeste
  5: '#00B04F',    // Línea 5 - Verde Claro
  6: '#8B1FA9',    // Línea 6 - Morada
} as const;

// Metro Lines Information
export const METRO_LINES_INFO = {
  1: { name: 'Línea 1', color: 'Roja', hex: METRO_LINE_COLORS[1] },
  2: { name: 'Línea 2', color: 'Amarilla', hex: METRO_LINE_COLORS[2] },
  3: { name: 'Línea 3', color: 'Café', hex: METRO_LINE_COLORS[3] },
  4: { name: 'Línea 4', color: 'Azul', hex: METRO_LINE_COLORS[4] },
  '4A': { name: 'Línea 4A', color: 'Celeste', hex: METRO_LINE_COLORS['4A'] },
  5: { name: 'Línea 5', color: 'Verde Claro', hex: METRO_LINE_COLORS[5] },
  6: { name: 'Línea 6', color: 'Morada', hex: METRO_LINE_COLORS[6] },
} as const;

// Typography Scale optimized for mobile
export const TYPOGRAPHY_SCALE = {
  // Standard sizes
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
  base: { fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  
  // Metro-specific sizes for mobile optimization
  'metro-xs': { fontSize: '0.6875rem', lineHeight: '1rem' },      // 11px
  'metro-sm': { fontSize: '0.8125rem', lineHeight: '1.125rem' },  // 13px
  'metro-base': { fontSize: '0.9375rem', lineHeight: '1.375rem' }, // 15px
  'metro-lg': { fontSize: '1.0625rem', lineHeight: '1.5rem' },    // 17px
  'metro-xl': { fontSize: '1.1875rem', lineHeight: '1.625rem' },  // 19px
} as const;

// Spacing Scale (Metro-specific)
export const SPACING_SCALE = {
  'metro-xs': '0.25rem',   // 4px
  'metro-sm': '0.5rem',    // 8px
  'metro-md': '0.75rem',   // 12px
  'metro-lg': '1rem',      // 16px
  'metro-xl': '1.5rem',    // 24px
  'metro-2xl': '2rem',     // 32px
  'metro-3xl': '2.5rem',   // 40px
  'metro-4xl': '3rem',     // 48px
  'metro-5xl': '4rem',     // 64px
  'metro-6xl': '5rem',     // 80px
} as const;

// Breakpoints
export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Border Radius Scale
export const BORDER_RADIUS = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  default: 'var(--radius)',
} as const;

// Shadow Scale (Metro-specific)
export const SHADOW_SCALE = {
  'metro-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'metro-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'metro-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'metro-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  metro: '250ms',
} as const;

// Animation Timing Functions
export const ANIMATION_TIMING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  metro: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Z-Index Scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// Component-specific tokens
export const COMPONENT_TOKENS = {
  // Touch targets (mobile-first)
  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
    smMinHeight: '32px',
    smMinWidth: '32px',
  },
  
  // Focus rings
  focusRing: {
    width: '2px',
    style: 'solid',
    color: 'var(--color-ring)',
    offset: '2px',
  },
  
  // Interactive states
  hover: {
    opacity: '0.8',
    scale: '1.02',
  },
  
  active: {
    opacity: '0.9',
    scale: '0.98',
  },
} as const;

// Utility functions for working with tokens
export const getMetroLineColor = (lineNumber: string | number): string => {
  const line = lineNumber.toString();
  return METRO_LINE_COLORS[line as keyof typeof METRO_LINE_COLORS] || METRO_CORPORATE_COLORS.gray;
};

export const getMetroLineInfo = (lineNumber: string | number) => {
  const line = lineNumber.toString();
  return METRO_LINES_INFO[line as keyof typeof METRO_LINES_INFO] || null;
};

// Utility function to get Tailwind CSS classes for metro lines
export const getMetroLineTailwindClass = (line: string): string => {
  const lineToColorClass: { [key: string]: string } = {
    "L1": "bg-metro-line-1",
    "L2": "bg-metro-line-2", 
    "L3": "bg-metro-line-3",
    "L4": "bg-metro-line-4",
    "L4A": "bg-metro-line-4a",
    "L5": "bg-metro-line-5",
    "L6": "bg-metro-line-6",
    "1": "bg-metro-line-1",
    "2": "bg-metro-line-2",
    "3": "bg-metro-line-3", 
    "4": "bg-metro-line-4",
    "41": "bg-metro-line-4a", // Línea 4A has number 41 in data
    "5": "bg-metro-line-5",
    "6": "bg-metro-line-6"
  };
  
  return lineToColorClass[line] || "bg-gray-600";
};

// Utility function to get text color classes for metro lines
export const getMetroLineTextClass = (line: string): string => {
  const lineToTextClass: { [key: string]: string } = {
    "L1": "text-metro-line-1",
    "L2": "text-metro-line-2",
    "L3": "text-metro-line-3", 
    "L4": "text-metro-line-4",
    "L4A": "text-metro-line-4a",
    "L5": "text-metro-line-5",
    "L6": "text-metro-line-6",
    "1": "text-metro-line-1",
    "2": "text-metro-line-2", 
    "3": "text-metro-line-3",
    "4": "text-metro-line-4",
    "41": "text-metro-line-4a",
    "5": "text-metro-line-5",
    "6": "text-metro-line-6"
  };
  
  return lineToTextClass[line] || "text-gray-600";
};

// Utility function to get border color classes for metro lines  
export const getMetroLineBorderClass = (line: string): string => {
  const lineToBorderClass: { [key: string]: string } = {
    "L1": "border-metro-line-1",
    "L2": "border-metro-line-2",
    "L3": "border-metro-line-3",
    "L4": "border-metro-line-4", 
    "L4A": "border-metro-line-4a",
    "L5": "border-metro-line-5",
    "L6": "border-metro-line-6",
    "1": "border-metro-line-1",
    "2": "border-metro-line-2",
    "3": "border-metro-line-3",
    "4": "border-metro-line-4",
    "41": "border-metro-line-4a",
    "5": "border-metro-line-5", 
    "6": "border-metro-line-6"
  };
  
  return lineToBorderClass[line] || "border-gray-600";
};

// CSS Custom Properties mapping
export const CSS_VARIABLES = {
  // Metro Corporate Colors
  '--color-metro-red': METRO_CORPORATE_COLORS.red,
  '--color-metro-black': METRO_CORPORATE_COLORS.black,
  '--color-metro-orange': METRO_CORPORATE_COLORS.orange,
  '--color-metro-burgundy': METRO_CORPORATE_COLORS.burgundy,
  '--color-metro-gray': METRO_CORPORATE_COLORS.gray,
  '--color-metro-turquoise': METRO_CORPORATE_COLORS.turquoise,
  
  // Metro Line Colors
  '--color-metro-line-1': METRO_LINE_COLORS[1],
  '--color-metro-line-2': METRO_LINE_COLORS[2],
  '--color-metro-line-3': METRO_LINE_COLORS[3],
  '--color-metro-line-4': METRO_LINE_COLORS[4],
  '--color-metro-line-4a': METRO_LINE_COLORS['4A'],
  '--color-metro-line-5': METRO_LINE_COLORS[5],
  '--color-metro-line-6': METRO_LINE_COLORS[6],
} as const;

// Type definitions for better TypeScript support
export type MetroLineNumber = keyof typeof METRO_LINE_COLORS;
export type MetroCorporateColor = keyof typeof METRO_CORPORATE_COLORS;
export type TypographySize = keyof typeof TYPOGRAPHY_SCALE;
export type SpacingSize = keyof typeof SPACING_SCALE;
export type BreakpointSize = keyof typeof BREAKPOINTS;

// Export all tokens as a single object for easier importing
export const DESIGN_TOKENS = {
  colors: {
    corporate: METRO_CORPORATE_COLORS,
    lines: METRO_LINE_COLORS,
    linesInfo: METRO_LINES_INFO,
  },
  typography: TYPOGRAPHY_SCALE,
  spacing: SPACING_SCALE,
  breakpoints: BREAKPOINTS,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOW_SCALE,
  animations: {
    durations: ANIMATION_DURATIONS,
    timing: ANIMATION_TIMING,
  },
  zIndex: Z_INDEX,
  components: COMPONENT_TOKENS,
  cssVariables: CSS_VARIABLES,
} as const;