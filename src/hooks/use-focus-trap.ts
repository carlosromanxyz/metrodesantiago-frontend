"use client";

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onEscape?: () => void;
}

export function useFocusTrap({ 
  isActive, 
  initialFocusRef, 
  onEscape 
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(selectors)).filter(
      (element) => {
        const el = element as HTMLElement;
        return el.offsetParent !== null && // Element is visible
               getComputedStyle(el).visibility !== 'hidden' &&
               !el.hasAttribute('aria-hidden');
      }
    ) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Escape' && onEscape) {
      onEscape();
      return;
    }

    if (event.key === 'Tab') {
      // Shift + Tab: move to previous element
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } 
      // Tab: move to next element
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isActive, getFocusableElements, onEscape]);

  useEffect(() => {
    if (isActive) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the initial element or first focusable element
      const focusTarget = initialFocusRef?.current || 
        (containerRef.current && getFocusableElements(containerRef.current)[0]);
      
      if (focusTarget) {
        setTimeout(() => focusTarget.focus(), 100);
      }

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        setTimeout(() => previousFocusRef.current?.focus(), 100);
        previousFocusRef.current = null;
      }
    }
  }, [isActive, handleKeyDown, initialFocusRef, getFocusableElements]);

  return containerRef;
}