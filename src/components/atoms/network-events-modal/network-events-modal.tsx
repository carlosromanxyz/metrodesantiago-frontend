"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import type { NetworkStatusType } from '@/types';

interface NetworkEvent {
  id: string;
  line: string;
  lineColor: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  stations?: string[];
}

interface NetworkEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: NetworkStatusType;
}

// Mock data for network events by status
const getEventsByStatus = (status: NetworkStatusType): NetworkEvent[] => {
  const now = new Date();
  const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60000);

  switch (status) {
    case 'available':
      return [
        {
          id: '1',
          line: 'Línea 1',
          lineColor: '#E60000',
          type: 'success',
          title: 'Operación Normal',
          description: 'Servicio funcionando con frecuencia regular de 2-3 minutos',
          timestamp: minutesAgo(2),
        },
        {
          id: '2',
          line: 'Línea 2',
          lineColor: '#F7931E',
          type: 'success',
          title: 'Operación Normal',
          description: 'Todos los trenes en servicio, frecuencia de 2-4 minutos',
          timestamp: minutesAgo(5),
        },
        {
          id: '3',
          line: 'Línea 3',
          lineColor: '#8B4513',
          type: 'info',
          title: 'Mantenimiento Programado',
          description: 'Limpieza nocturna completada exitosamente',
          timestamp: minutesAgo(15),
        },
        {
          id: '4',
          line: 'Línea 4',
          lineColor: '#0066CC',
          type: 'success',
          title: 'Operación Normal',
          description: 'Servicio regular en toda la línea',
          timestamp: minutesAgo(20),
        },
        {
          id: '5',
          line: 'Línea 5',
          lineColor: '#00A651',
          type: 'success',
          title: 'Operación Normal',
          description: 'Frecuencia óptima de 2-3 minutos',
          timestamp: minutesAgo(8),
        },
        {
          id: '6',
          line: 'Línea 6',
          lineColor: '#9933CC',
          type: 'success',
          title: 'Operación Normal',
          description: 'Todos los servicios funcionando correctamente',
          timestamp: minutesAgo(12),
        },
      ];

    case 'partially-available':
      return [
        {
          id: '1',
          line: 'Línea 1',
          lineColor: '#E60000',
          type: 'success',
          title: 'Operación Normal',
          description: 'Servicio funcionando con frecuencia regular',
          timestamp: minutesAgo(5),
        },
        {
          id: '2',
          line: 'Línea 3',
          lineColor: '#8B4513',
          type: 'warning',
          title: 'Retrasos Menores',
          description: 'Incremento en frecuencia de 4-6 minutos por congestión',
          timestamp: minutesAgo(3),
          stations: ['Plaza Baquedano', 'Salvador'],
        },
        {
          id: '3',
          line: 'Línea 5',
          lineColor: '#00A651',
          type: 'warning',
          title: 'Velocidad Reducida',
          description: 'Operación a velocidad reducida por condiciones climáticas',
          timestamp: minutesAgo(8),
        },
        {
          id: '4',
          line: 'Línea 2',
          lineColor: '#F7931E',
          type: 'info',
          title: 'Mantención Preventiva',
          description: 'Revisión técnica en progreso, sin afectar el servicio',
          timestamp: minutesAgo(25),
        },
        {
          id: '5',
          line: 'Línea 4',
          lineColor: '#0066CC',
          type: 'success',
          title: 'Operación Normal',
          description: 'Servicio regular restablecido',
          timestamp: minutesAgo(15),
        },
      ];

    case 'not-available':
      return [
        {
          id: '1',
          line: 'Línea 1',
          lineColor: '#E60000',
          type: 'error',
          title: 'Servicio Suspendido',
          description: 'Falla técnica en sistema de señalización. Trabajos de reparación en curso',
          timestamp: minutesAgo(15),
          stations: ['Los Héroes', 'La Moneda', 'Universidad de Chile'],
        },
        {
          id: '2',
          line: 'Línea 4',
          lineColor: '#0066CC',
          type: 'error',
          title: 'Fuera de Servicio',
          description: 'Incidente técnico requiere suspensión temporal. Buses de emergencia disponibles',
          timestamp: minutesAgo(22),
        },
        {
          id: '3',
          line: 'Línea 2',
          lineColor: '#F7931E',
          type: 'warning',
          title: 'Servicio Parcial',
          description: 'Operación solo entre Los Héroes y La Cisterna',
          timestamp: minutesAgo(18),
          stations: ['Los Héroes', 'La Cisterna'],
        },
        {
          id: '4',
          line: 'Línea 3',
          lineColor: '#8B4513',
          type: 'warning',
          title: 'Estaciones Cerradas',
          description: 'Múltiples estaciones temporalmente cerradas por seguridad',
          timestamp: minutesAgo(12),
          stations: ['Plaza Baquedano', 'Salvador', 'Manuel Montt'],
        },
        {
          id: '5',
          line: 'Línea 5',
          lineColor: '#00A651',
          type: 'success',
          title: 'Operación Normal',
          description: 'Servicio regular mantenido',
          timestamp: minutesAgo(5),
        },
      ];

    case 'closed':
      return [
        {
          id: '1',
          line: 'Red Metro',
          lineColor: '#666666',
          type: 'info',
          title: 'Servicio Cerrado',
          description: 'Horario nocturno. Próxima apertura: 06:00 hrs',
          timestamp: minutesAgo(10),
        },
        {
          id: '2',
          line: 'Red Metro',
          lineColor: '#666666',
          type: 'info',
          title: 'Limpieza Nocturna',
          description: 'Trabajos de mantención y limpieza en progreso',
          timestamp: minutesAgo(30),
        },
        {
          id: '3',
          line: 'Red Metro',
          lineColor: '#666666',
          type: 'info',
          title: 'Servicios de Emergencia',
          description: 'Contacto 24/7 disponible para emergencias',
          timestamp: minutesAgo(45),
        },
      ];

    default:
      return [];
  }
};

