"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NetworkStatus, NetworkStatusType } from "@/components/atoms/network-status/network-status";
import { ScheduleIndicator } from "@/components/atoms/schedule-indicator/schedule-indicator";

// Skeleton Component for loading state
function EventSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1,
            ease: "easeOut" as const
          }}
          className="p-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg border border-gray-200/30 dark:border-gray-700/30 animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-1" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Mobile Network Status Events Component
function MobileNetworkEvents({ currentStatus }: { currentStatus: NetworkStatusType }) {
  const [lastUpdate, setLastUpdate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(true);

  useEffect(() => {
    // Start transition sequence when status changes
    setShowEvents(false);
    setIsLoading(true);
    
    // Show loading after events fade out
    const loadingTimeout = setTimeout(() => {
      setLastUpdate(Math.floor(Math.random() * 5) + 1);
    }, 300);

    // Show new events after loading
    const eventsTimeout = setTimeout(() => {
      setIsLoading(false);
      setShowEvents(true);
    }, 800);

    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(eventsTimeout);
    };
  }, [currentStatus]);

  const statusEvents = {
    available: [
      "✅ Todas las líneas operativas",
      "✅ Frecuencia normal en toda la red",
      "✅ Estaciones funcionando correctamente",
      "✅ Servicios auxiliares disponibles"
    ],
    "partially-available": [
      "⚠️ Línea 3 con retrasos menores",
      "⚠️ Línea 5 velocidad reducida",
      "⚠️ Estación Baquedano acceso limitado",
      "✅ Otras líneas operando normalmente"
    ],
    "not-available": [
      "❌ Línea 1 suspendida temporalmente",
      "❌ Línea 4 fuera de servicio",
      "⚠️ Línea 2 solo tramo Los Héroes - La Cisterna",
      "❌ Múltiples estaciones cerradas"
    ],
    closed: [
      "🌙 Servicio cerrado por horario nocturno",
      "⏰ Horario de servicio: 06:00 - 23:00",
      "🔄 Próxima apertura: 06:00 hrs",
      "📞 Servicios de emergencia disponibles"
    ]
  };

  return (
    <div className="flex flex-col h-full">
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-4 flex-shrink-0"
      >
        Eventos actuales:
      </motion.p>
      
      {/* Events container - Takes all available space */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <EventSkeleton />
            </motion.div>
          ) : showEvents ? (
            <motion.div 
              key={currentStatus}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut" as const
              }}
              className="space-y-3 absolute inset-0 flex flex-col justify-center"
            >
              {[...Array(6)].map((_, index) => {
                const event = statusEvents[currentStatus][index];
                return (
                  <motion.div 
                    key={`${currentStatus}-${index}`}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.15,
                      ease: "easeOut" as const
                    }}
                    className={`text-sm p-3 rounded-lg border ${
                      event 
                        ? "text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/5 border-gray-200/30 dark:border-gray-700/30"
                        : "bg-transparent border-transparent"
                    }`}
                  >
                    {event || ""}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="pt-4 mt-auto flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.p 
            key={lastUpdate}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="text-xs text-gray-500 dark:text-gray-400 text-center"
          >
            Última actualización: hace {lastUpdate} minutos
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function MobileServiceWidgets() {
  const [currentStatus, setCurrentStatus] = useState<NetworkStatusType>("available");

  useEffect(() => {
    const isNightTime = () => {
      const now = new Date();
      const hours = now.getHours();
      return hours >= 23 || hours < 6;
    };

    const updateStatus = () => {
      if (isNightTime()) {
        setCurrentStatus("closed");
      } else {
        const statuses: NetworkStatusType[] = ["available", "partially-available", "not-available"];
        const weights = [0.7, 0.2, 0.1];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < statuses.length; i++) {
          cumulativeWeight += weights[i];
          if (random <= cumulativeWeight) {
            setCurrentStatus(statuses[i]);
            break;
          }
        }
      }
    };

    updateStatus();
    
    const getInterval = () => isNightTime() ? 60000 : Math.random() * 8000 + 5000;
    
    const scheduleNext = () => {
      const timeoutId = setTimeout(() => {
        updateStatus();
        scheduleNext();
      }, getInterval());
      
      return timeoutId;
    };

    const timeoutId = scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="lg:hidden py-8 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Estado del Servicio
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Información en tiempo real
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Network Status Widget with Events - Fixed height */}
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50 h-[calc(100vh-200px)] max-h-[600px] min-h-[400px] flex flex-col">
            {/* Status Panel - Always visible */}
            <motion.div
              key={`status-${currentStatus}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="mb-4 flex-shrink-0"
            >
              <NetworkStatus currentStatus={currentStatus} />
            </motion.div>
            
            {/* Dynamic Events section - Takes remaining space */}
            <div className="flex-1 flex flex-col">
              <MobileNetworkEvents currentStatus={currentStatus} />
            </div>
          </div>
          
          {/* Schedule Indicator Widget */}
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50">
            <ScheduleIndicator />
          </div>
        </div>
      </div>
    </section>
  );
}