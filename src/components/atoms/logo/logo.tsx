"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LogoProps {
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-12", 
  lg: "h-16"
};

export function Logo({ 
  variant = "horizontal", 
  size = "md",
  className,
  href = "/"
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use colorized for light mode and white for dark mode
  const color = mounted && resolvedTheme === "dark" ? "white" : "colorized";
  const logoSrc = `/assets/images/${variant}-logo-${color}.svg`;
  const logoAlt = `Metro de Santiago ${variant} logo`;
  
  const logoImage = (
    <Image
      src={logoSrc}
      alt={logoAlt}
      width={variant === "horizontal" ? 180 : 100}
      height={variant === "horizontal" ? 40 : 80}
      className={cn(sizeClasses[size], "w-auto", className)}
      priority
    />
  );

  if (href) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            href={href}
            className="flex items-center focus:outline-none focus:ring-1 focus:ring-metro-red/60 dark:focus:ring-gray-600/40 focus:ring-offset-1 dark:focus:ring-offset-0 rounded-sm cursor-pointer"
            aria-label="Ir al inicio"
          >
            {logoImage}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Ir al inicio
        </TooltipContent>
      </Tooltip>
    );
  }

  return logoImage;
}