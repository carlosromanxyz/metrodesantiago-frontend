"use client";

import { Logo, ModeToggle, NetworkStatus, ScheduleIndicator } from "@/components/atoms";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu, Search, User, UserPlus, LogIn } from "lucide-react";
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
            
            {/* Social media icons and status indicators - Desktop only */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
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
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-metro-red/20 hover:text-metro-red dark:hover:text-white transition-all duration-200"
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
              
              {/* Status Indicators - Extra Large screens only */}
              <div className="hidden 2xl:flex items-center space-x-4">
                {/* Network Status Indicator */}
                <NetworkStatus />
                
                {/* Schedule Indicator */}
                <ScheduleIndicator />
              </div>
            </div>
          </div>

          {/* Desktop navigation and icons section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex items-center space-x-4">
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
            </div>
          </div>

          {/* Mobile icons section */}
          <div className="lg:hidden flex items-center">
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
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Botones con texto en lugar de iconos */}
                    <div className="space-y-3 py-4 border-b border-gray-200 dark:border-gray-800">
                      <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                        <div className="flex items-center cursor-pointer">
                          <Search className="h-4 w-4" />
                          <span>Buscar</span>
                        </div>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <span>Cambiar tema</span>
                      </Button>
                      {!isLoggedIn ? (
                        <>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <LogIn className="h-4 w-4" />
                            <span>Iniciar sesión</span>
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Registrarse</span>
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <User className="h-4 w-4" />
                          <span>{userName || "Mi Perfil"}</span>
                        </Button>
                      )}
                    </div>
                    
                    {/* Navegacion principal con Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                      {mainNavigation.map((item) => (
                        item.children && item.children.length > 0 ? (
                          <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="text-base font-medium hover:text-metro-red">
                              {item.label}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pl-4">
                                {item.children.map((child) => (
                                  <a
                                    key={child.id}
                                    href={child.href}
                                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-metro-red py-1"
                                  >
                                    {child.label}
                                  </a>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ) : (
                          <div key={item.id} className="py-2">
                            <a
                              href={item.href}
                              className="block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-metro-red py-2"
                            >
                              {item.label}
                            </a>
                          </div>
                        )
                      ))}
                    </Accordion>
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