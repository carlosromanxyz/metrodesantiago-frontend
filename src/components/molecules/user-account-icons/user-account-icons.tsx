"use client";

import { IconButton } from "@/components/atoms";
import type { NavigationItem } from "@/types";
import { cn } from "@/lib/utils";
import { User, UserPlus, LogIn } from "lucide-react";

interface UserAccountIconsProps {
  userNavigation: NavigationItem[];
  isLoggedIn?: boolean;
  userName?: string;
  className?: string;
}

export function UserAccountIcons({
  userNavigation,
  isLoggedIn = false,
  userName,
  className
}: UserAccountIconsProps) {
  if (!isLoggedIn) {
    // Show login/register icons for non-authenticated users
    const loginItem = userNavigation.find(item => item.id === "login");
    const registerItem = userNavigation.find(item => item.id === "register");

    return (
      <div className={cn("flex items-center", className)}>
        {loginItem && (
          <IconButton
            icon={LogIn}
            label={loginItem.label}
            href={loginItem.href}
            variant="ghost"
          />
        )}
        {registerItem && (
          <IconButton
            icon={UserPlus}
            label={registerItem.label}
            href={registerItem.href}
            variant="ghost"
          />
        )}
      </div>
    );
  }

  // Show user profile icon for authenticated users
  const profileItem = userNavigation.find(item => item.id === "profile");
  
  return (
    <div className={cn("flex items-center", className)}>
      <IconButton
        icon={User}
        label={userName || "Mi Perfil"}
        href={profileItem?.href || "/perfil"}
        variant="ghost"
      />
    </div>
  );
}