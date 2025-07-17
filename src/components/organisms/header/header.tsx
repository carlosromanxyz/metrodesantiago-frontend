"use client";

import { Logo, ModeToggle } from "@/components/atoms";
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

interface HeaderProps {
  className?: string;
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({ className, isLoggedIn = false, userName }: HeaderProps) {
  return (
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
                const IconComponent = social.icon === 'facebook' ? FaFacebookF : 
                                    social.icon === 'instagram' ? FaInstagram :
                                    social.icon === 'twitter' ? FaTwitter :
                                    social.icon === 'music' && social.id === 'tiktok' ? FaTiktok :
                                    social.icon === 'music' && social.id === 'spotify' ? FaSpotify :
                                    FaFacebookF;
                return (
                  <Tooltip key={social.id}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-black/20 dark:hover:bg-white/20 hover:text-metro-red dark:hover:text-white transition-all duration-200"
                        aria-label={social.label}
                      >
                        <IconComponent className="h-4 w-4" />
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
                className="hidden md:landscape:flex lg:flex"
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
              className="hidden md:flex"
            />

            {/* Mobile menu button */}
            <div className="md:landscape:hidden lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Abrir menú de navegación"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96 p-0 overflow-hidden">
                  <SheetHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-metro-red rounded-full flex items-center justify-center">
                        <Train className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <SheetTitle className="text-left text-lg font-bold text-gray-900 dark:text-gray-100">
                          Navegación
                        </SheetTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
                          Metro de Santiago
                        </p>
                      </div>
                    </div>
                  </SheetHeader>
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* Search with Backdrop */}
                    <div className="px-6 py-4 flex-shrink-0">
                      <div className="relative bg-black/10 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-lg">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-metro-red" />
                        <input
                          type="text"
                          placeholder="Buscar estaciones, líneas, servicios..."
                          className="w-full pl-12 pr-4 py-4 text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-metro-red/30 transition-all"
                          autoFocus={false}
                          tabIndex={-1}
                        />
                      </div>
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
                        
                        return (
                          <Collapsible key={item.id} className="group">
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-center gap-3 p-3 bg-black/10 dark:bg-white/10 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-metro-red/30 dark:hover:border-metro-red/30 hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300 group-hover:shadow-lg">
                                <div className="w-10 h-10 bg-gradient-to-br from-metro-red/10 to-metro-orange/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <IconComponent className="h-5 w-5 text-metro-red group-hover:text-metro-orange transition-colors duration-300" />
                                </div>
                                <div className="flex-1 text-left">
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-metro-red transition-colors duration-300 text-sm">
                                    {item.label}
                                  </h3>
                                </div>
                                {item.children && (
                                  <ChevronDown className="h-6 w-6 text-metro-red dark:text-gray-400 group-hover:text-metro-red transition-all duration-300 group-data-[state=open]:rotate-180" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            
                            {item.children && (
                              <CollapsibleContent className="overflow-hidden">
                                <div className="mt-2 ml-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                  {item.children.map((child, childIndex) => (
                                    <a
                                      key={child.id}
                                      href={child.href}
                                      className="flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:text-metro-red hover:bg-black/20 dark:hover:bg-white/20 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                                      style={{
                                        animationDelay: `${childIndex * 50}ms`
                                      }}
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
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-red/80 hover:bg-metro-red text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200">
                            <LogIn className="h-3.5 w-3.5" />
                            <span>Ingresar</span>
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-metro-orange/80 hover:bg-metro-orange text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200">
                            <UserPlus className="h-3.5 w-3.5" />
                            <span>Registro</span>
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
                        <div className="flex justify-center items-center gap-3">
                          {socialLinks.map((social) => {
                            const IconComponent = social.icon === 'facebook' ? FaFacebookF : 
                                                social.icon === 'instagram' ? FaInstagram :
                                                social.icon === 'twitter' ? FaTwitter :
                                                social.icon === 'music' && social.id === 'tiktok' ? FaTiktok :
                                                social.icon === 'music' && social.id === 'spotify' ? FaSpotify :
                                                FaFacebookF;
                            return (
                              <Tooltip key={social.id}>
                                <TooltipTrigger asChild>
                                  <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-black/20 dark:hover:bg-white/20 hover:text-metro-red dark:hover:text-white transition-all duration-200 hover:scale-110"
                                    aria-label={social.label}
                                  >
                                    <IconComponent className="h-3.5 w-3.5" />
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
      </div>
    </div>
  );
}