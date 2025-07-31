import type { ComponentType } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok, FaSpotify } from 'react-icons/fa';

/**
 * Social media platform identifiers
 */
export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram', 
  TWITTER = 'twitter',
  TIKTOK = 'tiktok',
  SPOTIFY = 'spotify',
}

/**
 * Icon types that may be used for social platforms
 */
export enum SocialIconType {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter', 
  MUSIC = 'music', // Generic music icon type
}

/**
 * Type-safe mapping of social platforms to their React icon components
 */
export const SOCIAL_ICON_MAP: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  [SocialPlatform.FACEBOOK]: FaFacebookF,
  [SocialPlatform.INSTAGRAM]: FaInstagram,
  [SocialPlatform.TWITTER]: FaTwitter,
  [SocialPlatform.TIKTOK]: FaTiktok,
  [SocialPlatform.SPOTIFY]: FaSpotify,
} as const;

/**
 * Social link interface matching the expected data structure
 */
export interface SocialLink {
  id: string;
  icon: string;
  href: string;
  label: string;
}

/**
 * Type guard to check if a string is a valid SocialPlatform
 */
export function isSocialPlatform(value: string): value is SocialPlatform {
  return Object.values(SocialPlatform).includes(value as SocialPlatform);
}

/**
 * Type-safe function to get social icon component
 * Handles the special case where 'music' icon type maps to different platforms
 */
export function getSocialIconComponent(social: SocialLink): ComponentType<{ className?: string }> {
  // Handle special case for music icon type
  if (social.icon === SocialIconType.MUSIC) {
    if (social.id === SocialPlatform.TIKTOK) {
      return SOCIAL_ICON_MAP[SocialPlatform.TIKTOK];
    }
    if (social.id === SocialPlatform.SPOTIFY) {
      return SOCIAL_ICON_MAP[SocialPlatform.SPOTIFY];
    }
    // Default to Spotify for unknown music platforms
    return SOCIAL_ICON_MAP[SocialPlatform.SPOTIFY];
  }

  // Handle direct platform mapping
  if (isSocialPlatform(social.icon)) {
    return SOCIAL_ICON_MAP[social.icon as SocialPlatform];
  }

  // If the social.id is a valid platform, use that
  if (isSocialPlatform(social.id)) {
    return SOCIAL_ICON_MAP[social.id as SocialPlatform];
  }

  // Fallback to Facebook icon for unknown platforms
  return SOCIAL_ICON_MAP[SocialPlatform.FACEBOOK];
}

/**
 * Navigation icon mapping for mobile menu
 */
export enum NavigationIconType {
  CONNECTIONS = 'connections',
  TARIFAS = 'tarifas',
  SERVICE = 'service',
  CORPORATE = 'corporate',
}

/**
 * Header component props interface
 */
export interface HeaderProps {
  className?: string;
  isLoggedIn?: boolean;
  userName?: string;
}