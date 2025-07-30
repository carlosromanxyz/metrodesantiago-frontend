"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok, FaSpotify } from "react-icons/fa";
import type { SocialLink } from "@/types/navigation";

interface SocialLinksProps {
  socialLinks: SocialLink[];
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export function SocialLinks({ 
  socialLinks, 
  className = "", 
  iconSize = "md",
  showTooltip = true 
}: SocialLinksProps) {
  const getIconComponent = (social: SocialLink) => {
    switch (social.icon) {
      case 'facebook':
        return FaFacebookF;
      case 'instagram':
        return FaInstagram;
      case 'twitter':
        return FaTwitter;
      case 'music':
        return social.id === 'tiktok' ? FaTiktok : FaSpotify;
      default:
        return FaFacebookF;
    }
  };

  const getIconSizeClass = () => {
    switch (iconSize) {
      case 'sm':
        return 'h-3.5 w-3.5';
      case 'md':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  const socialLinkElement = (social: SocialLink) => {
    const IconComponent = getIconComponent(social);
    
    return (
      <a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-black/20 dark:hover:bg-white/20 hover:text-metro-red dark:hover:text-white transition-all duration-200 hover:scale-110 touch-manipulation"
        aria-label={social.label}
      >
        <IconComponent className={getIconSizeClass()} />
      </a>
    );
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {socialLinks.map((social) => (
        showTooltip ? (
          <Tooltip key={social.id}>
            <TooltipTrigger asChild>
              {socialLinkElement(social)}
            </TooltipTrigger>
            <TooltipContent>
              <p>{social.label}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div key={social.id}>
            {socialLinkElement(social)}
          </div>
        )
      ))}
    </div>
  );
}