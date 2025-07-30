"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  icon?: LucideIcon;
  hasDropdown?: boolean;
  variant?: "primary" | "secondary" | "footer";
}

export function NavLink({
  href,
  children,
  icon: Icon,
  hasDropdown = false,
  isActive,
  variant = "primary",
  className,
  onClick
}: NavLinkProps) {
  const pathname = usePathname();
  const active = isActive ?? (pathname === href || pathname.startsWith(href + "/"));

  const baseClasses = "flex items-center gap-2 transition-colors focus:outline-none focus:ring-1 focus:ring-metro-red/60 dark:focus:ring-gray-600/40 focus:ring-offset-1 dark:focus:ring-offset-0 rounded-sm cursor-pointer touch-manipulation";
  
  const variantClasses = {
    primary: cn(
      "px-3 py-2 min-h-[44px] sm:min-h-[32px] text-sm font-medium hover:text-metro-orange hover:bg-black/20 dark:hover:bg-white/20",
      active ? "text-metro-orange bg-metro-orange/20 underline decoration-metro-orange underline-offset-4" : "text-gray-700 dark:text-gray-200 hover:text-metro-orange"
    ),
    secondary: cn(
      "px-2 py-1 min-h-[44px] text-xs hover:text-metro-orange hover:bg-black/20 dark:hover:bg-white/20",
      active ? "text-metro-orange bg-metro-orange/20" : "text-gray-600 dark:text-gray-300"
    ),
    footer: "text-sm min-h-[44px] text-gray-600 dark:text-gray-300 hover:text-metro-orange hover:bg-black/20 dark:hover:bg-white/20"
  };

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      {hasDropdown && <ChevronDown className="h-3 w-3" />}
    </>
  );

  return (
    <Link
      href={href}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {content}
    </Link>
  );
}