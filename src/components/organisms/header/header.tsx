"use client";

import { Logo, Breadcrumb, SkipNavigation, ModeToggle } from "@/components/atoms";
import { SearchModal, UserAccountIcons } from "@/components/molecules";
import { 
  mainNavigation, 
  userNavigation,
  socialLinks 
} from "@/data/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Header-specific components
import { SocialIconsGroup } from "./SocialIconsGroup";
import { MobileMenu } from "./MobileMenu";
import { DesktopNavigation } from "./DesktopNavigation";
import { HeaderErrorBoundary, SilentErrorBoundary } from "./ErrorBoundary";
import { ANIMATION_DELAYS, Z_INDEX } from "./constants";
import type { HeaderProps } from "./types";


export function Header({ className, isLoggedIn = false, userName }: HeaderProps) {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoginLoading(true);
    // TODO: Implement login logic
    setTimeout(() => setIsLoginLoading(false), ANIMATION_DELAYS.LOADING_SIMULATION);
  };

  const handleRegister = async () => {
    setIsRegisterLoading(true);
    // TODO: Implement register logic
    setTimeout(() => setIsRegisterLoading(false), ANIMATION_DELAYS.LOADING_SIMULATION);
  };
  return (
    <>
      <SkipNavigation />
      <div className={`fixed top-0 left-0 right-0 z-${Z_INDEX.HEADER} px-4 sm:px-6 lg:px-8 pt-4`}>
        <div className="container mx-auto">
          <HeaderErrorBoundary>
            <header className={cn("bg-white dark:bg-black shadow-lg rounded-lg border border-gray-100 dark:border-gray-800", className)}>
              {/* Main header */}
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
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
                    <SilentErrorBoundary>
                      <div className="hidden xl:flex items-center space-x-2">
                        <SocialIconsGroup 
                          socialLinks={socialLinks}
                          variant="desktop"
                          showTooltip={true}
                        />
                      </div>
                    </SilentErrorBoundary>
                  </div>

                  {/* Desktop navigation and icons section */}
                  <HeaderErrorBoundary>
                    <DesktopNavigation
                      mainNavigation={mainNavigation}
                      userNavigation={userNavigation}
                      isLoggedIn={isLoggedIn}
                      userName={userName}
                    />
                  </HeaderErrorBoundary>

                  {/* Mobile/Tablet Portrait icons section */}
                  <div className="md:landscape:hidden lg:hidden flex items-center">
                    <SearchModal 
                      className="hidden md:block" 
                      variant="subdued"
                      size="sm"
                    />
                    
                    <ModeToggle />
                    
                    <SilentErrorBoundary>
                      <UserAccountIcons
                        userNavigation={userNavigation}
                        isLoggedIn={isLoggedIn}
                        userName={userName}
                        className="hidden xl:flex"
                      />
                    </SilentErrorBoundary>

                    {/* Mobile menu */}
                    <HeaderErrorBoundary>
                      <MobileMenu
                        mainNavigation={mainNavigation}
                        socialLinks={socialLinks}
                        isLoggedIn={isLoggedIn}
                        userName={userName}
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                        isLoginLoading={isLoginLoading}
                        isRegisterLoading={isRegisterLoading}
                      />
                    </HeaderErrorBoundary>
                  </div>
                </div>
              </div>
            </header>
          </HeaderErrorBoundary>
          
          {/* Mobile breadcrumb */}
          <SilentErrorBoundary>
            <div className="md:landscape:hidden lg:hidden">
              <Breadcrumb 
                variant="mobile" 
                maxItems={3}
                showHome={true}
                className="mx-auto"
              />
            </div>
          </SilentErrorBoundary>
        </div>
      </div>
    </>
  );
}