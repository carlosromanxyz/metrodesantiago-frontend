/**
 * Centralized Constants for Metro de Santiago
 * Contains all magic numbers, strings, and configuration values used across the application
 */

// ============================================================================
// BREAKPOINTS
// ============================================================================
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  WIDE: 1536,
} as const;

// ============================================================================
// TIMEOUTS & INTERVALS (in milliseconds)
// ============================================================================
export const TIMEOUTS = {
  // Loading timeouts
  INITIAL_PAGE_LOAD: 2000,
  ROUTE_CHANGE: 1500,
  
  // Component timeouts
  DEBOUNCE_DELAY: 300,
  MODAL_ANIMATION: 200,
  TOAST_DURATION: 5000,
  TOOLTIP_DELAY: 500,
  
  // Auto-play intervals
  CAROUSEL_AUTO_PLAY: 5000,
  HERO_CAROUSEL: 5000,
  CORPORATE_NEWS: 5000,
  
  // Data refresh intervals
  METRO_STATUS_UPDATE: 30000,
  LIVE_DATA_REFRESH: 5000,
  TIME_INDICATOR_UPDATE: 1000,
  
  // Network status intervals
  NIGHT_TIME_INTERVAL: 60000,
  DAY_TIME_MIN_INTERVAL: 10000,
  DAY_TIME_MAX_INTERVAL: 30000,
  MOBILE_WIDGET_MIN_INTERVAL: 5000,
  MOBILE_WIDGET_MAX_INTERVAL: 13000,
  
  // Auto-play resume delays
  AUTO_PLAY_RESUME_DELAY: 10000,
  
  // API timeouts
  REQUEST_TIMEOUT: 10000,
} as const;

// ============================================================================
// ANIMATION DURATIONS (in milliseconds)
// ============================================================================
export const ANIMATION_DURATIONS = {
  // Standard durations
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  METRO: 250,
  
  // Specific component animations
  FADE_IN: 300,
  SLIDE_IN: 250,
  SCALE_IN: 200,
  BOUNCE: 400,
  
  // CSS animations (string values for CSS)
  CSS_FAST: '150ms',
  CSS_NORMAL: '250ms',
  CSS_SLOW: '350ms',
  CSS_METRO: '250ms',
  CSS_FADE: '300ms',
  CSS_CARET_BLINK: '1000ms',
} as const;

// ============================================================================
// SIZES & DIMENSIONS (in pixels)
// ============================================================================
export const SIZES = {
  // Touch targets (mobile-first)
  TOUCH_TARGET_MIN: 44,
  TOUCH_TARGET_SMALL: 32,
  
  // Common component sizes
  BUTTON_HEIGHT_SMALL: 32,
  BUTTON_HEIGHT_MEDIUM: 40,
  BUTTON_HEIGHT_LARGE: 48,
  
  // Icon sizes
  ICON_SMALL: 16,
  ICON_MEDIUM: 20,
  ICON_LARGE: 24,
  ICON_EXTRA_LARGE: 32,
  
  // Form elements
  INPUT_HEIGHT: 40,
  SELECT_HEIGHT: 40,
  TEXTAREA_MIN_HEIGHT: 80,
  
  // Layout sizes
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 200,
  SIDEBAR_WIDTH: 280,
  MODAL_MAX_WIDTH: 640,
  
  // Focus ring
  FOCUS_RING_WIDTH: 2,
  FOCUS_RING_OFFSET: 2,
} as const;

// ============================================================================
// URLs & EXTERNAL LINKS
// ============================================================================
export const EXTERNAL_URLS = {
  // Social Media
  FACEBOOK: 'https://www.facebook.com/Metrostgo/',
  INSTAGRAM: 'https://www.instagram.com/metrodesantiago/',
  TWITTER: 'https://twitter.com/metrodesantiago',
  TIKTOK: 'https://www.tiktok.com/@tiometrodesantiago',
  SPOTIFY: 'https://open.spotify.com/show/5U3TuK7su3rtOGHJRtCtm1',
  
  // Metro official sites
  METRO_OFFICIAL: 'https://www.metro.cl',
  METROTREN: 'https://www.metrotren.cl',
  RED_METROPOLITANA: 'https://www.red.cl',
  
  // Government sites
  SUBSECRETARIA_TRANSPORTES: 'https://www.subtrans.gob.cl',
  MINISTERIO_TRANSPORTES: 'https://www.mtt.gob.cl',
  
  // Emergency contacts
  EMERGENCY_METRO: '800-METRO-1',
  POLICE: '133',
  FIRE_DEPARTMENT: '132',
  MEDICAL_EMERGENCY: '131',
} as const;

// ============================================================================
// PAGINATION & DATA LIMITS
// ============================================================================
export const DATA_LIMITS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_RESULTS_LIMIT: 50,
  RECENT_ITEMS_LIMIT: 10,
  SUGGESTIONS_LIMIT: 5,
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  THEME: 'metro-theme',
  USER_PREFERENCES: 'metro-user-prefs',
  SEARCH_HISTORY: 'metro-search-history',
  FAVORITE_STATIONS: 'metro-favorite-stations',
  LAST_TRIP: 'metro-last-trip',
  ACCESSIBILITY_SETTINGS: 'metro-accessibility',
  NOTIFICATION_SETTINGS: 'metro-notifications',
} as const;

