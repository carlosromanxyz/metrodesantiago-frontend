"use client";

import { useState } from "react";
import { Logo, ModeToggle } from "@/components/atoms";
import { 
  NavigationDropdown, 
  SearchModal, 
  UserAccountIcons 
} from "@/components/molecules";
import { 
  mainNavigation, 
  userNavigation 
} from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  className?: string;
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({ className, isLoggedIn = false, userName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={cn("bg-white dark:bg-black shadow-lg sticky top-4 z-50 mx-4 rounded-lg border border-gray-100 dark:border-gray-800 max-w-6xl mx-auto", className)}>
      {/* Main header */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo 
              variant="horizontal" 
              size="md"
              className="h-10"
            />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {mainNavigation.map((item) => (
              <NavigationDropdown key={item.id} item={item} />
            ))}
          </nav>

          {/* Icons section */}
          <div className="flex items-center">
            <SearchModal className="hidden md:block" />
            
            <ModeToggle />
            
            <UserAccountIcons
              userNavigation={userNavigation}
              isLoggedIn={isLoggedIn}
              userName={userName}
              className="hidden md:flex"
            />

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Abrir menú de navegación"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search and icons */}
      <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 rounded-b-lg flex items-center justify-center">
        <SearchModal />
        <ModeToggle />
        <UserAccountIcons
          userNavigation={userNavigation}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      </div>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black rounded-b-lg">
          <div className="px-4 py-6 space-y-6">
            {mainNavigation.map((item) => (
              <div key={item.id} className="space-y-2">
                <a
                  href={item.href}
                  className="block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-metro-red"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4 space-y-2">
                    {item.children.map((child) => (
                      <a
                        key={child.id}
                        href={child.href}
                        className="block text-sm text-gray-600 dark:text-gray-300 hover:text-metro-red"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
          </div>
        </div>
      )}
    </header>
  );
}