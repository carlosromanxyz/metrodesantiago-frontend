"use client";

import { NavigationDropdown, SearchModal, UserAccountIcons } from "@/components/molecules";
import { ModeToggle } from "@/components/atoms";

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

interface UserNavigationItem {
  id: string;
  label: string;
  href: string;
}

interface DesktopNavigationProps {
  mainNavigation: NavigationItem[];
  userNavigation: UserNavigationItem[];
  isLoggedIn?: boolean;
  userName?: string;
}

/**
 * Desktop navigation component with main navigation, search, and user icons
 * Separated from main header for better maintainability
 */
export function DesktopNavigation({
  mainNavigation,
  userNavigation,
  isLoggedIn = false,
  userName,
}: DesktopNavigationProps) {
  return (
    <div className="hidden md:landscape:flex lg:flex items-center space-x-4">
      {/* Main Navigation */}
      <nav className="flex items-center space-x-4">
        {mainNavigation.map((item) => (
          <NavigationDropdown key={item.id} item={item} />
        ))}
      </nav>

      {/* Action Icons Section */}
      <div className="flex items-center">
        <SearchModal 
          className="hidden md:landscape:block lg:block" 
          variant="subdued"
          size="sm"
        />
        
        <ModeToggle />
        
        <UserAccountIcons
          userNavigation={userNavigation}
          isLoggedIn={isLoggedIn}
          userName={userName}
          className="hidden xl:flex"
        />
      </div>
    </div>
  );
}