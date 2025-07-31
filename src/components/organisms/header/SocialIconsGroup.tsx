"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getSocialIconComponent, type SocialLink } from "./types";
import { CSS_CLASSES } from "./constants";

interface SocialIconsGroupProps {
  socialLinks: SocialLink[];
  className?: string;
  variant?: 'desktop' | 'mobile';
  showTooltip?: boolean;
}

/**
 * Reusable component for displaying social media icons
 * Used in both desktop header and mobile menu footer
 */
export function SocialIconsGroup({ 
  socialLinks, 
  className,
  variant = 'desktop',
  showTooltip = true 
}: SocialIconsGroupProps) {
  const containerClasses = cn(
    "flex items-center",
    variant === 'desktop' ? "space-x-2" : "gap-2 justify-center",
    className
  );

  const iconClasses = cn(
    CSS_CLASSES.TOUCH_TARGET,
    CSS_CLASSES.SOCIAL_ICON_BASE,
    variant === 'mobile' && "hover:scale-105"
  );

  return (
    <div className={containerClasses}>
      {socialLinks.map((social) => {
        const IconComponent = getSocialIconComponent(social);
        
        const iconLink = (
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={iconClasses}
            aria-label={social.label}
          >
            <IconComponent className="h-5 w-5" />
          </a>
        );

        if (!showTooltip) {
          return <div key={social.id}>{iconLink}</div>;
        }

        return (
          <Tooltip key={social.id}>
            <TooltipTrigger asChild>
              {iconLink}
            </TooltipTrigger>
            <TooltipContent>
              <p>{social.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}