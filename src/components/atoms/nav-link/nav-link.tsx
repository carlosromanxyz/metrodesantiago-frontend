"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  hasDropdown?: boolean;
  isActive?: boolean;
  variant?: "primary" | "secondary" | "footer";
  className?: string;
  onClick?: () => void;
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

  const baseClasses = "flex items-center gap-2 transition-colors focus:outline-none focus:ring-1 focus:ring-metro-red/60 dark:focus:ring-gray-600/40 focus:ring-offset-1 dark:focus:ring-offset-0 rounded-sm cursor-pointer";
  
  const variantClasses = {
    primary: cn(
      "px-3 py-2 text-sm font-medium hover:text-metro-red hover:bg-gray-50 dark:hover:bg-gray-900",
      active ? "text-metro-red underline decoration-metro-red underline-offset-4" : "text-gray-700 dark:text-gray-200 hover:text-metro-red"
    ),
    secondary: cn(
      "px-2 py-1 text-xs hover:text-metro-red hover:bg-gray-50 dark:hover:bg-gray-900",
      active ? "text-metro-red" : "text-gray-600 dark:text-gray-300"
    ),
    footer: "text-sm text-gray-600 dark:text-gray-300 hover:text-metro-red hover:bg-gray-50 dark:hover:bg-gray-900"
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