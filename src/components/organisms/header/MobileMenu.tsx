"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SearchModal } from "@/components/molecules";
import { Menu, User, UserPlus, LogIn, Train, CreditCard, Info, Building, Route, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressiveDisclosure } from "@/hooks/use-progressive-disclosure";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { SocialIconsGroup } from "./SocialIconsGroup";
import { 
  UI_DIMENSIONS, 
  LOADING_STATES, 
  ARIA_LABELS, 
  ANIMATION,
  CSS_CLASSES 
} from "./constants";
import type { SocialLink } from "./types";

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

interface MobileMenuProps {
  mainNavigation: NavigationItem[];
  socialLinks: SocialLink[];
  isLoggedIn?: boolean;
  userName?: string;
  onLogin?: () => Promise<void>;
  onRegister?: () => Promise<void>;
  isLoginLoading?: boolean;
  isRegisterLoading?: boolean;
}

/**
 * Mobile menu component with navigation, search, and user actions
 * Extracted from main header to improve maintainability
 */
export const MobileMenu = ({
  mainNavigation,
  socialLinks,
  isLoggedIn = false,
  userName,
  onLogin,
  onRegister,
  isLoginLoading = false,
  isRegisterLoading = false,
}: MobileMenuProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen: isDisclosureOpen, toggle: toggleDisclosure } = useProgressiveDisclosure();
  
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const focusTrapRef = useFocusTrap<HTMLDivElement>({
    isActive: isMobileMenuOpen,
    initialFocusRef: mobileMenuTriggerRef,
    onEscape: () => setIsMobileMenuOpen(false)
  });

  // Icon mapping for navigation items
  const getNavigationIcon = (id: string) => {
    switch(id) {
      case 'connections': return Route;
      case 'tarifas': return CreditCard;
      case 'service': return Info;
      case 'corporate': return Building;
      default: return Train;
    }
  };

  const handleLogin = async () => {
    if (onLogin) {
      await onLogin();
    }
  };

  const handleRegister = async () => {
    if (onRegister) {
      await onRegister();
    }
  };

  return (
    <div className="md:landscape:hidden lg:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            ref={mobileMenuTriggerRef}
            variant="ghost"
            size="sm"
            aria-label={ARIA_LABELS.MOBILE_MENU}
            aria-expanded={isMobileMenuOpen}
            aria-controls={ARIA_LABELS.MOBILE_MENU_ID}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          ref={focusTrapRef}
          side="right" 
          className={`w-${UI_DIMENSIONS.MOBILE_MENU_WIDTH.DEFAULT / 4} sm:w-${UI_DIMENSIONS.MOBILE_MENU_WIDTH.SM / 4} p-0 overflow-hidden`}
          id={ARIA_LABELS.MOBILE_MENU_ID}
          aria-labelledby={ARIA_LABELS.MOBILE_MENU_TITLE_ID}
        >
          <SheetHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-metro-red rounded-full flex items-center justify-center">
                <Train className="h-4 w-4 text-white" />
              </div>
              <div>
                <SheetTitle 
                  id={ARIA_LABELS.MOBILE_MENU_TITLE_ID}
                  className="text-left text-lg font-bold text-gray-900 dark:text-gray-100"
                >
                  {ARIA_LABELS.NAVIGATION_TITLE}
                </SheetTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
                  {ARIA_LABELS.METRO_SUBTITLE}
                </p>
              </div>
            </div>
          </SheetHeader>
          
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search Section */}
            <div className="px-6 py-4 flex-shrink-0">
              <SearchModal 
                className="w-full" 
                variant="default"
                size="md"
              />
            </div>

            {/* Navigation Section */}
            <div className="flex-1 px-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {mainNavigation.map((item) => {
                const IconComponent = getNavigationIcon(item.id);
                const itemIsOpen = isDisclosureOpen(item.id);
                
                return (
                  <Collapsible 
                    key={item.id} 
                    className="group" 
                    open={itemIsOpen} 
                    onOpenChange={() => toggleDisclosure(item.id)}
                  >
                    <CollapsibleTrigger 
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleDisclosure(item.id);
                        }
                      }}
                      aria-expanded={itemIsOpen}
                      aria-controls={`collapsible-content-${item.id}`}
                    >
                      <div className="flex items-center gap-3 p-3 bg-black/10 dark:bg-white/10 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-metro-red/30 dark:hover:border-metro-red/30 hover:bg-black/20 dark:hover:bg-white/20 focus-within:ring-2 focus-within:ring-metro-red/30 focus-within:border-metro-red/30 transition-all duration-300 group-hover:shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-metro-red/10 to-metro-orange/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-5 w-5 text-metro-red group-hover:text-metro-orange transition-colors duration-300" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-metro-red transition-colors duration-300 text-sm">
                            {item.label}
                          </h3>
                        </div>
                        {item.children && (
                          <ChevronDown className={cn(
                            "h-6 w-6 text-metro-red dark:text-gray-400 group-hover:text-metro-red transition-all duration-300",
                            itemIsOpen && "rotate-180"
                          )} />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    
                    {item.children && (
                      <CollapsibleContent 
                        className="overflow-hidden"
                        id={`collapsible-content-${item.id}`}
                      >
                        <div className="mt-2 ml-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                          {item.children.map((child, childIndex) => (
                            <a
                              key={child.id}
                              href={child.href}
                              className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:text-metro-red hover:bg-black/20 dark:hover:bg-white/20 focus:text-metro-red focus:bg-black/20 dark:focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-metro-red/30 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                              style={{
                                animationDelay: `${childIndex * ANIMATION.COLLAPSIBLE_DELAY_MULTIPLIER}ms`
                              }}
                              tabIndex={0}
                            >
                              <div className="w-2 h-2 bg-metro-red/40 rounded-full animate-pulse"></div>
                              <span>{child.label}</span>
                            </a>
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              })}
            </div>
            
            {/* User Actions Section */}
            <div className="px-6 py-4 bg-black/5 dark:bg-white/5 flex-shrink-0">
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <button 
                    onClick={handleLogin}
                    disabled={isLoginLoading}
                    className={cn(CSS_CLASSES.BUTTON_PRIMARY, "flex-1")}
                  >
                    {isLoginLoading ? (
                      <div className={cn(CSS_CLASSES.LOADING_SPINNER, "h-3.5 w-3.5")} />
                    ) : (
                      <LogIn className="h-3.5 w-3.5" />
                    )}
                    <span>{isLoginLoading ? LOADING_STATES.LOGIN : LOADING_STATES.LOGIN_BUTTON}</span>
                  </button>
                  <button 
                    onClick={handleRegister}
                    disabled={isRegisterLoading}
                    className={cn(CSS_CLASSES.BUTTON_SECONDARY, "flex-1")}
                  >
                    {isRegisterLoading ? (
                      <div className={cn(CSS_CLASSES.LOADING_SPINNER, "h-3.5 w-3.5")} />
                    ) : (
                      <UserPlus className="h-3.5 w-3.5" />
                    )}
                    <span>{isRegisterLoading ? LOADING_STATES.REGISTER : LOADING_STATES.REGISTER_BUTTON}</span>
                  </button>
                </div>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-turquoise/80 hover:bg-metro-turquoise text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200">
                  <User className="h-3.5 w-3.5" />
                  <span>{userName || ARIA_LABELS.USER_PROFILE}</span>
                </button>
              )}
            </div>

            {/* Social Media Footer */}
            <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-gray-200/30 dark:border-gray-700/30 flex-shrink-0">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {ARIA_LABELS.SOCIAL_FOLLOW}
                </p>
                <SocialIconsGroup 
                  socialLinks={socialLinks}
                  variant="mobile"
                  showTooltip={true}
                />
                <div className="mt-2 flex justify-center items-center gap-2">
                  <div className="w-1 h-1 bg-metro-red rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-metro-red">{ARIA_LABELS.METRO_SUBTITLE}</span>
                  <div className="w-1 h-1 bg-metro-red rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};