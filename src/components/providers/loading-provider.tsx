"use client";

import { ReactNode, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { LoadingProvider, type LoadingContextType } from '@/hooks/use-loading';
import { MetroLoaderFullscreen } from '@/components/ui/metro-loader';

// Memoized overlay component to prevent unnecessary re-renders
const LoadingOverlay = memo(function LoadingOverlay({ 
  isLoading, 
  loadingProgress 
}: { 
  isLoading: boolean; 
  loadingProgress: number; 
}) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && <MetroLoaderFullscreen progress={loadingProgress} />}
    </AnimatePresence>
  );
});

// Memoized content wrapper to prevent unnecessary re-renders
const ContentWrapper = memo(function ContentWrapper({ 
  children, 
  isLoading 
}: { 
  children: ReactNode; 
  isLoading: boolean; 
}) {
  return (
    <div style={{ 
      visibility: isLoading ? 'hidden' : 'visible',
      opacity: isLoading ? 0 : 1,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      {children}
    </div>
  );
});

// Custom hook for loading logic with proper cleanup
function useLoadingState() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const pathname = usePathname();

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setLoadingProgress(100);
    }
  }, []);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setLoadingProgress(0);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingProgress(100);
  }, []);

  // Handle initial page load with progressive loading simulation
  useEffect(() => {
    if (!isInitialLoad) return;

    let progress = 0;
    let progressInterval: NodeJS.Timeout | null = null;
    let minTimer: NodeJS.Timeout | null = null;
    let completionTimer: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const updateProgress = () => {
      if (isCancelled) return;
      
      progress += Math.random() * 15 + 5;
      if (progress >= 85) {
        progress = 85;
      }
      setLoadingProgress(progress);
    };

    progressInterval = setInterval(updateProgress, 100);

    const completeLoading = () => {
      if (isCancelled) return;
      
      if (progressInterval) clearInterval(progressInterval);
      setLoadingProgress(100);
      
      completionTimer = setTimeout(() => {
        if (isCancelled) return;
        setIsLoading(false);
        setIsInitialLoad(false);
      }, 200);
    };

    minTimer = setTimeout(completeLoading, Math.max(1200, Math.min(2000, progress * 20)));

    return () => {
      isCancelled = true;
      if (progressInterval) clearInterval(progressInterval);
      if (minTimer) clearTimeout(minTimer);
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [isInitialLoad]);

  // Handle route changes with faster, realistic loading
  useEffect(() => {
    if (isInitialLoad) return;

    setIsLoading(true);
    setLoadingProgress(0);
    
    let progress = 0;
    let progressInterval: NodeJS.Timeout | null = null;
    let timer: NodeJS.Timeout | null = null;
    let completionTimer: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const updateProgress = () => {
      if (isCancelled) return;
      
      progress += Math.random() * 20 + 10;
      if (progress >= 90) {
        progress = 90;
      }
      setLoadingProgress(progress);
    };

    progressInterval = setInterval(updateProgress, 50);

    const completeLoading = () => {
      if (isCancelled) return;
      
      if (progressInterval) clearInterval(progressInterval);
      setLoadingProgress(100);
      
      completionTimer = setTimeout(() => {
        if (isCancelled) return;
        setIsLoading(false);
      }, 150);
    };

    timer = setTimeout(completeLoading, 800);

    return () => {
      isCancelled = true;
      if (progressInterval) clearInterval(progressInterval);
      if (timer) clearTimeout(timer);
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [pathname, isInitialLoad]);

  return useMemo(() => ({
    isLoading,
    loadingProgress,
    setLoading,
    startLoading,
    stopLoading
  }), [isLoading, loadingProgress, setLoading, startLoading, stopLoading]);
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const loadingState = useLoadingState();

  return (
    <LoadingProvider value={loadingState}>
      <LoadingOverlay 
        isLoading={loadingState.isLoading} 
        loadingProgress={loadingState.loadingProgress} 
      />
      <ContentWrapper isLoading={loadingState.isLoading}>
        {children}
      </ContentWrapper>
    </LoadingProvider>
  );
}