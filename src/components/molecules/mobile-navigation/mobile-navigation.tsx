"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileMenu } from "@/components/molecules";
import { Menu } from "lucide-react";
import type { NavigationItem, SocialLink } from "@/types/navigation";

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  socialLinks: SocialLink[];
  isLoggedIn: boolean;
  userName?: string;
  className?: string;
}

export function MobileNavigation({ 
  navigationItems, 
  socialLinks, 
  isLoggedIn, 
  userName,
  className = ""
}: MobileNavigationProps) {
  return (
    <div className={`md:landscape:hidden lg:hidden ${className}`}>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] touch-manipulation"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 sm:w-96 p-0 overflow-hidden">
          <MobileMenu
            navigationItems={navigationItems}
            socialLinks={socialLinks}
            isLoggedIn={isLoggedIn}
            userName={userName}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}