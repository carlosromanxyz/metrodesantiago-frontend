"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

import type { SearchInputProps } from '@/types';

const sizeClasses = {
  sm: "h-8 min-h-[44px] sm:min-h-[32px] text-sm",
  md: "h-10 min-h-[44px] sm:min-h-[40px]",
  lg: "h-12 min-h-[44px] sm:min-h-[48px] text-lg"
};

export function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  onSubmit,
  className,
  size = "md"
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit && value) {
      onSubmit(value);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "pl-10 pr-4 border-gray-300 focus:border-metro-red focus:ring-metro-red",
          sizeClasses[size]
        )}
        aria-label={placeholder}
      />
    </div>
  );
}