const getEventIcon = (type: NetworkEvent['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'hace menos de 1 minuto';
  if (diffInMinutes < 60) return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
};

export function NetworkEventsModal({ isOpen, onClose, currentStatus }: NetworkEventsModalProps) {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setEvents(getEventsByStatus(currentStatus));
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen, currentStatus]);

  const statusInfo = {
    available: {
      title: 'Red Operativa',
      description: 'Todas las líneas funcionando normalmente',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    'partially-available': {
      title: 'Operación Parcial',
      description: 'Algunas líneas con incidencias menores',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    'not-available': {
      title: 'Incidencias Activas',
      description: 'Múltiples líneas afectadas',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    closed: {
      title: 'Servicio Cerrado',
      description: 'Horario nocturno - Red fuera de servicio',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    },
  };

  const currentStatusInfo = statusInfo[currentStatus];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal - Centered for all devices */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              y: 20
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-lg bg-white dark:bg-black 
                     rounded-xl sm:rounded-2xl shadow-2xl max-h-[85vh] sm:max-h-[90vh] 
                     border border-white/20 dark:border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-metro-red rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Estado de la Red
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Summary */}
            <div className={`p-3 sm:p-4 mx-4 sm:mx-6 mt-3 sm:mt-4 rounded-lg ${currentStatusInfo.bgColor}`}>
              <div className="flex items-center gap-2 mb-2">
                {getEventIcon(currentStatus === 'available' ? 'success' : 
                             currentStatus === 'partially-available' ? 'warning' : 
                             currentStatus === 'not-available' ? 'error' : 'info')}
                <h3 className={`font-semibold ${currentStatusInfo.color}`}>
                  {currentStatusInfo.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStatusInfo.description}
              </p>
            </div>

            {/* Events List */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Eventos Recientes
                </h3>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div 
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: event.lineColor }}
                        >
                          {event.line.includes('Red') ? 'M' : event.line.split(' ')[1]?.charAt(0) || 'L'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getEventIcon(event.type)}
                            <h4 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                              {event.title}
                            </h4>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {event.description}
                          </p>
                          
                          {event.stations && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Estaciones afectadas:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {event.stations.map((station, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-full"
                                  >
                                    {station}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{event.line}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Actualizado automáticamente cada 30 segundos
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}