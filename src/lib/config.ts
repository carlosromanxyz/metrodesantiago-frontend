/**
 * Application Configuration
 * Environment-specific and feature configuration for Metro de Santiago
 */

import { TIMEOUTS, DATA_LIMITS, METRO_SYSTEM } from './constants';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws',
  
  // External Services
  ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_SERVICE_WORKER: process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER === 'true',
} as const;

// ============================================================================
// APPLICATION METADATA
// ============================================================================
export const APP_CONFIG = {
  NAME: 'Metro de Santiago',
  SHORT_NAME: 'Metro',
  DESCRIPTION: 'Sistema de información oficial de Metro de Santiago',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // PWA Configuration
  THEME_COLOR: '#CE0E2D', // Metro red
  BACKGROUND_COLOR: '#ffffff',
  DISPLAY: 'standalone',
  ORIENTATION: 'portrait',
  
  // SEO Configuration
  DEFAULT_TITLE: 'Metro de Santiago - Sistema de Transporte Metropolitano',
  TITLE_TEMPLATE: '%s | Metro de Santiago',
  DEFAULT_DESCRIPTION: 'Información oficial del Metro de Santiago: horarios, tarifas, mapa de red, planificador de viajes y estado del servicio en tiempo real.',
  
  // Social Media
  TWITTER_HANDLE: '@metrodesantiago',
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  
  // Contact Information
  CONTACT_EMAIL: 'info@metro.cl',
  SUPPORT_EMAIL: 'soporte@metro.cl',
  EMERGENCY_PHONE: '800-METRO-1',
} as const;

// ============================================================================
// FEATURE CONFIGURATION
// ============================================================================
export const FEATURE_CONFIG = {
  // Authentication
  AUTH: {
    ENABLED: true,
    PROVIDERS: ['email', 'google', 'facebook'] as const,
    SESSION_TIMEOUT: TIMEOUTS.REQUEST_TIMEOUT * 6, // 60 seconds
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  
  // Real-time Features
  REAL_TIME: {
    ENABLED: true,
    AUTO_RECONNECT: true,
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 3000,
    HEARTBEAT_INTERVAL: 30000,
  },
  
  // Offline Support
  OFFLINE: {
    ENABLED: true,
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    SYNC_ON_RECONNECT: true,
  },
  
  // Push Notifications
  NOTIFICATIONS: {
    ENABLED: true,
    VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    DEFAULT_ICON: '/icons/metro-notification.png',
    BADGE: '/icons/metro-badge.png',
  },
  
  // Location Services
  GEOLOCATION: {
    ENABLED: true,
    HIGH_ACCURACY: true,
    TIMEOUT: 10000,
    MAX_AGE: 300000, // 5 minutes
  },
  
  // Accessibility
  ACCESSIBILITY: {
    HIGH_CONTRAST_MODE: true,
    SCREEN_READER_SUPPORT: true,
    KEYBOARD_NAVIGATION: true,
    FOCUS_INDICATORS: true,
  },
} as const;

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API_CONFIG = {
  // Base URLs
  BASE_URL: ENV_CONFIG.API_URL,
  VERSION: 'v1',
  
  // Timeouts
  REQUEST_TIMEOUT: TIMEOUTS.REQUEST_TIMEOUT,
  CONNECTION_TIMEOUT: 5000,
  
  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RETRY_MULTIPLIER: 2,
  
  // Rate Limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10,
  },
  
  // Cache Configuration
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    MAX_AGE: 60 * 60 * 1000, // 1 hour
    STALE_WHILE_REVALIDATE: 30 * 60 * 1000, // 30 minutes
  },
  
  // Endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    METRO_STATUS: '/metro/status',
    STATIONS: '/metro/stations',
    LINES: '/metro/lines',
    ROUTES: '/metro/routes',
    SCHEDULES: '/metro/schedules',
    DISRUPTIONS: '/metro/disruptions',
    NEWS: '/news',
    SEARCH: '/search',
  },
} as const;

// ============================================================================
// UI CONFIGURATION
// ============================================================================
export const UI_CONFIG = {
  // Theme
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark', 'high-contrast'] as const,
  
  // Layout
  MAX_CONTENT_WIDTH: 1280,
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 200,
  
  // Animation
  REDUCED_MOTION: false,
  ANIMATION_DURATION: TIMEOUTS.MODAL_ANIMATION,
  
  // Data Display
  ITEMS_PER_PAGE: DATA_LIMITS.DEFAULT_PAGE_SIZE,
  MAX_ITEMS_PER_PAGE: DATA_LIMITS.MAX_PAGE_SIZE,
  SEARCH_DEBOUNCE: TIMEOUTS.DEBOUNCE_DELAY,
  
  // Carousel Configuration
  CAROUSEL: {
    AUTO_PLAY: true,
    AUTO_PLAY_INTERVAL: TIMEOUTS.CAROUSEL_AUTO_PLAY,
    INFINITE_LOOP: true,
    SHOW_INDICATORS: true,
    SHOW_THUMBNAILS: false,
  },
  
  // Toast Configuration
  TOAST: {
    DURATION: TIMEOUTS.TOAST_DURATION,
    POSITION: 'top-right',
    MAX_TOASTS: 5,
  },
} as const;

