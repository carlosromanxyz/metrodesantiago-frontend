"use client";

import { 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SocialLinks } from "@/components/molecules";
import { 
  Search, 
  User, 
  UserPlus, 
  LogIn, 
  Train, 
  CreditCard, 
  Info, 
  Building, 
  Route, 
  ChevronDown 
} from "lucide-react";
import type { NavigationItem, SocialLink } from "@/types/navigation";

interface MobileMenuProps {
  navigationItems: NavigationItem[];
  socialLinks: SocialLink[];
  isLoggedIn: boolean;
  userName?: string;
}

export function MobileMenu({ 
  navigationItems, 
  socialLinks, 
  isLoggedIn, 
  userName 
}: MobileMenuProps) {
  const getIcon = (id: string) => {
    switch(id) {
      case 'connections': return Route;
      case 'tarifas': return CreditCard;
      case 'service': return Info;
      case 'corporate': return Building;
      default: return Train;
    }
  };

  return (
    <>
      {/* Header */}
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
          {navigationItems.map((item) => {
            const IconComponent = getIcon(item.id);
            
            return (
              <Collapsible key={item.id} className="group">
                <CollapsibleTrigger className="w-full touch-manipulation">
                  <div className="flex items-center gap-3 p-3 min-h-[44px] bg-black/10 dark:bg-white/10 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-metro-red/30 dark:hover:border-metro-red/30 hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300 group-hover:shadow-lg">
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
                      {item.children.map((child: NavigationItem, childIndex: number) => (
                        <a
                          key={child.id}
                          href={child.href}
                          className="flex items-center gap-3 p-3 min-h-[44px] text-sm text-gray-600 dark:text-gray-300 hover:text-metro-red hover:bg-black/20 dark:hover:bg-white/20 rounded-lg transition-all duration-200 transform hover:translate-x-1 touch-manipulation"
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
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 min-h-[44px] bg-metro-red/80 hover:bg-metro-red text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation">
                <LogIn className="h-3.5 w-3.5" />
                <span>Ingresar</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 min-h-[44px] bg-metro-orange/80 hover:bg-metro-orange text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation">
                <UserPlus className="h-3.5 w-3.5" />
                <span>Registro</span>
              </button>
            </div>
          ) : (
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 min-h-[44px] bg-metro-turquoise/80 hover:bg-metro-turquoise text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation">
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
              <SocialLinks 
                socialLinks={socialLinks}
                iconSize="sm"
                showTooltip={true}
              />
            </div>
            <div className="mt-2 flex justify-center items-center gap-2">
              <div className="w-1 h-1 bg-metro-red rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-metro-red">Metro de Santiago</span>
              <div className="w-1 h-1 bg-metro-red rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}