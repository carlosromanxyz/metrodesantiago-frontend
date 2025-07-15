"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export type NetworkStatusType = "available" | "partially-available" | "not-available";

interface NetworkStatusProps {
  className?: string;
}

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
};

export function NetworkStatus({ className }: NetworkStatusProps) {
  const [status, setStatus] = useState<NetworkStatusType>("available");
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    // Simulate random status changes every 10-30 seconds
    const interval = setInterval(() => {
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
    }, Math.random() * 20000 + 10000); // Random interval between 10-30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentStatus = statusConfig[status];

  return (
    <HoverCard onOpenChange={(open) => {
      if (open) {
        setShowEvents(false);
        setTimeout(() => setShowEvents(true), 100);
      } else {
        setShowEvents(false);
      }
    }}>
      <HoverCardTrigger asChild>
        <div className={cn(
          "flex items-center gap-3 min-w-[160px] p-2 rounded-md cursor-pointer",
          className
        )}>
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
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-80"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                currentStatus.circleClass
              )}
            />
            <h4 className="text-sm font-semibold">Estado de la Red: {currentStatus.label}</h4>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Eventos actuales:</p>
            <ul className="space-y-1.5">
              {currentStatus.events.map((event, index) => (
                <li 
                  key={index} 
                  className={`text-xs leading-relaxed transition-all duration-500 ease-out ${
                    showEvents ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                  style={{
                    transitionDelay: showEvents ? `${index * 80}ms` : '0ms'
                  }}
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-[10px] text-muted-foreground">
              Última actualización: hace {Math.floor(Math.random() * 5) + 1} minutos
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}