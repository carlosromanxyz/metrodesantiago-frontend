import { z } from 'zod';
import type { ReactNode } from 'react';
import type { LineIndicatorData } from './metro';

/**
 * Common UI component props and types
 */

// Common size variants used across components
export const SizeVariantSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);
export type SizeVariant = z.infer<typeof SizeVariantSchema>;

// Common color variants
export const ColorVariantSchema = z.enum([
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
]);
export type ColorVariant = z.infer<typeof ColorVariantSchema>;

// Common button variants
export const ButtonVariantSchema = z.enum([
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link'
]);
export type ButtonVariant = z.infer<typeof ButtonVariantSchema>;

/**
 * Component-specific prop interfaces
 */

// Base component props that most components extend
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Line Indicator component props
export interface LineIndicatorProps {
  lineNumber: number;
  hexColor: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Multi Line Indicator component props
export interface MultiLineIndicatorProps {
  lines: LineIndicatorData[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  maxVisible?: number;
}

// Search Input component props
export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Icon Button component props
export interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: SizeVariant;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Section Title component props
export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  alignment?: 'left' | 'center' | 'right';
}

// Logo component props
export interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'symbol';
  theme?: 'light' | 'dark' | 'colorized';
  size?: SizeVariant;
  className?: string;
}

// Modal component props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscapeKey?: boolean;
}

// Combobox option interface
export interface ComboboxOption {
  value: string;
  label: string;
  lines?: LineIndicatorData[];
  disabled?: boolean;
  group?: string;
}

// Combobox component props
export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

// Carousel slide interface
export interface CarouselSlide {
  id: string;
  backgroundImage: string;
  backgroundPosition?: string;
  title?: string;
  description?: string;
  cta?: {
    text: string;
    href: string;
  };
}

// Hero Carousel component props
export interface HeroCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
  showControls?: boolean;
  showIndicators?: boolean;
  showPlayPause?: boolean;
}

// Schedule Indicator component props
export interface ScheduleIndicatorProps {
  className?: string;
  showDetailed?: boolean;
}

// Network Status component props
export interface NetworkStatusProps {
  className?: string;
  currentStatus?: 'available' | 'partially-available' | 'not-available' | 'closed';
}

// Toast notification interface
export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ColorVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// Form field props
export interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

// Badge component props
export interface BadgeProps extends BaseComponentProps {
  variant?: ColorVariant;
  size?: SizeVariant;
}

// Skeleton component props
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

// Data table column definition
export interface DataTableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

// Data table props
export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  className?: string;
}

/**
 * Theme-related types
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  radius: string;
  fontFamily: string;
}

/**
 * Animation and transition types
 */

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface TransitionConfig {
  enter: AnimationConfig;
  exit: AnimationConfig;
}

/**
 * Responsive breakpoint types
 */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

/**
 * Validation functions
 */

export const validateSizeVariant = (data: unknown): SizeVariant => {
  return SizeVariantSchema.parse(data);
};

export const validateColorVariant = (data: unknown): ColorVariant => {
  return ColorVariantSchema.parse(data);
};

export const validateButtonVariant = (data: unknown): ButtonVariant => {
  return ButtonVariantSchema.parse(data);
};

/**
 * Type guards
 */

export const isSizeVariant = (data: unknown): data is SizeVariant => {
  return SizeVariantSchema.safeParse(data).success;
};

export const isColorVariant = (data: unknown): data is ColorVariant => {
  return ColorVariantSchema.safeParse(data).success;
};

export const isButtonVariant = (data: unknown): data is ButtonVariant => {
  return ButtonVariantSchema.safeParse(data).success;
};

/**
 * Utility types
 */

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Extract component props from React component
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Omit className from props (useful for compound components)
export type WithoutClassName<T> = Omit<T, 'className'>;

// Add className to props (useful for making components styleable)
export type WithClassName<T> = T & { className?: string };

/**
 * Constants
 */

export const SIZE_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
} as const;

export const SPACING_SCALE = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem'
} as const;

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
} as const;