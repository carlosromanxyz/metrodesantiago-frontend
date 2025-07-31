"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavigation, NavigationItem } from "@/data/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {	
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  variant?: "mobile" | "desktop";
}

export function Breadcrumb({ 
  className, 
  maxItems = 4, 
  showHome = true,
  variant = "desktop"
}: BreadcrumbProps) {
  const pathname = usePathname();

  const findBreadcrumbPath = (
    items: NavigationItem[],
    currentPath: string,
    parentPath: BreadcrumbItem[] = []
  ): BreadcrumbItem[] | null => {
    for (const item of items) {
      const itemPath = [...parentPath, { label: item.label, href: item.href }];
      
      // Check if current path matches this item
      if (currentPath === item.href || currentPath.startsWith(item.href + "/")) {
        // If this item has children, check if we can go deeper
        if (item.children) {
          const childPath = findBreadcrumbPath(item.children, currentPath, itemPath);			
          if (childPath) return childPath;
        }
        return itemPath;
      }
    }
    return null;
  };

  const breadcrumbPath = findBreadcrumbPath(mainNavigation, pathname);
  
  if (!breadcrumbPath || breadcrumbPath.length === 0) {
    return null;
  }

  // Add home breadcrumb if requested and not already present
  const fullPath = showHome && breadcrumbPath[0]?.href !== "/" 
    ? [{ label: "Inicio", href: "/" }, ...breadcrumbPath]
    : breadcrumbPath;

  // Limit breadcrumb items if needed
  const displayPath = fullPath.length > maxItems 
    ? [
        fullPath[0], 
        { label: "...", href: "#", isActive: false }, 
        ...fullPath.slice(-maxItems + 2)
      ]
    : fullPath;

  // Mark the last item as active
  if (displayPath.length > 0) {
    displayPath[displayPath.length - 1].isActive = true;
  }

  const isMobile = variant === "mobile";

  return (
    <nav 
      className={cn(
        "flex items-center space-x-1 text-sm",
        isMobile ? "px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800" : "",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {displayPath.map((item, index) => {
          const isLast = index === displayPath.length - 1;
          
          return (
            <li key={`${item.href}-${index}`} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="h-4 w-4 text-gray-400 dark:text-gray-600 mx-1 flex-shrink-0" 
                  aria-hidden="true"
                />
              )}
              
              {item.href === "#" ? (
                <span className="text-gray-500 dark:text-gray-400 px-1">
                  {item.label}
                </span>
              ) : isLast ? (
                <span 
                  className={cn(
                    "font-medium px-1",
                    isMobile 
                      ? "text-metro-red dark:text-metro-orange" 
                      : "text-gray-900 dark:text-gray-100"
                  )}
                  aria-current="page"
                >
                  {isMobile && index === 0 && item.href === "/" ? (
                    <Home className="h-4 w-4" aria-label={item.label} />
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-metro-red dark:hover:text-metro-orange transition-colors px-1 rounded focus:outline-none focus:ring-2 focus:ring-metro-red/30",
                    isMobile 
                      ? "text-gray-600 dark:text-gray-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {isMobile && index === 0 && item.href === "/" ? (
                    <Home className="h-4 w-4" aria-label={item.label} />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}