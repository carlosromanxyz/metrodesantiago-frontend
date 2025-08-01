"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import existing components
import { uniqueStationNames, getStationLines } from "@/data/stations";
import { Combobox } from "@/components/ui/combobox";

// Lazy load non-critical components for better performance
const NetworkStatus = lazy(() => 
  import("@/components/atoms/network-status/network-status").then(module => ({
    default: module.NetworkStatus
  }))
);

const ScheduleIndicator = lazy(() => 
  import("@/components/atoms/schedule-indicator/schedule-indicator").then(module => ({
    default: module.ScheduleIndicator
  }))
);

// Types
interface TripPlannerState {
  readonly fromStation: string;
  readonly toStation: string;
  readonly isSearching: boolean;
  readonly error: string | null;
}

// Constants - Industrial approach with single static background
const HERO_IMAGE = '/assets/images/placeholders/slides/_DSC0086.jpg';
const SEARCH_TIMEOUT = 2000; // Simulate route calculation

// Optimized station options - memoized for performance
const getStationOptions = () => 
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
  });

// Loading skeleton for suspense fallback
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

// Simplified Trip Planner - Industrial approach
const IndustrialTripPlanner = () => {
  const [state, setState] = useState<TripPlannerState>({
    fromStation: "",
    toStation: "",
    isSearching: false,
    error: null
  });

  const stationOptions = getStationOptions();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!state.fromStation || !state.toStation) {
      setState(prev => ({ ...prev, error: "Selecciona estaciones de origen y destino" }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true, error: null }));

    // Simulate route calculation - in real app this would be an API call
    setTimeout(() => {
      setState(prev => ({ ...prev, isSearching: false }));
      // In real implementation, navigate to results page
      console.log(`Route from ${state.fromStation} to ${state.toStation}`);
    }, SEARCH_TIMEOUT);
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-metro-red flex-shrink-0" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Planifica tu Viaje
        </h2>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="from-station" className="sr-only">
            Estación de origen
          </label>
          <Combobox
            options={stationOptions}
            value={state.fromStation}
            onValueChange={(value) => setState(prev => ({ ...prev, fromStation: value, error: null }))}
            placeholder="Desde..."
            searchPlaceholder="Buscar estación de origen..."
            emptyMessage="No se encontró la estación."
            className="w-full"
            aria-describedby="from-station-help"
          />
          <div id="from-station-help" className="sr-only">
            Selecciona tu estación de origen
          </div>
        </div>

        <div>
          <label htmlFor="to-station" className="sr-only">
            Estación de destino
          </label>
          <Combobox
            options={stationOptions}
            value={state.toStation}
            onValueChange={(value) => setState(prev => ({ ...prev, toStation: value, error: null }))}
            placeholder="Hasta..."
            searchPlaceholder="Buscar estación de destino..."
            emptyMessage="No se encontró la estación."
            className="w-full"
            aria-describedby="to-station-help"
          />
          <div id="to-station-help" className="sr-only">
            Selecciona tu estación de destino
          </div>
        </div>

        {state.error && (
          <div 
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <span className="text-sm text-red-700 dark:text-red-300">
              {state.error}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={!state.fromStation || !state.toStation || state.isSearching}
          className={cn(
            "w-full px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2",
            (!state.fromStation || !state.toStation || state.isSearching)
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-metro-red hover:bg-red-700 focus:bg-red-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500/50"
          )}
        >
          {state.isSearching ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Buscando ruta...
            </>
          ) : (
            <>
              Buscar Ruta
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Status widgets container
const StatusWidgets = () => (
  <div className="grid xl:grid-cols-2 gap-4">
    <div className="bg-white dark:bg-black rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <Suspense fallback={<LoadingSkeleton />}>
        <NetworkStatus className="text-sm" />
      </Suspense>
    </div>

    <div className="bg-white dark:bg-black rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <Suspense fallback={<LoadingSkeleton />}>
        <ScheduleIndicator className="text-sm" />
      </Suspense>
    </div>
  </div>
);

// Image preloading hook for performance
const useImagePreload = (src: string) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.loading = "eager";
    img.fetchPriority = "high";
  }, [src]);
};

// Main Industrial Hero Component
export function HeroIndustrial({ className }: { className?: string }) {
  // Preload hero image for better LCP
  useImagePreload(HERO_IMAGE);

  return (
    <section 
      className={cn("relative min-h-screen overflow-hidden", className)}
      aria-labelledby="hero-heading"
    >
      {/* Single Static Background - No animations, optimized for performance */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          willChange: 'auto',
          transform: 'translate3d(0, 0, 0)', // GPU acceleration
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Simple overlay for text contrast - no gradients, better performance */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Main Content - Clean, focused layout */}
      <div className="relative h-full min-h-screen flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content - Single focused message */}
            <div className="max-w-2xl">
              <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
              >
                Metro de Santiago
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                Tu sistema de transporte metropolitano. Rápido, confiable y sustentable.
              </p>

              {/* Single Primary CTA - Always the same, no personalization */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    const tripPlanner = document.querySelector('[data-trip-planner]');
                    if (tripPlanner) {
                      tripPlanner.scrollIntoView({ behavior: 'smooth' });
                      (tripPlanner as HTMLElement).focus();
                    }
                  }}
                  className="bg-metro-red hover:bg-red-700 focus:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black/20"
                >
                  Planificar Viaje
                </button>

                <a 
                  href="/service-status"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg border border-white/30 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20"
                >
                  Estado del Servicio
                </a>
              </div>
            </div>

            {/* Trip Planner & Status - Prominent placement */}
            <div className="w-full space-y-6" data-trip-planner tabIndex={-1}>
              <IndustrialTripPlanner />
              <StatusWidgets />
            </div>

            </div>
          </div>
        </div>
      </div>

      {/* Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Página de inicio de Metro de Santiago cargada. Use Tab para navegar por las opciones.
      </div>
    </section>
  );
}