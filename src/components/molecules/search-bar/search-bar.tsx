"use client";

import { useState } from "react";
import { SearchInput } from "@/components/atoms";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showButton?: boolean;
}

export function SearchBar({
  placeholder = "Buscar estaciones, líneas o información...",
  onSearch,
  className,
  size = "md",
  showButton = true
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (searchQuery: string) => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleButtonClick = () => {
    handleSubmit(query);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SearchInput
        placeholder={placeholder}
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        size={size}
        className="flex-1"
      />
      {showButton && (
        <Button
          onClick={handleButtonClick}
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          className="bg-metro-red hover:bg-metro-red/90 text-white"
          disabled={!query.trim()}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Buscar</span>
        </Button>
      )}
    </div>
  );
}