// ============================================================================
// METRO SYSTEM CONSTANTS
// ============================================================================
export const METRO_SYSTEM = {
  // Service hours
  SERVICE_START_HOUR: 6,
  SERVICE_END_HOUR: 23,
  
  // Line numbers
  LINES: ['1', '2', '3', '4', '4A', '5', '6'] as const,
  
  // Station types
  STATION_TYPES: {
    REGULAR: 'regular',
    TRANSFER: 'transfer',
    TERMINAL: 'terminal',
  } as const,
  
  // Service status
  SERVICE_STATUS: {
    NORMAL: 'normal',
    DELAYED: 'delayed',
    INTERRUPTED: 'interrupted',
    MAINTENANCE: 'maintenance',
    CLOSED: 'closed',
  } as const,
  
  // Train frequencies (in minutes)
  PEAK_FREQUENCY: 2,
  OFF_PEAK_FREQUENCY: 4,
  WEEKEND_FREQUENCY: 6,
  NIGHT_FREQUENCY: 10,
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================
export const Z_INDEX = {
  BASE: 1,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  LOADING_OVERLAY: 1090,
} as const;

// ============================================================================
// MATHEMATICAL CONSTANTS
// ============================================================================
export const MATH_CONSTANTS = {
  // Time calculations
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  
  // Distance calculations
  METERS_PER_KILOMETER: 1000,
  
  // Percentage calculations
  PERCENTAGE_BASE: 100,
} as const;

// ============================================================================
// ERROR CODES & MESSAGES
// ============================================================================
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

// ============================================================================
// REGEX PATTERNS
// ============================================================================
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_CHILE: /^(\+?56)?[2-9]\d{8}$/,
  RUT: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMBERS_ONLY: /^\d+$/,
} as const;

// ============================================================================
// ACCESSIBILITY CONSTANTS
// ============================================================================
export const ACCESSIBILITY = {
  // ARIA constants
  ARIA_EXPANDED_TRUE: 'true',
  ARIA_EXPANDED_FALSE: 'false',
  ARIA_HIDDEN_TRUE: 'true',
  ARIA_HIDDEN_FALSE: 'false',
  
  // Focus management
  FOCUS_TRAP_DELAY: 100,
  SCREEN_READER_DELAY: 150,
  
  // Contrast ratios
  MIN_CONTRAST_RATIO: 4.5,
  ENHANCED_CONTRAST_RATIO: 7,
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export type BreakpointKey = keyof typeof BREAKPOINTS;
export type TimeoutKey = keyof typeof TIMEOUTS;
export type AnimationDurationKey = keyof typeof ANIMATION_DURATIONS;
export type SizeKey = keyof typeof SIZES;
export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;
export type StorageKey = keyof typeof STORAGE_KEYS;
export type MetroLine = typeof METRO_SYSTEM.LINES[number];
export type ServiceStatus = typeof METRO_SYSTEM.SERVICE_STATUS[keyof typeof METRO_SYSTEM.SERVICE_STATUS];
export type StationType = typeof METRO_SYSTEM.STATION_TYPES[keyof typeof METRO_SYSTEM.STATION_TYPES];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get breakpoint value in pixels
 */
export const getBreakpoint = (breakpoint: BreakpointKey): number => {
  return BREAKPOINTS[breakpoint];
};

/**
 * Get timeout value in milliseconds
 */
export const getTimeout = (timeout: TimeoutKey): number => {
  return TIMEOUTS[timeout];
};

/**
 * Check if current time is within metro service hours
 */
export const isServiceHours = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  return hour >= METRO_SYSTEM.SERVICE_START_HOUR && hour < METRO_SYSTEM.SERVICE_END_HOUR;
};

/**
 * Check if current time is night time for different update intervals
 */
export const isNightTime = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  return hour < 6 || hour > 22;
};

/**
 * Get random interval between min and max values
 */
export const getRandomInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Convert milliseconds to seconds
 */
export const msToSeconds = (ms: number): number => {
  return ms / MATH_CONSTANTS.MILLISECONDS_PER_SECOND;
};

/**
 * Convert seconds to milliseconds
 */
export const secondsToMs = (seconds: number): number => {
  return seconds * MATH_CONSTANTS.MILLISECONDS_PER_SECOND;
};

// ============================================================================
// EXPORT ALL CONSTANTS AS A SINGLE OBJECT
// ============================================================================
export const CONSTANTS = {
  BREAKPOINTS,
  TIMEOUTS,
  ANIMATION_DURATIONS,
  SIZES,
  EXTERNAL_URLS,
  DATA_LIMITS,
  STORAGE_KEYS,
  METRO_SYSTEM,
  Z_INDEX,
  MATH_CONSTANTS,
  ERROR_CODES,
  REGEX_PATTERNS,
  ACCESSIBILITY,
} as const;

export default CONSTANTS;