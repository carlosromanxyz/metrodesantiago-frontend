"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export type ScheduleType = "punta" | "valle";

interface ScheduleIndicatorProps {
  className?: string;
}

const scheduleConfig = {
  punta: {
    label: "Punta",
    description: "6:00 - 10:00 • 18:00 - 20:00",
    barClass: "bg-metro-red/80",
    circleClass: "bg-metro-red animate-pulse",
    textClass: "text-metro-red dark:text-metro-red",
  },
  valle: {
    label: "Valle",
    description: "10:00 - 17:59 • 20:01 - 5:59",
    barClass: "bg-blue-500/80",
    circleClass: "bg-blue-500 animate-pulse",
    textClass: "text-blue-600 dark:text-blue-400",
  },
};

function getCurrentScheduleType(): ScheduleType {
  const now = new Date();
  const hour = now.getHours();
  
  // Punta: 6-10 AM y 18-20 PM (6 PM - 8 PM)
  if ((hour >= 6 && hour < 10) || (hour >= 18 && hour < 20)) {
    return "punta";
  }
  
  // Valle: todo el resto
  return "valle";
}

export function ScheduleIndicator({ className }: ScheduleIndicatorProps) {
  const [schedule, setSchedule] = useState<ScheduleType>("valle");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Update schedule immediately
    setSchedule(getCurrentScheduleType());
    
    // Calculate milliseconds until next minute
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    
    // Set initial timeout to sync with minute boundary
    const initialTimeout = setTimeout(() => {
      setSchedule(getCurrentScheduleType());
      
      // Then set regular interval every minute
      const interval = setInterval(() => {
        setSchedule(getCurrentScheduleType());
      }, 60000);
      
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimeout);
  }, []);

  const currentSchedule = scheduleConfig[schedule];

  // Show nothing during SSR to prevent hydration errors
  if (!isClient) {
    return (
      <div className={cn(
        "flex items-center gap-3 min-w-[140px] p-2 rounded-md",
        className
      )}>
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Horario
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              --
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 min-w-[140px] p-2 rounded-md",
      className
    )}>
      {/* Schedule Bar */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Horario
        </span>
        <div className="flex items-center gap-2">
          {/* Colored Bar */}
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-8 h-1.5 rounded-full transition-all duration-300",
              currentSchedule.barClass
            )} />
            <div 
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                currentSchedule.circleClass
              )}
            />
          </div>
          
          {/* Schedule Text */}
          <span className={cn("text-xs font-semibold", currentSchedule.textClass)}>
            {currentSchedule.label}
          </span>
        </div>
      </div>
    </div>
  );
}