/**
 * Centralized types barrel export
 * 
 * This file provides a single entry point for importing all types
 * used throughout the Metro de Santiago application.
 */

// Re-export commonly used React types first
export type {
  ReactNode,
  ReactElement,
  ComponentType,
  PropsWithChildren,
  CSSProperties,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormEvent,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent
} from 'react';

// Metro domain types
export type {
  MetroLine,
  Station,
  StationLineInfo,
  LineIndicatorData,
  NetworkStatusType,
  StationWithLines,
  StationOption,
  TripPlannerData,
  ServiceDisruption,
  NetworkEvent
} from './metro';

export {
  MetroLineSchema,
  StationSchema,
  StationLineInfoSchema,
  LineIndicatorDataSchema,
  NetworkStatusSchema,
  validateMetroLine,
  validateStation,
  validateNetworkStatus,
  isMetroLine,
  isStation,
  isNetworkStatus,
  METRO_COLORS,
  LINE_DISPLAY_NAMES,
  formatLineNumber,
  getLineColor
} from './metro';

// Navigation types
export type {
  NavigationItem,
  SocialLink,
  BreadcrumbItem,
  NavigationDropdownProps,
  NavLinkProps,
  NavigationConfig,
  FooterSection,
  MobileNavigationState,
  NavigationTheme
} from './navigation';

export {
  NavigationItemSchema,
  SocialLinkSchema,
  BreadcrumbItemSchema,
  validateNavigationItem,
  validateSocialLink,
  validateBreadcrumbItem,
  isNavigationItem,
  isSocialLink,
  isBreadcrumbItem,
  hasChildren,
  findNavigationItem,
  getNavigationBreadcrumbs,
  flattenNavigationItems,
  isActiveNavigationItem,
  SOCIAL_PLATFORMS,
  ICON_NAMES
} from './navigation';

// UI component types
export type {
  SizeVariant,
  ColorVariant,
  ButtonVariant,
  BaseComponentProps,
  LineIndicatorProps,
  MultiLineIndicatorProps,
  SearchInputProps,
  IconButtonProps,
  SectionTitleProps,
  LogoProps,
  ModalProps,
  ComboboxOption,
  ComboboxProps,
  CarouselSlide,
  HeroCarouselProps,
  ScheduleIndicatorProps,
  NetworkStatusProps,
  ToastProps,
  LoadingState,
  FormFieldProps,
  CardProps,
  BadgeProps,
  SkeletonProps,
  DataTableColumn,
  DataTableProps,
  ThemeColors,
  Theme,
  AnimationConfig,
  TransitionConfig,
  Breakpoint,
  ResponsiveValue,
  DeepPartial,
  ComponentProps,
  WithoutClassName,
  WithClassName
} from './ui';

export {
  SizeVariantSchema,
  ColorVariantSchema,
  ButtonVariantSchema,
  validateSizeVariant,
  validateColorVariant,
  validateButtonVariant,
  isSizeVariant,
  isColorVariant,
  isButtonVariant,
  SIZE_CLASSES,
  SPACING_SCALE,
  BORDER_RADIUS
} from './ui';

// API types
export type {
  ApiResponse,
  ErrorResponse,
  TripPlanningRequest,
  TripOption,
  TripPlanningResponse,
  ServiceDisruption as ApiServiceDisruption,
  ArrivalInfo,
  NewsItem,
  StationApiResponse,
  StationsApiResponse,
  MetroLineApiResponse,
  MetroLinesApiResponse,
  NetworkStatusApiResponse,
  ServiceDisruptionsResponse,
  StationArrivalsResponse,
  NewsResponse,
  ApiClientConfig,
  ApiRequestOptions,
  HttpMethod,
  HttpStatus
} from './api';

export {
  ApiResponseSchema,
  ErrorResponseSchema,
  TripPlanningRequestSchema,
  TripOptionSchema,
  TripPlanningResponseSchema,
  ServiceDisruptionSchema,
  ArrivalInfoSchema,
  NewsItemSchema,
  StationApiResponseSchema,
  StationsApiResponseSchema,
  MetroLineApiResponseSchema,
  MetroLinesApiResponseSchema,
  NetworkStatusApiResponseSchema,
  ServiceDisruptionsResponseSchema,
  StationArrivalsResponseSchema,
  NewsResponseSchema,
  PaginatedResponseSchema,
  SingleItemResponseSchema,
  validateApiResponse,
  validateTripPlanningRequest,
  isErrorResponse,
  isApiResponse,
  HTTP_STATUS,
  API_ENDPOINTS,
  buildApiUrl,
  createPaginationParams,
  formatApiError
} from './api';

// Metro context types
export type {
  MetroState,
  MetroAction,
  MetroActionType,
  MetroContextValue,
  MetroProviderProps,
  SearchHistoryItem,
  FavoriteStation,
  RouteSearchResult,
  LoadingStates,
  UserPreferences,
  SpecificMetroAction
} from './metro-context';

export {
  DEFAULT_USER_PREFERENCES,
  DEFAULT_LOADING_STATES,
  INITIAL_METRO_STATE,
  CACHE_DURATIONS,
  PERSISTENCE_CONFIG
} from './metro-context';

// Import React types for utility types
import type { ReactNode, MouseEvent, ChangeEvent, FormEvent, KeyboardEvent } from 'react';

/**
 * Utility type aliases for common patterns
 */

// Common component prop patterns
export type ComponentWithClassName<T = object> = T & { className?: string };
export type ComponentWithChildren<T = object> = T & { children?: ReactNode };
export type ComponentBaseProps<T = object> = ComponentWithClassName<ComponentWithChildren<T>>;

// Event handler types
export type ClickHandler = (event: MouseEvent) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: ChangeEvent<T>) => void;
export type SubmitHandler = (event: FormEvent) => void;
export type KeyHandler = (event: KeyboardEvent) => void;

// Common callback patterns
export type VoidCallback = () => void;
export type ValueCallback<T> = (value: T) => void;
export type ToggleCallback = (isOpen: boolean) => void;

// Form-related types
export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string>;
export type FormTouched = Record<string, boolean>;

export interface FormState<T extends FormValues = FormValues> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  isValid: boolean;
}

// Search and filter types
export interface SearchState {
  query: string;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string | number | boolean;
  count?: number;
}

// Async operation states
export type AsyncState<T = unknown, E = Error> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

// Pagination state
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Type-safe environment configuration
 */
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  API_VERSION: string;
  API_TIMEOUT: number;
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG: boolean;
  METRO_API_KEY?: string;
}

/**
 * Application-wide constants type-safe definitions
 */
export const APP_CONSTANTS = {
  // Metro system constants
  SERVICE_HOURS: {
    START: 6,
    END: 23
  },
  
  // UI constants
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 200,
  
  // API constants
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  REQUEST_TIMEOUT: 10000,
  
  // Local storage keys
  STORAGE_KEYS: {
    THEME: 'metro-theme',
    USER_PREFERENCES: 'metro-user-preferences',
    RECENT_SEARCHES: 'metro-recent-searches',
    FAVORITE_STATIONS: 'metro-favorite-stations'
  }
} as const;