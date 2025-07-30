"use client";

import { useState } from "react";
import { SearchBar } from "@/components/molecules";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { IconButton } from "@/components/atoms";
import { logger } from "@/lib/logger";

interface SearchModalProps {
  className?: string;
}

export function SearchModal({ className }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (query: string) => {
    logger.debug("Search query:", query);
    // TODO: Implement search functionality
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <div className={className}>
          <IconButton
            icon={Search}
            label="Buscar"
            variant="ghost"
          />
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