// ============================================================================
// METRO SPECIFIC CONFIGURATION
// ============================================================================
export const METRO_CONFIG = {
  // Service Information
  SERVICE_HOURS: {
    START: METRO_SYSTEM.SERVICE_START_HOUR,
    END: METRO_SYSTEM.SERVICE_END_HOUR,
    WEEKEND_START: 7,
    WEEKEND_END: 23,
  },
  
  // Real-time Updates
  UPDATE_INTERVALS: {
    STATUS: TIMEOUTS.METRO_STATUS_UPDATE,
    ARRIVALS: TIMEOUTS.LIVE_DATA_REFRESH,
    DISRUPTIONS: TIMEOUTS.LIVE_DATA_REFRESH,
    SCHEDULE: TIMEOUTS.TIME_INDICATOR_UPDATE,
  },
  
  // Map Configuration
  MAP: {
    DEFAULT_ZOOM: 12,
    MAX_ZOOM: 18,
    MIN_ZOOM: 10,
    CENTER_LAT: -33.4489,
    CENTER_LNG: -70.6693,
  },
  
  // Trip Planner
  TRIP_PLANNER: {
    MAX_WALKING_DISTANCE: 1000, // meters
    MAX_RESULTS: 5,
    INCLUDE_WALKING_DIRECTIONS: true,
    INCLUDE_ACCESSIBILITY_INFO: true,
  },
  
  // Fare Information
  FARES: {
    CURRENCY: 'CLP',
    CURRENCY_SYMBOL: '$',
    BIP_CARD_COST: 1550,
    STUDENT_DISCOUNT: 0.33,
    SENIOR_DISCOUNT: 0.15,
  },
} as const;

// ============================================================================
// MONITORING & ANALYTICS CONFIGURATION
// ============================================================================
export const MONITORING_CONFIG = {
  // Error Reporting
  ERROR_REPORTING: {
    ENABLED: ENV_CONFIG.ENABLE_ERROR_REPORTING,
    SAMPLE_RATE: ENV_CONFIG.IS_PRODUCTION ? 0.1 : 1.0,
    DEBUG: ENV_CONFIG.IS_DEVELOPMENT,
  },
  
  // Performance Monitoring
  PERFORMANCE: {
    ENABLED: ENV_CONFIG.IS_PRODUCTION,
    SAMPLE_RATE: 0.1,
    TRACK_WEB_VITALS: true,
    TRACK_INTERACTIONS: true,
  },
  
  // Analytics
  ANALYTICS: {
    ENABLED: ENV_CONFIG.ENABLE_ANALYTICS,
    TRACK_PAGE_VIEWS: true,
    TRACK_EVENTS: true,
    TRACK_USER_INTERACTIONS: true,
    ANONYMIZE_IP: true,
  },
  
  // Logging
  LOGGING: {
    LEVEL: ENV_CONFIG.IS_PRODUCTION ? 'error' : 'debug',
    CONSOLE_ENABLED: ENV_CONFIG.IS_DEVELOPMENT,
    REMOTE_ENABLED: ENV_CONFIG.IS_PRODUCTION,
  },
} as const;

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================
export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP: {
    ENABLED: ENV_CONFIG.IS_PRODUCTION,
    REPORT_ONLY: ENV_CONFIG.IS_DEVELOPMENT,
    REPORT_URI: '/api/csp-report',
  },
  
  // CORS
  CORS: {
    ORIGINS: ENV_CONFIG.IS_PRODUCTION 
      ? ['https://metro.cl', 'https://www.metro.cl']
      : ['http://localhost:3000', 'http://localhost:3001'],
    CREDENTIALS: true,
  },
  
  // Rate Limiting
  RATE_LIMITING: {
    ENABLED: ENV_CONFIG.IS_PRODUCTION,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  
  // Session Security
  SESSION: {
    SECURE: ENV_CONFIG.IS_PRODUCTION,
    HTTP_ONLY: true,
    SAME_SITE: 'strict',
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the appropriate API endpoint URL
 */
export const getApiEndpoint = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}${endpoint}`;
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof FEATURE_CONFIG): boolean => {
  const featureConfig = FEATURE_CONFIG[feature] as Record<string, unknown>;
  return Boolean(featureConfig?.ENABLED ?? true);
};

/**
 * Get environment-specific configuration
 */
export const getEnvConfig = (key: keyof typeof ENV_CONFIG) => {
  return ENV_CONFIG[key];
};

/**
 * Check if app is running in development mode
 */
export const isDevelopment = (): boolean => {
  return ENV_CONFIG.IS_DEVELOPMENT;
};

/**
 * Check if app is running in production mode
 */
export const isProduction = (): boolean => {
  return ENV_CONFIG.IS_PRODUCTION;
};

/**
 * Get the current theme configuration
 */
export const getThemeConfig = () => {
  return {
    default: UI_CONFIG.DEFAULT_THEME,
    available: UI_CONFIG.AVAILABLE_THEMES,
  };
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export type Theme = typeof UI_CONFIG.AVAILABLE_THEMES[number];
export type AuthProvider = typeof FEATURE_CONFIG.AUTH.PROVIDERS[number];
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;
export type FeatureName = keyof typeof FEATURE_CONFIG;

// ============================================================================
// EXPORT MAIN CONFIG OBJECT
// ============================================================================
export const CONFIG = {
  ENV: ENV_CONFIG,
  APP: APP_CONFIG,
  FEATURES: FEATURE_CONFIG,
  API: API_CONFIG,
  UI: UI_CONFIG,
  METRO: METRO_CONFIG,
  MONITORING: MONITORING_CONFIG,
  SECURITY: SECURITY_CONFIG,
} as const;

export default CONFIG;