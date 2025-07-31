"use client";

import { useState, useEffect, useCallback } from 'react';

interface NetworkError {
  message: string;
  code?: string;
  timestamp: number;
}

interface UseNetworkStatusReturn {
  isOnline: boolean;
  networkError: NetworkError | null;
  isRetrying: boolean;
  retryCount: number;
  retry: () => Promise<void>;
  clearError: () => void;
}

export function useNetworkStatus(): UseNetworkStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [networkError, setNetworkError] = useState<NetworkError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Test network connectivity
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      // Fallback to a more basic connectivity test
      try {
        const response = await fetch('/?_test=connectivity', { 
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(3000)
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  }, []);

  const retry = useCallback(async () => {
    setIsRetrying(true);
    try {
      const connectionOk = await testConnection();
      if (connectionOk) {
        setIsOnline(true);
        setNetworkError(null);
        setRetryCount(0);
      } else {
        throw new Error('Connection test failed');
      }
    } catch {
      setRetryCount(prev => prev + 1);
      setNetworkError({
        message: 'No se pudo restablecer la conexión. Verifica tu conexión a internet.',
        code: 'RETRY_FAILED',
        timestamp: Date.now()
      });
    } finally {
      setIsRetrying(false);
    }
  }, [testConnection]);

  const clearError = useCallback(() => {
    setNetworkError(null);
    setRetryCount(0);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkError(null);
      setRetryCount(0);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkError({
        message: 'Se perdió la conexión a internet. Algunas funciones pueden no estar disponibles.',
        code: 'OFFLINE',
        timestamp: Date.now()
      });
    };

    // Listen to browser online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    networkError,
    isRetrying,
    retryCount,
    retry,
    clearError
  };
}