"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Import existing components
import { uniqueStationNames, getStationLines } from "@/data/stations";
import { Combobox } from "@/components/ui/combobox";
import { NetworkStatus } from "@/components/atoms/network-status/network-status";
import { ScheduleIndicator } from "@/components/atoms/schedule-indicator/schedule-indicator";

// Import enhanced hooks and types
import { useEnhancedVoiceControl } from "@/hooks/useEnhancedVoiceControl";
import { useAIPersonalization, useTimeOfDay, createMockUserContext } from "@/hooks/useAIPersonalization";
import type {
  HeroStaticProps,
  TripPlannerWidgetProps,
  RouteResult,
  ComponentState
} from "@/types/hero-types";

// Constants
const BACKGROUND_ROTATION_INTERVAL = 20000;
const BACKGROUND_IMAGES = [
  '/images/hero-metro-1.jpg',
  '/images/hero-metro-2.jpg', 
  '/images/hero-metro-3.jpg'
] as const;

// Enhanced Trip Planner with proper error handling
const AITripPlannerWidget = memo<TripPlannerWidgetProps>(function AITripPlannerWidget({ 
  onVoiceCommand,
  onRouteCalculated,
  className,
  disabled = false
}) {
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [state, setState] = useState<ComponentState<RouteResult>>({
    loading: false,
    error: null,
    data: null
  });
  
  // Memoize station options for performance
  const stationOptions = useMemo(() => 
    uniqueStationNames.map((station) => {
      const lines = getStationLines(station);
      return {
        value: station.toLowerCase().replace(/\s+/g, '-'),
        label: station,
        lines: lines.map(line => ({
          lineNumber: line.lineNumber,
          hexColor: line.hexColor
        }))
      };
    }), []);

  const calculateRoute = useCallback(async (): Promise<RouteResult> => {
    // Simulate AI-powered route calculation
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return {
      duration: Math.floor(Math.random() * 30 + 10),
      distance: Math.floor(Math.random() * 15 + 2),
      transfers: Math.floor(Math.random() * 3),
      lines: ['L1', 'L3'],
      accessibility: true,
      realTimeDelay: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : undefined
    };
  }, []);

  const handleSearch = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!fromStation || !toStation || disabled) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const route = await calculateRoute();
      setState({ loading: false, error: null, data: route });
      
      const message = `Ruta encontrada. Te llevará aproximadamente ${route.duration} minutos${route.realTimeDelay ? ` con ${route.realTimeDelay} minutos de retraso` : ''}.`;
      onVoiceCommand?.(message);
      onRouteCalculated?.(route);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al calcular la ruta';
      setState({ loading: false, error: errorMessage, data: null });
      onVoiceCommand?.(`Error: ${errorMessage}`);
    }
  }, [fromStation, toStation, disabled, calculateRoute, onVoiceCommand, onRouteCalculated]);

  return (
    <div 
      className={cn(
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
      data-trip-planner
      tabIndex={-1}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <div className="w-3 h-3 bg-metro-red rounded-full flex-shrink-0 animate-pulse"></div>
        Planifica tu Viaje con IA
      </h3>
      
      <form onSubmit={handleSearch} className="space-y-5">
        <div className="relative">
          <label htmlFor="ai-from-station" className="sr-only">Estación de origen</label>
          <Combobox
            options={stationOptions}
            value={fromStation}
            onValueChange={setFromStation}
            placeholder="Desde... (puedes usar comandos de voz)"
            searchPlaceholder="Buscar estación de origen..."
            emptyMessage="No se encontró la estación."
            className="text-sm h-12 w-full"
            aria-describedby="from-station-help"
          />
          <div id="from-station-help" className="sr-only">
            Selecciona tu estación de origen
          </div>
        </div>
        
        <div className="relative">
          <label htmlFor="ai-to-station" className="sr-only">Estación de destino</label>
          <Combobox
            options={stationOptions}
            value={toStation}
            onValueChange={setToStation}
            placeholder="Hasta... (puedes usar comandos de voz)"
            searchPlaceholder="Buscar estación de destino..."
            emptyMessage="No se encontró la estación."
            className="text-sm h-12 w-full"
            aria-describedby="to-station-help"
          />
          <div id="to-station-help" className="sr-only">
            Selecciona tu estación de destino
          </div>
        </div>
        
        {state.error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <span className="text-sm text-red-700 dark:text-red-300">{state.error}</span>
          </div>
        )}
        
        <button 
          type="submit"
          className={cn(
            "w-full px-6 py-4 text-base font-bold rounded-xl transition-all duration-300 uppercase tracking-wide shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-3 transform hover:scale-105",
            (!fromStation || !toStation || state.loading)
              ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60" 
              : "bg-gradient-to-r from-metro-red to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-2xl focus:ring-red-500/50"
          )}
          disabled={!fromStation || !toStation || state.loading}
        >
          {state.loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Calculando Ruta IA...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              Buscar Ruta Inteligente
            </>
          )}
        </button>
      </form>
    </div>
  );
});

