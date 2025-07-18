"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AnimatedMetroLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-32 h-8",
  md: "w-48 h-12", 
  lg: "w-64 h-16",
  xl: "w-80 h-20"
};

export function AnimatedMetroLogo({ size = "md", className = "" }: AnimatedMetroLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use same theme logic as footer logo - invert for correct branding
  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const isDark = theme === "dark";

  // Animation variants for the container
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  // Animation variants for individual line circles
  const circleVariants = {
    initial: { 
      scale: 0,
      opacity: 0
    },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  // Animation variants for the rombos (logo)
  const rombosVariants = {
    initial: { 
      scale: 0,
      opacity: 0
    },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 1.6,
        ease: "easeOut" as const
      }
    }
  };

  if (!mounted) {
    return <div className={`${sizeClasses[size]} ${className} animate-pulse bg-gray-200 dark:bg-gray-700 rounded`} />;
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={`relative ${sizeClasses[size]}`}
      >
        {/* Metro Lines Logo - Using real SVG paths */}
        <motion.svg
          viewBox="0 0 402.32 89.41"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Line 1 - Red */}
          <motion.path 
            variants={circleVariants}
            d="M0,44.63c0-4.94,3.99-8.94,8.92-8.94s8.93,4,8.93,8.94-4,8.94-8.93,8.94S0,49.57,0,44.63"
            fill="#d70f27"
          />
          
          {/* Line 2 - Yellow */}
          <motion.path 
            variants={circleVariants}
            d="M44.7,44.63c0-4.94,4-8.94,8.92-8.94s8.93,4,8.93,8.94-3.99,8.94-8.93,8.94-8.92-4.01-8.92-8.94"
            fill="#fab60b"
          />
          
          {/* Line 5 - Green */}
          <motion.path 
            variants={circleVariants}
            d="M89.4,44.63c0-4.94,4-8.94,8.93-8.94s8.92,4,8.92,8.94-3.99,8.94-8.92,8.94-8.93-4.01-8.93-8.94"
            fill="#009858"
          />
          
          {/* Line 4A - Dark Blue */}
          <motion.path 
            variants={circleVariants}
            d="M134.1,44.63c0-4.94,3.99-8.94,8.92-8.94s8.93,4.01,8.93,8.94-4,8.94-8.93,8.94-8.92-4-8.92-8.94"
            fill="#2e2b72"
          />
          
          {/* Line 4 - Blue */}
          <motion.path 
            variants={circleVariants}
            d="M178.8,44.63c0-4.94,4-8.94,8.92-8.94s8.93,4.01,8.93,8.94-4,8.94-8.93,8.94-8.92-4-8.92-8.94"
            fill="#0372b9"
          />
          
          {/* Line 6 - Purple */}
          <motion.path 
            variants={circleVariants}
            d="M223.5,44.63c0-4.94,4-8.94,8.93-8.94s8.92,4,8.92,8.94-3.99,8.94-8.92,8.94-8.93-4-8.93-8.94"
            fill="#9a3487"
          />
          
          {/* Line 3 - Brown */}
          <motion.path 
            variants={circleVariants}
            d="M268.21,44.63c0-4.94,4-8.94,8.93-8.94s8.92,4,8.92,8.94-3.99,8.94-8.92,8.94-8.93-4.01-8.93-8.94"
            fill="#6b2b15"
          />
        </motion.svg>

        {/* Metro Logo with Circle and Rombos - Using original SVG */}
        <motion.div
          variants={rombosVariants}
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
            <motion.svg
              viewBox="312.92 0 89.41 89.41"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer red circle */}
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { duration: 0.5, ease: "easeOut" as const }
                }}
                cx="357.62"
                cy="44.7" 
                r="44.7"
                fill={isDark ? "#fff" : "#d70f27"}
              />
              
              {/* Inner circle with rombos - using exact path from original */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  transition: {
                    pathLength: { duration: 1.5, ease: "easeInOut" as const, delay: 0.3 },
                    opacity: { duration: 0.3, delay: 0.3 }
                  }
                }}
                d="M330.77,45.6c.55,10.64,11.1,19.26,24.49,20.23,1.13.08,2.26.11,3.4.08,13.29-.37,24.12-8.53,25.65-18.7.17-1.15.26-2.32.23-3.51-.05-2.23-.48-4.38-1.41-6.33-3.43-7.36-11.94-12.81-22.2-13.74-1.34-.13-2.7-.17-4.06-.14-1.84.04-3.63.23-5.36.55-8.32,1.39-19.13,7.75-20.58,18.36-.16,1.11-.15,2.4-.14,3.2M357.8,21.19c16.14,0,29.23,10.52,29.23,23.51s-13.08,23.51-29.23,23.51c-14.57,0-26.65-8.58-28.86-19.8-.22-1.14-.37-2.43-.37-3.71,0-10.92,9.11-19.45,20.16-22.36,2.89-.77,5.9-1.15,9.07-1.15M350.34,44.63l-7.25,13.13-7.26-13.13,7.26-13.13,7.25,13.13ZM379.57,44.63l-7.26,13.13-7.26-13.13,7.26-13.13,7.26,13.13ZM364.95,44.63l-7.25,13.13-7.26-13.13,7.26-13.13,7.25,13.13Z"
                fill={isDark ? "#d70f27" : "#fff"}
                stroke="none"
              />
            </motion.svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}