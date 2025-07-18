"use client";

import { AnimatedMetroLogo } from "@/components/ui/animated-metro-logo";
import { motion } from "framer-motion";

interface MetroLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function MetroLoader({ size = "md", className = "" }: MetroLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <AnimatedMetroLogo size={size} />
    </div>
  );
}

// Variant for fullscreen loading
export function MetroLoaderFullscreen({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`fixed inset-0 bg-gray-100 dark:bg-black flex items-center justify-center z-[9999] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ 
          scale: 0.8, 
          opacity: 0,
          transition: { duration: 0.4, ease: "easeInOut" }
        }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      >
        <MetroLoader size="xl" />
      </motion.div>
    </motion.div>
  );
}

// Simple inline loader for buttons or small areas
export function MetroLoaderInline({ className = "" }: { className?: string }) {
  const lineColors = [
    { name: "L1", color: "#d70f27" },
    { name: "L2", color: "#fab60b" },
    { name: "L5", color: "#009858" }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {lineColors.map((line, index) => (
        <motion.div
          key={line.name}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: line.color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1,
            delay: index * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}