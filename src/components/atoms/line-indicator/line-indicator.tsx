"use client";

import { cn } from "@/lib/utils";

export interface LineIndicatorProps {
  lineNumber: number;
  hexColor: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5 text-xs",
  md: "w-6 h-6 text-xs", 
  lg: "w-8 h-8 text-sm"
};

export function LineIndicator({ lineNumber, hexColor, size = "sm", className }: LineIndicatorProps) {
  // Format line number for display
  const displayNumber = lineNumber === 41 ? "4A" : lineNumber.toString();
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-white shadow-md ring-1 ring-black/10 dark:ring-white/10",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: hexColor }}
      title={`Línea ${displayNumber}`}
    >
      {displayNumber}
    </div>
  );
}

export interface MultiLineIndicatorProps {
  lines: { lineNumber: number; hexColor: string }[];
  size?: "sm" | "md" | "lg";
  className?: string;
  maxVisible?: number;
}

export function MultiLineIndicator({ 
  lines, 
  size = "sm", 
  className,
  maxVisible = 3 
}: MultiLineIndicatorProps) {
  const visibleLines = lines.slice(0, maxVisible);
  const remainingCount = Math.max(0, lines.length - maxVisible);
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {visibleLines.map((line, index) => (
        <LineIndicator
          key={`${line.lineNumber}-${index}`}
          lineNumber={line.lineNumber}
          hexColor={line.hexColor}
          size={size}
        />
      ))}
      {remainingCount > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full bg-gray-400 dark:bg-gray-500 text-white font-bold shadow-md ring-1 ring-black/10 dark:ring-white/10",
          sizeClasses[size]
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}