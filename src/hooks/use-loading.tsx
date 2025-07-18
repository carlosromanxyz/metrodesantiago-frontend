"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const pathname = usePathname();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  // Handle initial page load
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsInitialLoad(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // Handle route changes
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [pathname, isInitialLoad]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}