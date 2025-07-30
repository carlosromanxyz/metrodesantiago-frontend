"use client";

import { Logo } from "@/components/atoms";
import { 
  HeaderContainer,
  SocialLinks,
  DesktopNavigation,
  UserSection,
  MobileNavigation
} from "@/components/molecules";
import { 
  mainNavigation, 
  userNavigation,
  socialLinks 
} from "@/data/navigation";

interface HeaderProps {
  className?: string;
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({ className, isLoggedIn = false, userName }: HeaderProps) {
  return (
    <HeaderContainer className={className}>
      {/* Left section: Logo + Social media icons */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo 
            variant="horizontal" 
            size="md"
            className="h-10"
          />
        </div>
        
        {/* Social media icons - Desktop only (hide on tablets) */}
        <SocialLinks
          socialLinks={socialLinks}
          className="hidden xl:flex"
        />
      </div>

      {/* Desktop navigation and icons section */}
      <div className="hidden md:landscape:flex lg:flex items-center space-x-4">
        <DesktopNavigation navigationItems={mainNavigation} />
        <UserSection
          userNavigation={userNavigation}
          isLoggedIn={isLoggedIn}
          userName={userName}
          showSearchDesktop={true}
          showSearchMobile={false}
          showUserIcons={true}
        />
      </div>

      {/* Mobile/Tablet Portrait icons section */}
      <div className="md:landscape:hidden lg:hidden flex items-center">
        <UserSection
          userNavigation={userNavigation}
          isLoggedIn={isLoggedIn}
          userName={userName}
          showSearchDesktop={false}
          showSearchMobile={true}
          showUserIcons={true}
        />

        {/* Mobile Navigation */}
        <MobileNavigation
          navigationItems={mainNavigation}
          socialLinks={socialLinks}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      </div>
    </HeaderContainer>
  );
}