"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-12 w-12"
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
};

export function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  onClick,
  disabled = false,
  href
}: IconButtonProps) {
  const buttonClass = cn(
    sizeClasses[size],
    "flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-metro-red hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-metro-red/60 dark:focus:ring-gray-600/40 focus:ring-offset-1 dark:focus:ring-offset-0 transition-colors rounded-sm cursor-pointer",
    className
  );

  const content = (
    <Icon 
      className={iconSizeClasses[size]} 
      aria-hidden="true"
    />
  );

  if (href) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            className={buttonClass}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        </TooltipTrigger>
        <TooltipContent className="hidden md:block">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={buttonClass}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          {content}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="hidden md:block">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}