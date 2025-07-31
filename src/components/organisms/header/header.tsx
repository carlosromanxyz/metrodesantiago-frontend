"use client";

import { Logo, ModeToggle, Breadcrumb, SkipNavigation } from "@/components/atoms";
import { 
  NavigationDropdown, 
  SearchModal, 
  UserAccountIcons 
} from "@/components/molecules";
import { 
  mainNavigation, 
  userNavigation,
  socialLinks 
} from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
import { Menu, Search, User, UserPlus, LogIn, Train, CreditCard, Info, Building, Route, ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok, FaSpotify } from "react-icons/fa";
import { useState, useRef } from "react";
import { useProgressiveDisclosure } from "@/hooks/use-progressive-disclosure";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface HeaderProps {
  className?: string;
  isLoggedIn?: boolean;
  userName?: string;
}

// Simplified icon mapping utility
const getSocialIcon = (social: { id: string; icon: string }) => {
  const iconMap = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    twitter: FaTwitter,
    tiktok: FaTiktok,
    spotify: FaSpotify,
  };
  
  if (social.icon === 'music') {
    return social.id === 'tiktok' ? iconMap.tiktok : iconMap.spotify;
  }
  
  return iconMap[social.icon as keyof typeof iconMap] || FaFacebookF;
};

export function Header({ className, isLoggedIn = false, userName }: HeaderProps) {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen: isDisclosureOpen, toggle: toggleDisclosure } = useProgressiveDisclosure();
  
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const focusTrapRef = useFocusTrap({
    isActive: isMobileMenuOpen,
    initialFocusRef: mobileMenuTriggerRef,
    onEscape: () => setIsMobileMenuOpen(false)
  });

  const handleLogin = async () => {
    setIsLoginLoading(true);
    // TODO: Implement login logic
    setTimeout(() => setIsLoginLoading(false), 1000); // Simulate loading
  };

  const handleRegister = async () => {
    setIsRegisterLoading(true);
    // TODO: Implement register logic
    setTimeout(() => setIsRegisterLoading(false), 1000); // Simulate loading
  };
  return (
    <>
      <SkipNavigation />
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="container mx-auto">
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
            <div className="hidden xl:flex items-center space-x-2">
              {socialLinks.map((social) => {
                const IconComponent = getSocialIcon(social);
                return (
                  <Tooltip key={social.id}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-black/20 dark:hover:bg-white/20 hover:text-metro-red dark:hover:text-white focus:bg-black/20 dark:focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-metro-red/30 transition-all duration-200 touch-manipulation"
                        aria-label={social.label}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Desktop navigation and icons section */}
          <div className="hidden md:landscape:flex lg:flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              {mainNavigation.map((item) => (
                <NavigationDropdown key={item.id} item={item} />
              ))}
            </nav>

            {/* Icons section */}
            <div className="flex items-center">
              <SearchModal className="hidden md:landscape:block lg:block" />
              
              <ModeToggle />
              
              <UserAccountIcons
                userNavigation={userNavigation}
                isLoggedIn={isLoggedIn}
                userName={userName}
                className="hidden xl:flex"
              />
            </div>
          </div>

          {/* Mobile/Tablet Portrait icons section */}
          <div className="md:landscape:hidden lg:hidden flex items-center">
            <SearchModal className="hidden md:block" />
            
            <ModeToggle />
            
            <UserAccountIcons
              userNavigation={userNavigation}
              isLoggedIn={isLoggedIn}
              userName={userName}
              className="hidden xl:flex"
            />

            {/* Mobile menu button */}
            <div className="md:landscape:hidden lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    ref={mobileMenuTriggerRef}
                    variant="ghost"
                    size="sm"
                    aria-label="Abrir menú de navegación"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-navigation-menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  ref={focusTrapRef as React.RefObject<HTMLDivElement>}
                  side="right" 
                  className="w-80 sm:w-96 p-0 overflow-hidden"
                  id="mobile-navigation-menu"
                  aria-labelledby="mobile-menu-title"
                >
                  <SheetHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-metro-red rounded-full flex items-center justify-center">
                        <Train className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <SheetTitle 
                          id="mobile-menu-title"
                          className="text-left text-lg font-bold text-gray-900 dark:text-gray-100"
                        >
                          Navegación
                        </SheetTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
                          Metro de Santiago
                        </p>
                      </div>
                    </div>
                  </SheetHeader>
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Functional Search */}
                    <div className="px-6 py-4 flex-shrink-0">
                      <SearchModal className="w-full" />
                    </div>

                    {/* Elegant List Sections */}
                    <div className="flex-1 px-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {mainNavigation.map((item) => {
                        const getIcon = (id: string) => {
                          switch(id) {
                            case 'connections': return Route;
                            case 'tarifas': return CreditCard;
                            case 'service': return Info;
                            case 'corporate': return Building;
                            default: return Train;
                          }
                        };
                        const IconComponent = getIcon(item.id);
                        
                        const itemIsOpen = isDisclosureOpen(item.id);
                        
                        return (
                          <Collapsible key={item.id} className="group" open={itemIsOpen} onOpenChange={() => toggleDisclosure(item.id)}>
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
                                        animationDelay: `${childIndex * 50}ms`
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
                    
                    {/* CTA Buttons - Smaller and Softer */}
                    <div className="px-6 py-4 bg-black/5 dark:bg-white/5 flex-shrink-0">
                      {!isLoggedIn ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={handleLogin}
                            disabled={isLoginLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-red/80 hover:bg-metro-red disabled:bg-metro-red/50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            {isLoginLoading ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <LogIn className="h-3.5 w-3.5" />
                            )}
                            <span>{isLoginLoading ? 'Ingresando...' : 'Ingresar'}</span>
                          </button>
                          <button 
                            onClick={handleRegister}
                            disabled={isRegisterLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-orange/80 hover:bg-metro-orange disabled:bg-metro-orange/50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            {isRegisterLoading ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <UserPlus className="h-3.5 w-3.5" />
                            )}
                            <span>{isRegisterLoading ? 'Registrando...' : 'Registro'}</span>
                          </button>
                        </div>
                      ) : (
                        <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-turquoise/80 hover:bg-metro-turquoise text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200">
                          <User className="h-3.5 w-3.5" />
                          <span>{userName || "Mi Perfil"}</span>
                        </button>
                      )}
                    </div>

                    {/* Footer with Social Media Icons */}
                    <div className="px-6 py-4 bg-black/5 dark:bg-white/5 border-t border-gray-200/30 dark:border-gray-700/30 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Síguenos en nuestras redes
                        </p>
                        <div className="flex justify-center items-center gap-2">
                          {socialLinks.map((social) => {
                            const IconComponent = getSocialIcon(social);
                            return (
                              <Tooltip key={social.id}>
                                <TooltipTrigger asChild>
                                  <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-black/20 dark:hover:bg-white/20 hover:text-metro-red dark:hover:text-white focus:bg-black/20 dark:focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-metro-red/30 transition-all duration-200 hover:scale-105 touch-manipulation"
                                    aria-label={social.label}
                                  >
                                    <IconComponent className="h-5 w-5" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{social.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                        <div className="mt-2 flex justify-center items-center gap-2">
                          <div className="w-1 h-1 bg-metro-red rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-metro-red">Metro de Santiago</span>
                          <div className="w-1 h-1 bg-metro-red rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

        </header>
        
        {/* Mobile breadcrumb */}
        <div className="md:landscape:hidden lg:hidden">
          <Breadcrumb 
            variant="mobile" 
            maxItems={3}
            showHome={true}
            className="mx-auto"
          />
        </div>
      </div>
    </>
  );
}