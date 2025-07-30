"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface HeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function HeaderContainer({ children, className }: HeaderContainerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="container mx-auto">
        <header className={cn("bg-white dark:bg-black shadow-lg rounded-lg border border-gray-100 dark:border-gray-800", className)}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {children}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}