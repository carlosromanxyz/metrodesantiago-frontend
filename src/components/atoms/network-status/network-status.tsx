"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NetworkEventsModal } from "@/components/atoms/network-events-modal";
import { TIMEOUTS, getRandomInterval, isNightTime as isNightTimeUtil } from "@/lib/constants";

import type { NetworkStatusType, NetworkStatusProps } from '@/types';

const statusConfig = {
  available: {
    label: "Disponible",
    shortLabel: "Operativo",
    cardClass: "bg-green-50/80 border-green-200/60 dark:bg-green-950/30 dark:border-green-800/40",
    circleClass: "bg-green-500 shadow-green-500/30 animate-pulse",
    textClass: "text-green-700 dark:text-green-300",
    events: [
      "✅ Todas las líneas operativas",
      "✅ Frecuencia normal en toda la red",
      "✅ Estaciones funcionando correctamente",
      "✅ Servicios auxiliares disponibles"
    ],
  },
  "partially-available": {
    label: "Parcial",
    shortLabel: "Limitado",
    cardClass: "bg-amber-50/80 border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-800/40",
    circleClass: "bg-amber-500 shadow-amber-500/30 animate-pulse",
    textClass: "text-amber-700 dark:text-amber-300",
    events: [
      "⚠️ Línea 3 con retrasos menores",
      "⚠️ Línea 5 velocidad reducida",
      "⚠️ Estación Baquedano acceso limitado",
      "✅ Otras líneas operando normalmente"
    ],
  },
  "not-available": {
    label: "No disponible",
    shortLabel: "Fuera de servicio",
    cardClass: "bg-rose-50/80 border-rose-200/60 dark:bg-rose-950/30 dark:border-rose-800/40",
    circleClass: "bg-rose-500 shadow-rose-500/30 animate-pulse",
    textClass: "text-rose-700 dark:text-rose-300",
    events: [
      "❌ Línea 1 suspendida temporalmente",
      "❌ Línea 4 fuera de servicio",
      "⚠️ Línea 2 solo tramo Los Héroes - La Cisterna",
      "❌ Múltiples estaciones cerradas"
    ],
  },
  closed: {
    label: "Cerrado",
    shortLabel: "Fuera de horario",
    cardClass: "bg-gray-50/80 border-gray-200/60 dark:bg-gray-950/30 dark:border-gray-800/40",
    circleClass: "bg-gray-500 shadow-gray-500/30",
    textClass: "text-gray-700 dark:text-gray-300",
    events: [
      "🌙 Servicio cerrado por horario nocturno",
      "⏰ Horario de servicio: 06:00 - 23:00",
      "🔄 Próxima apertura: 06:00 hrs",
      "📞 Servicios de emergencia disponibles"
    ],
  },
};

function isNightTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  
  // Service is closed between 23:00 and 05:59
  return hours >= 23 || hours < 6;
}

export function NetworkStatus({ className, currentStatus: providedStatus }: NetworkStatusProps) {
  const [status, setStatus] = useState<NetworkStatusType>("available");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If currentStatus is provided, don't run internal logic
    if (providedStatus) {
      return;
    }

    // Function to update status based on time and service conditions
    const updateStatus = () => {
      if (isNightTime()) {
        setStatus("closed");
      } else {
        // During service hours, simulate random status changes
        const statuses: NetworkStatusType[] = ["available", "partially-available", "not-available"];
        const weights = [0.7, 0.2, 0.1]; // 70% available, 20% partial, 10% not available
        
        // Weighted random selection
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < statuses.length; i++) {
          cumulativeWeight += weights[i];
          if (random <= cumulativeWeight) {
            setStatus(statuses[i]);
            break;
          }
        }
      }
    };

    // Initial status update
    updateStatus();

    // Update status every 10-30 seconds during service hours
    // Every minute during closed hours to check if service should reopen
    const getInterval = () => isNightTimeUtil() ? TIMEOUTS.NIGHT_TIME_INTERVAL : getRandomInterval(TIMEOUTS.DAY_TIME_MIN_INTERVAL, TIMEOUTS.DAY_TIME_MAX_INTERVAL);
    
    const scheduleNext = () => {
      const timeoutId = setTimeout(() => {
        updateStatus();
        scheduleNext();
      }, getInterval());
      
      return timeoutId;
    };

    const timeoutId = scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [providedStatus]);

  const currentStatus = statusConfig[providedStatus || status];
  

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 min-w-[160px] p-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors",
          className
        )}
      >
          {/* Status Bar */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado de la Red
            </span>
            <div className="flex items-center gap-2">
              {/* Colored Bar */}
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-8 h-1.5 rounded-full transition-all duration-300",
                  currentStatus.circleClass.replace('animate-pulse', '').replace('w-2.5 h-2.5 rounded-full', 'animate-pulse')
                )} />
                <div 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    currentStatus.circleClass
                  )}
                />
              </div>
              
              {/* Status Text */}
              <span className={cn("text-xs font-semibold", currentStatus.textClass)}>
                {currentStatus.label}
              </span>
            </div>
          </div>
      </div>

    <NetworkEventsModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      currentStatus={providedStatus || status}
    />
  </>
  );
}