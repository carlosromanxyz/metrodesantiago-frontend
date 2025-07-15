"use client";

import { IconButton } from "@/components/atoms";
import { SocialLink } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Music, 
  Youtube,
  LucideIcon
} from "lucide-react";

interface SocialMediaGroupProps {
  socialLinks: SocialLink[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  music: Music, // TikTok
  youtube: Youtube
};

export function SocialMediaGroup({ 
  socialLinks, 
  className,
  size = "md" 
}: SocialMediaGroupProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {socialLinks.map((social) => {
        const IconComponent = iconMap[social.icon];
        
        if (!IconComponent) return null;
        
        return (
          <IconButton
            key={social.id}
            icon={IconComponent}
            label={social.label}
            href={social.href}
            size={size}
            variant="ghost"
            className="text-gray-600 hover:text-metro-red"
          />
        );
      })}
    </div>
  );
}