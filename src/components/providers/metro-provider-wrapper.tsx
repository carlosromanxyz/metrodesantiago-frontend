"use client";

import { MetroProvider } from './metro-provider';

interface MetroProviderWrapperProps {
  children: React.ReactNode;
}

export function MetroProviderWrapper({ children }: MetroProviderWrapperProps) {
  const handleError = (error: Error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Metro Provider Error:', error);
    }
  };

  return (
    <MetroProvider
      enablePersistence={true}
      onError={handleError}
    >
      {children}
    </MetroProvider>
  );
}