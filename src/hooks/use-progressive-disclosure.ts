"use client";

import { useState, useCallback } from 'react';

interface UseProgressiveDisclosureProps {
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export function useProgressiveDisclosure({ 
  allowMultiple = false, 
  defaultOpen = [] 
}: UseProgressiveDisclosureProps = {}) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback((itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      
      return newSet;
    });
  }, [allowMultiple]);

  const isOpen = useCallback((itemId: string) => openItems.has(itemId), [openItems]);

  const closeAll = useCallback(() => setOpenItems(new Set()), []);

  return {
    isOpen,
    toggle,
    closeAll,
    openItems: Array.from(openItems)
  };
}