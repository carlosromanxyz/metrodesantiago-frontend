"use client";

import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, RotateCcw, X } from "lucide-react";
import { useState, useEffect } from "react";

interface NetworkStatusIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
}

export function NetworkStatusIndicator({ 
  className, 
  showWhenOnline = false 
}: NetworkStatusIndicatorProps) {
  const { isOnline, networkError, isRetrying, retryCount, retry, clearError } = useNetworkStatus();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOnline || networkError) {
      setIsVisible(true);
    } else if (showWhenOnline) {
      setIsVisible(true);
      // Auto-hide success state after 3 seconds
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOnline, networkError, showWhenOnline]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-50 max-w-sm bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-4 transition-all duration-300",
        !isOnline || networkError 
          ? "border-red-200 dark:border-red-800" 
          : "border-green-200 dark:border-green-800",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
          !isOnline || networkError 
            ? "bg-red-100 dark:bg-red-900/20" 
            : "bg-green-100 dark:bg-green-900/20"
        )}>
          {!isOnline || networkError ? (
            <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
          ) : (
            <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-sm font-medium",
            !isOnline || networkError 
              ? "text-red-800 dark:text-red-200" 
              : "text-green-800 dark:text-green-200"
          )}>
            {!isOnline || networkError ? "Problema de conexión" : "Conexión restaurada"}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {networkError?.message || (!isOnline 
              ? "Verifica tu conexión a internet" 
              : "Tu conexión está funcionando correctamente"
            )}
          </p>

          {(!isOnline || networkError) && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={retry}
                disabled={isRetrying}
                className="text-xs"
              >
                {isRetrying ? (
                  <>
                    <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                    Reintentando...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reintentar {retryCount > 0 && `(${retryCount})`}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <button
          onClick={clearError}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}