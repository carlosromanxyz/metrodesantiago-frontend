"use client";

import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingProvider, useLoading } from '@/hooks/use-loading';
import { MetroLoaderFullscreen } from '@/components/ui/metro-loader';

function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence mode="wait">
      {isLoading && <MetroLoaderFullscreen />}
    </AnimatePresence>
  );
}

function ContentWrapper({ children }: { children: ReactNode }) {
  const { isLoading } = useLoading();

  return (
    <div style={{ 
      visibility: isLoading ? 'hidden' : 'visible',
      opacity: isLoading ? 0 : 1,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      {children}
    </div>
  );
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <LoadingOverlay />
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </LoadingProvider>
  );
}