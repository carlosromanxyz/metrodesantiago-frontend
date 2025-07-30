"use client";

import { ModeToggle } from "@/components/atoms";
import { SearchModal, UserAccountIcons } from "@/components/molecules";
import type { NavigationItem } from "@/types/navigation";

interface UserSectionProps {
  userNavigation: NavigationItem[];
  isLoggedIn: boolean;
  userName?: string;
  showSearchDesktop?: boolean;
  showSearchMobile?: boolean;
  showUserIcons?: boolean;
  className?: string;
}

export function UserSection({ 
  userNavigation, 
  isLoggedIn, 
  userName,
  showSearchDesktop = true,
  showSearchMobile = false,
  showUserIcons = true,
  className = ""
}: UserSectionProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Search Modal - Desktop */}
      {showSearchDesktop && (
        <SearchModal className="hidden md:landscape:block lg:block" />
      )}
      
      {/* Search Modal - Mobile/Tablet */}
      {showSearchMobile && (
        <SearchModal className="hidden md:block" />
      )}
      
      {/* Mode Toggle */}
      <ModeToggle />
      
      {/* User Account Icons */}
      {showUserIcons && (
        <UserAccountIcons
          userNavigation={userNavigation}
          isLoggedIn={isLoggedIn}
          userName={userName}
          className="hidden xl:flex"
        />
      )}
    </div>
  );
}