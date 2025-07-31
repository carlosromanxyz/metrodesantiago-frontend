/**
 * Header component constants
 * Centralized location for magic numbers, timeout values, and reusable constants
 */

// Animation and timing constants
export const ANIMATION_DELAYS = {
  FOCUS_TIMEOUT: 100,
  LOADING_SIMULATION: 1000,
} as const;

// UI dimensions and sizing
export const UI_DIMENSIONS = {
  MOBILE_MENU_WIDTH: {
    DEFAULT: 320, // 80 * 4px = 320px (w-80)
    SM: 384,      // 96 * 4px = 384px (w-96)
  },
  HEADER_HEIGHT: 64,    // h-16 = 4rem = 64px
  LOGO_HEIGHT: 40,      // h-10 = 2.5rem = 40px
  ICON_SIZE: {
    SMALL: 14,          // h-3.5 w-3.5
    DEFAULT: 20,        // h-5 w-5
    MEDIUM: 24,         // h-6 w-6
  },
  TOUCH_TARGET: {
    MIN_WIDTH: 44,      // min-w-[44px]
    MIN_HEIGHT: 44,     // min-h-[44px]
    WIDTH: 44,          // w-11 = 2.75rem = 44px
    HEIGHT: 44,         // h-11 = 2.75rem = 44px
  },
} as const;

// Z-index values
export const Z_INDEX = {
  HEADER: 50,
} as const;

// Animation constants
export const ANIMATION = {
  COLLAPSIBLE_DELAY_MULTIPLIER: 50, // ms delay between child items
  TRANSITION_DURATION: 200,         // Standard transition duration
  HOVER_SCALE: 1.1,                // Scale factor for hover effects
  HOVER_TRANSLATE_X: 4,             // Horizontal translation on hover (translate-x-1)
} as const;

// Loading states
export const LOADING_STATES = {
  LOGIN: 'Ingresando...',
  REGISTER: 'Registrando...',
  LOGIN_BUTTON: 'Ingresar',
  REGISTER_BUTTON: 'Registro',
} as const;

// ARIA and accessibility constants
export const ARIA_LABELS = {
  MOBILE_MENU: 'Abrir menú de navegación',
  MOBILE_MENU_ID: 'mobile-navigation-menu',
  MOBILE_MENU_TITLE_ID: 'mobile-menu-title',
  NAVIGATION_TITLE: 'Navegación',
  METRO_SUBTITLE: 'Metro de Santiago',
  SOCIAL_FOLLOW: 'Síguenos en nuestras redes',
  USER_PROFILE: 'Mi Perfil',
} as const;

// Focus trap selectors
export const FOCUS_TRAP_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
] as const;

// CSS class name patterns (for better maintainability)
export const CSS_CLASSES = {
  TOUCH_TARGET: 'min-w-[44px] min-h-[44px] w-11 h-11',
  SOCIAL_ICON_BASE: 'flex items-center justify-center rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-black/20 dark:hover:bg-white/20 hover:text-metro-red dark:hover:text-white focus:bg-black/20 dark:focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-metro-red/30 transition-all duration-200 touch-manipulation',
  BUTTON_PRIMARY: 'flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-red/80 hover:bg-metro-red disabled:bg-metro-red/50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200',
  BUTTON_SECONDARY: 'flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-orange/80 hover:bg-metro-orange disabled:bg-metro-orange/50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200',
  LOADING_SPINNER: 'animate-spin rounded-full border-2 border-white border-t-transparent',
} as const;