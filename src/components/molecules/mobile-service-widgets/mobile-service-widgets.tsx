"use client";

import { useState, useEffect } from "react";
import { NetworkStatus, NetworkStatusType } from "@/components/atoms/network-status/network-status";
import { ScheduleIndicator } from "@/components/atoms/schedule-indicator/schedule-indicator";

// Mobile Network Status Events Component
function MobileNetworkEvents() {
  const [status, setStatus] = useState<NetworkStatusType>("available");
  const [lastUpdate, setLastUpdate] = useState(1);

  useEffect(() => {
    const isNightTime = () => {
      const now = new Date();
      const hours = now.getHours();
      return hours >= 23 || hours < 6;
    };

    const updateStatus = () => {
      if (isNightTime()) {
        setStatus("closed");
      } else {
        const statuses: NetworkStatusType[] = ["available", "partially-available", "not-available"];
        const weights = [0.7, 0.2, 0.1];
        
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
      
      // Update the last update time
      setLastUpdate(Math.floor(Math.random() * 5) + 1);
    };

    updateStatus();
    const getInterval = () => isNightTime() ? 60000 : Math.random() * 20000 + 10000;
    
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
    <div className="space-y-2">
      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Eventos actuales:</p>
      <div className="space-y-1.5">
        {statusEvents[status].map((event, index) => (
          <div key={index} className="text-xs text-gray-700 dark:text-gray-300">
            {event}
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Última actualización: hace {lastUpdate} minutos
        </p>
      </div>
    </div>
  );
}

export function MobileServiceWidgets() {
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
          {/* Network Status Widget with Events */}
          <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50">
            <NetworkStatus className="mb-4" />
            
            {/* Dynamic Events section */}
            <MobileNetworkEvents />
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