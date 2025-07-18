"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  dotColor?: "red" | "orange" | "blue" | "green" | "purple";
  alignment?: "left" | "center";
}

const dotColors = {
  red: "bg-metro-red",
  orange: "bg-metro-orange", 
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500"
};

export function SectionTitle({ 
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  dotColor = "red",
  alignment = "left"
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-12",
        alignment === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <div className={cn(
        "flex items-center gap-3",
        alignment === "center" ? "justify-center" : "justify-start"
      )}>
        {/* Red dot indicator - larger size */}
        <div className={cn(
          "w-3 h-3 rounded-full flex-shrink-0",
          dotColors[dotColor]
        )} />
        
        <h2 className={cn(
          "text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100",
          titleClassName
        )}>
          {title}
        </h2>
      </div>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "text-lg text-gray-600 dark:text-gray-400 mt-4",
            alignment === "center" ? "max-w-2xl mx-auto" : "max-w-2xl",
            subtitleClassName
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}