"use client";

import { AnimatedMetroLogo } from "@/components/ui/animated-metro-logo";
import { motion } from "framer-motion";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { INLINE_LOADER_LINES, LOADING_MESSAGES } from "@/constants/metro-svg-paths";

interface MetroLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  progress?: number;
  showProgress?: boolean;
}

export const MetroLoader = memo(function MetroLoader({ size = "md", className = "", progress, showProgress = false }: MetroLoaderProps) {
  const [announcement, setAnnouncement] = useState("");

  // Memoized announcement logic
  const getAnnouncement = useCallback((progress?: number, showProgress?: boolean) => {
    if (showProgress && typeof progress === 'number') {
      if (progress === 0) return LOADING_MESSAGES.INITIAL;
      if (progress < 50) return LOADING_MESSAGES.LOADING;
      if (progress < 90) return LOADING_MESSAGES.ALMOST_READY;
      if (progress === 100) return LOADING_MESSAGES.COMPLETED;
    }
    return LOADING_MESSAGES.SIMPLE;
  }, []);

  // Update screen reader announcements with debouncing
  useEffect(() => {
    const newAnnouncement = getAnnouncement(progress, showProgress);
    
    // Debounce announcements to avoid spam
    const timeoutId = setTimeout(() => {
      setAnnouncement(newAnnouncement);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [progress, showProgress, getAnnouncement]);

  // Memoized progress bar animation
  const progressBarAnimation = useMemo(() => ({
    initial: { width: 0 },
    animate: { width: `${progress || 0}%` },
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1],
      type: "tween" as const // Prevent layout thrashing
    }
  }), [progress]);

  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={announcement}
      aria-busy="true"
    >
      <AnimatedMetroLogo size={size} />
      {showProgress && typeof progress === 'number' && (
        <div className="mt-6 w-40 sm:w-56 md:w-64" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#d70f27] via-[#d70f27] to-[#009858] h-2 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress || 0}%` }}
              transition={{ 
                duration: 0.4, 
                ease: "easeInOut",
                type: "tween"
              }}
              style={{
                willChange: 'width',
                transform: 'translateZ(0)' // Force GPU acceleration
              }}
            />
          </div>
          <span className="sr-only" aria-live="polite">{Math.round(progress)}% completado</span>
        </div>
      )}
    </div>
  );
});

// Variant for fullscreen loading with better performance
export const MetroLoaderFullscreen = memo(function MetroLoaderFullscreen({ className = "", progress }: { className?: string; progress?: number }) {
  // Memoized animation variants for performance
  const containerVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    transition: { duration: 0.3 }
  }), []);

  const contentVariants = useMemo(() => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    transition: { delay: 0.1, duration: 0.4, ease: "easeOut" }
  }), []);

  return (
    <motion.div 
      className={`fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center z-[9999] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        willChange: 'opacity',
        transform: 'translateZ(0)', // Force GPU layer
        backfaceVisibility: 'hidden' // Better animation performance
      }}
    >
      <motion.div 
        className="text-center px-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)' // Force GPU layer
        }}
      >
        <MetroLoader size="xl" showProgress={true} progress={progress} />
      </motion.div>
    </motion.div>
  );
});

// Simple inline loader for buttons or small areas with better performance
export const MetroLoaderInline = memo(function MetroLoaderInline({ className = "" }: { className?: string }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Memoized animation variants for better performance
  const dotAnimation = useMemo(() => {
    if (prefersReducedMotion) return {};
    
    return {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.6, 1, 0.6]
      },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      role="status"
      aria-label={LOADING_MESSAGES.SIMPLE}
      aria-busy="true"
    >
      {INLINE_LOADER_LINES.map((line, index) => (
        <motion.div
          key={line.name}
          className="w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: line.color,
            willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
            transform: 'translateZ(0)' // Force GPU layer
          }}
          {...dotAnimation}
          transition={prefersReducedMotion ? undefined : {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        />
      ))}
      <span className="sr-only" aria-live="polite">{LOADING_MESSAGES.INLINE}</span>
    </div>
  );
});