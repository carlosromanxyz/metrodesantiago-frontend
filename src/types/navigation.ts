import { z } from 'zod';

/**
 * Zod schemas for Navigation types
 */

// Navigation Item schema (simplified to avoid recursion issues)
export const NavigationItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().optional(),
  children: z.array(z.any()).optional() // Simplified to avoid recursion
});

// Social Link schema
export const SocialLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().url(),
  icon: z.string().min(1)
});

// Breadcrumb item schema
export const BreadcrumbItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().optional(),
  isCurrentPage: z.boolean().optional()
});

/**
 * TypeScript types inferred from Zod schemas
 */

export type NavigationItem = z.infer<typeof NavigationItemSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type BreadcrumbItem = z.infer<typeof BreadcrumbItemSchema>;

/**
 * Additional navigation-related types
 */

// Navigation dropdown props
export interface NavigationDropdownProps {
  item: NavigationItem;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Navigation link props
export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  icon?: string;
  onClick?: () => void;
}

// Navigation menu configuration
export interface NavigationConfig {
  main: NavigationItem[];
  quick: NavigationItem[];
  user: NavigationItem[];
  social: SocialLink[];
}

// Footer navigation section
export interface FooterSection {
  id: string;
  title: string;
  links: NavigationItem[];
}

// Mobile navigation state
export interface MobileNavigationState {
  isOpen: boolean;
  activeSubmenu: string | null;
}

// Navigation theme configuration
export interface NavigationTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

/**
 * Validation functions
 */

export const validateNavigationItem = (data: unknown): NavigationItem => {
  return NavigationItemSchema.parse(data);
};

export const validateSocialLink = (data: unknown): SocialLink => {
  return SocialLinkSchema.parse(data);
};

export const validateBreadcrumbItem = (data: unknown): BreadcrumbItem => {
  return BreadcrumbItemSchema.parse(data);
};

/**
 * Type guards
 */

export const isNavigationItem = (data: unknown): data is NavigationItem => {
  return NavigationItemSchema.safeParse(data).success;
};

export const isSocialLink = (data: unknown): data is SocialLink => {
  return SocialLinkSchema.safeParse(data).success;
};

export const isBreadcrumbItem = (data: unknown): data is BreadcrumbItem => {
  return BreadcrumbItemSchema.safeParse(data).success;
};

/**
 * Utility functions for navigation
 */

// Check if navigation item has children
export const hasChildren = (item: NavigationItem): boolean => {
  return Boolean(item.children && item.children.length > 0);
};

// Find navigation item by ID recursively
export const findNavigationItem = (
  items: NavigationItem[],
  id: string
): NavigationItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findNavigationItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Get navigation breadcrumbs for a given path
export const getNavigationBreadcrumbs = (
  items: NavigationItem[],
  currentPath: string
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  const findPath = (navItems: NavigationItem[], path: NavigationItem[]): boolean => {
    for (const item of navItems) {
      const newPath = [...path, item];
      
      if (item.href === currentPath) {
        breadcrumbs.push(
          ...newPath.map((navItem, index) => ({
            id: navItem.id,
            label: navItem.label,
            href: index < newPath.length - 1 ? navItem.href : undefined,
            isCurrentPage: index === newPath.length - 1
          }))
        );
        return true;
      }
      
      if (item.children && findPath(item.children, newPath)) {
        return true;
      }
    }
    return false;
  };
  
  findPath(items, []);
  return breadcrumbs;
};

// Flatten navigation items into a single array
export const flattenNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
  const flattened: NavigationItem[] = [];
  
  const flatten = (navItems: NavigationItem[]) => {
    for (const item of navItems) {
      flattened.push(item);
      if (item.children) {
        flatten(item.children);
      }
    }
  };
  
  flatten(items);
  return flattened;
};

// Check if current path matches navigation item
export const isActiveNavigationItem = (
  item: NavigationItem,
  currentPath: string
): boolean => {
  // Exact match
  if (item.href === currentPath) {
    return true;
  }
  
  // Check if current path starts with item href (for parent items)
  if (currentPath.startsWith(item.href) && item.href !== '/') {
    return true;
  }
  
  // Check children recursively
  if (item.children) {
    return item.children.some(child => isActiveNavigationItem(child, currentPath));
  }
  
  return false;
};

/**
 * Constants
 */

export const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  TIKTOK: 'tiktok',
  SPOTIFY: 'spotify',
  YOUTUBE: 'youtube',
  LINKEDIN: 'linkedin'
} as const;

export const ICON_NAMES = {
  HOME: 'home',
  ROUTE: 'route',
  CREDIT_CARD: 'credit-card',
  INFO: 'info',
  BUILDING: 'building',
  ALERT_TRIANGLE: 'alert-triangle',
  FLAG: 'flag',
  ACCESSIBILITY: 'accessibility',
  LOG_IN: 'log-in',
  USER_PLUS: 'user-plus',
  USER: 'user',
  MUSIC: 'music'
} as const;