// Background Animation Component with preloading
const AnimatedBackground = memo(function AnimatedBackground({ 
  images, 
  currentIndex 
}: { 
  images: readonly string[]; 
  currentIndex: number;
}) {
  // Preload images for smoother transitions
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 1.5, 
            ease: [0.4, 0.0, 0.2, 1] 
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundPosition: 'center center',
            transform: 'translateZ(0)' // Force GPU acceleration
          }}
        />
      </AnimatePresence>
      {/* Enhanced gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
    </div>
  );
});

// Voice Control Interface Component
const VoiceControlInterface = memo(function VoiceControlInterface({
  isSupported,
  isListening,
  error,
  onToggle
}: {
  isSupported: boolean;
  isListening: boolean;
  error: string | null;
  onToggle: () => void;
}) {
  if (!isSupported) return null;

  return (
    <div className="absolute top-8 left-8 z-30">
      <motion.button
        onClick={onToggle}
        className={cn(
          "w-14 h-14 rounded-full backdrop-blur-lg border-2 flex items-center justify-center transition-all duration-300 shadow-lg",
          isListening 
            ? "bg-metro-red/90 border-white text-white animate-pulse" 
            : "bg-white/20 border-white/30 text-white hover:bg-white/30"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? "Detener comando de voz" : "Iniciar comando de voz"}
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </motion.button>
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 bg-black/80 backdrop-blur-lg rounded-lg px-3 py-2 max-w-48"
          >
            <p className="text-white text-sm font-medium">Escuchando...</p>
            <p className="text-white/70 text-xs mt-1">
              Di &quot;planificar viaje&quot; o &quot;estado del servicio&quot;
            </p>
          </motion.div>
        )}
        
        {error && !isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 bg-red-500/90 backdrop-blur-lg rounded-lg px-3 py-2 max-w-48"
          >
            <p className="text-white text-xs">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Main Hero Static Component
export function HeroStatic({ 
  className, 
  enableVoiceControl = true, 
  enableAIPersonalization = true,
  userContext: providedUserContext
}: HeroStaticProps) {
  const timeOfDay = useTimeOfDay();
  const tripPlannerRef = useRef<HTMLDivElement>(null);
  
  // Create user context with provided overrides
  const userContext = useMemo(() => 
    createMockUserContext({
      timeOfDay,
      ...providedUserContext
    }), [timeOfDay, providedUserContext]);

  // AI Personalization
  const { heroContent, personalizationScore } = useAIPersonalization(
    userContext, 
    enableAIPersonalization
  );
  
  // Voice control with command handling
  const handleVoiceCommand = useCallback((command: string, announceText?: (text: string) => void) => {
    switch (command) {
      case 'trip-planner':
        if (tripPlannerRef.current) {
          tripPlannerRef.current.scrollIntoView({ behavior: 'smooth' });
          tripPlannerRef.current.focus();
        }
        break;
      case 'service-status':
        window.location.href = '/service-status';
        break;
      case 'help':
        announceText?.('¿En qué puedo ayudarte? Puedes decir planificar viaje o estado del servicio');
        break;
      default:
        announceText?.('Comando no reconocido. Intenta decir planificar viaje, estado del servicio o ayuda');
    }
  }, []);

  const voice = useEnhancedVoiceControl(enableVoiceControl, (command: string) => 
    handleVoiceCommand(command, voice?.announceText)
  );
  
  // Background rotation
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, BACKGROUND_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // CTA Handlers
  const handlePrimaryCTA = useCallback(() => {
    if (heroContent.primaryCTA.action === 'trip-planner') {
      if (tripPlannerRef.current) {
        tripPlannerRef.current.scrollIntoView({ behavior: 'smooth' });
        tripPlannerRef.current.focus();
      }
    }
    voice.announceText(`Activando ${heroContent.primaryCTA.text}`);
  }, [heroContent.primaryCTA.action, heroContent.primaryCTA.text, voice]);

  const handleSecondaryCTA = useCallback(() => {
    const secondaryCTA = heroContent.secondaryCTA;
    if (!secondaryCTA) return;
    
    if (secondaryCTA.action === 'service-status') {
      window.location.href = '/service-status';
    } else if (secondaryCTA.action === 'about') {
      window.location.href = '/about';
    }
    voice.announceText(`Navegando a ${secondaryCTA.text}`);
  }, [heroContent.secondaryCTA, voice]);

  return (
    <section className={cn("relative w-full h-screen overflow-hidden", className)}>
      {/* Animated Background */}
      <AnimatedBackground images={BACKGROUND_IMAGES} currentIndex={backgroundIndex} />

      {/* Voice Control Interface */}
      <VoiceControlInterface
        isSupported={voice.isSupported}
        isListening={voice.isListening}
        error={voice.error?.message || null}
        onToggle={voice.isListening ? voice.stopListening : voice.startListening}
      />

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <motion.div
              key={heroContent.id} // Re-animate when content changes
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                {heroContent.title}
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed">
                {heroContent.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.button
                  onClick={handlePrimaryCTA}
                  className="bg-gradient-to-r from-metro-red to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {heroContent.primaryCTA.icon}
                  {heroContent.primaryCTA.text}
                </motion.button>
                
                {heroContent.secondaryCTA && (
                  <motion.button
                    onClick={handleSecondaryCTA}
                    className="bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {heroContent.secondaryCTA.icon}
                    {heroContent.secondaryCTA.text}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Widgets Section */}
      <div className="absolute bottom-12 right-12 z-20 max-w-md">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
          ref={tripPlannerRef}
        >
          {/* AI Trip Planner */}
          <AITripPlannerWidget 
            onVoiceCommand={voice.announceText}
            onRouteCalculated={(route) => {
              console.log('Route calculated:', route);
            }}
          />
          
          {/* Status Widgets */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/30 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10">
              <NetworkStatus className="text-sm" />
            </div>
            
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/30 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10">
              <ScheduleIndicator className="text-sm" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ARIA Live Region for Voice Feedback and Personalization */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Contenido personalizado: {heroContent.title}
        {voice.isListening && ', Control de voz activo'}
        {voice.lastCommand && `, Último comando: ${voice.lastCommand}`}
      </div>
      
      {/* Personalization Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs">
          <div>Content: {heroContent.id}</div>
          <div>Score: {personalizationScore.score}</div>
          <div>Factors: {personalizationScore.factors.length}</div>
        </div>
      )}
    </section>
  );
}