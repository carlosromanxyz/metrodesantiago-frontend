"use client";

import { useState } from "react";
import { SearchBar } from "@/components/molecules";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { IconButton } from "@/components/atoms";

interface SearchModalProps {
  className?: string;
  variant?: "default" | "compact" | "minimal" | "subdued";
  size?: "sm" | "md" | "lg";
}

export function SearchModal({ 
  className,
  variant = "default",
  size = "md"
}: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: Implement search functionality
    setIsOpen(false);
  };

  // Helper functions for dynamic styling
  const getSearchTriggerStyles = (variant: string, size: string) => {
    const base = "group relative cursor-pointer transition-all duration-150 rounded-md";
    
    const variants = {
      default: "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:border-gray-300 dark:hover:border-gray-600",
      compact: "bg-gray-50/60 dark:bg-gray-800/20 border border-gray-200/60 dark:border-gray-700/40 hover:bg-gray-100/80 dark:hover:bg-gray-700/40 hover:border-metro-red/20 dark:hover:border-metro-red/25",
      minimal: "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:border-metro-red/40 dark:hover:border-metro-red/40",
      subdued: "bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/20 border-0 hover:border hover:border-metro-red/15 dark:hover:border-metro-red/20"
    };
    
    const sizes = {
      sm: "text-xs",
      md: "text-sm", 
      lg: "text-base"
    };
    
    return `${base} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]}`;
  };

  const getSearchIconStyles = (variant: string, size: string) => {
    const base = "absolute left-2.5 top-1/2 transform -translate-y-1/2 transition-colors duration-150";
    
    const variants = {
      default: "text-gray-500 dark:text-gray-400 group-hover:text-metro-red",
      compact: "text-gray-400 dark:text-gray-500 group-hover:text-metro-red/80",
      minimal: "text-gray-400 dark:text-gray-500 group-hover:text-metro-red",
      subdued: "text-gray-400 dark:text-gray-500 group-hover:text-metro-red/70 dark:group-hover:text-metro-red/60"
    };
    
    const sizes = {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-4.5 w-4.5"
    };
    
    return `${base} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]}`;
  };

  const getSearchTextStyles = (variant: string, size: string) => {
    const base = "w-full bg-transparent border-0 focus:outline-none transition-colors duration-150";
    
    const variants = {
      default: "text-gray-600 dark:text-gray-300",
      compact: "text-gray-500 dark:text-gray-400",
      minimal: "text-gray-600 dark:text-gray-300",
      subdued: "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
    };
    
    const sizes = {
      sm: "pl-8 pr-2.5 py-1.5 text-xs",
      md: "pl-9 pr-3 py-2 text-sm",
      lg: "pl-10 pr-3.5 py-2.5 text-sm"
    };
    
    return `${base} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]}`;
  };

  const getPlaceholderText = (variant: string, size: string) => {
    const texts = {
      default: {
        sm: "Buscar...",
        md: "Buscar estaciones, líneas...",
        lg: "Buscar estaciones, líneas, servicios..."
      },
      compact: {
        sm: "Buscar...",
        md: "Buscar en Metro...",
        lg: "Buscar en Metro de Santiago..."
      },
      minimal: {
        sm: "Buscar...",
        md: "Buscar...",
        lg: "Buscar..."
      },
      subdued: {
        sm: "Buscar...",
        md: "Buscar...",
        lg: "Buscar estaciones..."
      }
    };
    
    return texts[variant as keyof typeof texts][size as keyof typeof texts.default];
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <div className={className}>
          <div className={getSearchTriggerStyles(variant, size)}>
            <Search className={getSearchIconStyles(variant, size)} />
            <div className={getSearchTextStyles(variant, size)}>
              {getPlaceholderText(variant, size)}
            </div>
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-black shadow-xl z-50 p-6 rounded border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Buscar en Metro
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton
                icon={X}
                label="Cerrar"
                variant="ghost"
                size="sm"
              />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <SearchBar
              placeholder="Buscar estaciones, líneas, información..."
              onSearch={handleSearch}
              size="md"
              showButton={false}
            />
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Puedes buscar:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Estaciones (ej: &ldquo;Baquedano&rdquo;, &ldquo;Plaza de Armas&rdquo;)</li>
                <li>• Líneas (ej: &ldquo;Línea 1&rdquo;, &ldquo;Línea Roja&rdquo;)</li>
                <li>• Servicios e información</li>
              </ul>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}