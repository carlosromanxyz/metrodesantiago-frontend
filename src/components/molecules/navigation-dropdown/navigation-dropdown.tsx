"use client";

import { useState } from "react";
import { NavLink } from "@/components/atoms";
import type { NavigationItem } from "@/types";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

interface NavigationDropdownProps {
  item: NavigationItem;
  className?: string;
}

export function NavigationDropdown({ item, className }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <NavLink href={item.href} className={className}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 min-h-[44px] sm:min-h-[32px] text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-metro-red hover:bg-black/20 dark:hover:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-metro-red/60 dark:focus:ring-gray-600/40 focus:ring-offset-1 dark:focus:ring-offset-0 rounded-sm cursor-pointer touch-manipulation",
            isOpen && "text-metro-red bg-metro-orange/20",
            className
          )}
          aria-expanded={isOpen}
        >
          <span>{item.label}</span>
          <ChevronDown 
            className={cn(
              "h-3 w-3 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg p-1 z-50 rounded"
          sideOffset={5}
          align="start"
        >
          {item.children.map((child: NavigationItem) => (
            <DropdownMenu.Item key={child.id} asChild>
              <NavLink
                href={child.href}
                variant="secondary"
                className="w-full justify-start px-3 py-2 min-h-[44px] text-sm hover:bg-black/20 dark:hover:bg-white/20 rounded-sm touch-manipulation"
              >
                {child.label}
              </NavLink>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}