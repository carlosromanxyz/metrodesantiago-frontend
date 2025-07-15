"use client";

import { useState } from "react";
import { NavLink } from "@/components/atoms";
import { NavigationItem } from "@/data/navigation";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, ChevronDown } from "lucide-react";

interface UserAccountSectionProps {
  userNavigation: NavigationItem[];
  isLoggedIn?: boolean;
  userName?: string;
  className?: string;
}

export function UserAccountSection({
  userNavigation,
  isLoggedIn = false,
  userName,
  className
}: UserAccountSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoggedIn) {
    // Show login/register links for non-authenticated users
    const loginItems = userNavigation.filter(item => 
      item.id === "login" || item.id === "register"
    );

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {loginItems.map((item) => (
          <NavLink
            key={item.id}
            href={item.href}
            variant="secondary"
            className="text-xs px-2 py-1"
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    );
  }

  // Show user dropdown for authenticated users
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:text-metro-red transition-colors focus:outline-none focus:ring-2 focus:ring-metro-red focus:ring-offset-2 rounded-md",
            isOpen && "text-metro-red",
            className
          )}
          aria-expanded={isOpen}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">
            {userName || "Mi Cuenta"}
          </span>
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
          className="min-w-[160px] bg-white rounded-md border border-gray-200 shadow-lg p-1 z-50"
          sideOffset={5}
          align="end"
        >
          {userNavigation
            .filter(item => item.id !== "login" && item.id !== "register")
            .map((item) => (
              <DropdownMenu.Item key={item.id} asChild>
                <NavLink
                  href={item.href}
                  variant="secondary"
                  className="w-full justify-start px-3 py-2 text-sm hover:bg-gray-50 rounded-sm"
                >
                  {item.label}
                </NavLink>
              </DropdownMenu.Item>
            ))}
          
          <DropdownMenu.Separator className="h-px bg-gray-200 m-1" />
          
          <DropdownMenu.Item asChild>
            <button
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-metro-red rounded-sm focus:outline-none"
              onClick={() => {
                // Handle logout
                console.log("Logout");
              }}
            >
              Cerrar Sesión
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}