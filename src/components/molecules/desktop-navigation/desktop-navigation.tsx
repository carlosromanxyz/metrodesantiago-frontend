"use client";

import { NavigationDropdown } from "@/components/molecules";
import type { NavigationItem } from "@/types/navigation";

interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
  className?: string;
}

export function DesktopNavigation({ navigationItems, className = "" }: DesktopNavigationProps) {
  return (
    <div className={`hidden md:landscape:flex lg:flex items-center space-x-4 ${className}`}>
      <nav className="flex items-center space-x-4">
        {navigationItems.map((item) => (
          <NavigationDropdown key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
}