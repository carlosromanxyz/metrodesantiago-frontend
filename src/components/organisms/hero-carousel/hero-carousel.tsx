"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";

// Import stations data and UI components
import { uniqueStationNames, getStationLines } from "@/data/stations";
import { Combobox } from "@/components/ui/combobox";

// Import the existing components we'll reuse
import { NetworkStatus } from "@/components/atoms/network-status/network-status";
import { ScheduleIndicator } from "@/components/atoms/schedule-indicator/schedule-indicator";

interface HeroSlide {
  id: string;
  backgroundImage: string;
  backgroundPosition?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  className?: string;
}

// Trip planner widget component with station comboboxes
const TripPlannerWidget = () => {
  const [fromStation, setFromStation] = React.useState("");
  const [toStation, setToStation] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate search
    setTimeout(() => setIsLoading(false), 1500);
  };
  
  // Create options with line information
  const stationOptions = uniqueStationNames.map((station) => {
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
  
  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-2xl border border-white/30 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-metro-red rounded-full flex-shrink-0"></div>
        Planifica tu Viaje
      </h3>
      <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
        <div className="relative">
          <label htmlFor="from-station" className="sr-only">Estación de origen</label>
          <Combobox
            options={stationOptions}
            value={fromStation}
            onValueChange={setFromStation}
            placeholder="Desde..."
            searchPlaceholder="Buscar estación de origen..."
            emptyMessage="No se encontró la estación."
            className="text-sm h-10 w-full"
            aria-describedby="from-station-help"
          />
          <div id="from-station-help" className="sr-only">
            Selecciona tu estación de origen
          </div>
        </div>
        <div className="relative">
          <label htmlFor="to-station" className="sr-only">Estación de destino</label>
          <Combobox
            options={stationOptions}
            value={toStation}
            onValueChange={setToStation}
            placeholder="Hasta..."
            searchPlaceholder="Buscar estación de destino..."
            emptyMessage="No se encontró la estación."
            className="text-sm h-10 w-full"
            aria-describedby="to-station-help"
          />
          <div id="to-station-help" className="sr-only">
            Selecciona tu estación de destino
          </div>
        </div>
        <button 
          type="submit"
          className={cn(
            "w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 uppercase tracking-wide shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2",
            (!fromStation || !toStation || isLoading)
              ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60" 
              : "bg-metro-red hover:bg-red-700 focus:bg-red-700 text-white hover:shadow-xl focus:shadow-xl focus:ring-red-500/50 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
          )}
          disabled={!fromStation || !toStation || isLoading}
          aria-describedby="search-status"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Buscando...
            </>
          ) : (
            'Buscar Ruta'
          )}
        </button>
        <div id="search-status" className="sr-only" aria-live="polite">
          {isLoading ? "Buscando ruta..." : ""}
        </div>
      </form>
    </div>
  );
};

export function HeroCarousel({ 
  slides, 
  autoPlayInterval = 8000,
  className 
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Respect user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsPlaying(false);
      }
    };
    
    // Set initial state
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isPlaying, slides.length, autoPlayInterval]);

  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(slides.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, goToNext, goToPrevious, togglePlayPause, goToSlide]);

  return (
    <section 
      className={cn("relative w-full overflow-hidden h-dvh", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0.0, 0.2, 1] // Custom cubic-bezier for smoother feel
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].backgroundImage})`,
              backgroundPosition: slides[currentSlide].backgroundPosition || 'center'
            }}
          >
            {/* Enhanced overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/10"></div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Widgets Overlay - Above Navigation */}
      <div className="absolute bottom-24 z-20 left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm sm:max-w-md lg:w-96 2xl:w-auto 2xl:max-w-md space-y-4 sm:space-y-6">
              {/* Trip Planner Widget */}
              <TripPlannerWidget />
              
              {/* Network Status & Schedule Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-2xl border border-white/30 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10">
                  <NetworkStatus className="text-xs" />
                </div>
                
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-3 sm:p-4 shadow-2xl border border-white/30 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10">
                  <ScheduleIndicator className="text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - All Devices */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 sm:gap-6 bg-black/30 backdrop-blur-md rounded-full px-6 sm:px-8 py-3 sm:py-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-11 h-11 flex items-center justify-center text-white hover:text-metro-red hover:scale-110 focus:text-metro-red focus:scale-110 focus:outline-none focus:ring-2 focus:ring-metro-red/50 focus:ring-offset-2 focus:ring-offset-black/20 transition-all duration-300 ease-out transform rounded-full touch-manipulation"
            aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 focus:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation",
                  index === currentSlide 
                    ? "bg-white scale-125 shadow-lg" 
                    : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Ir al slide ${index + 1} de ${slides.length}`}
              />
            ))}
          </div>

          {/* Previous/Next Buttons */}
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="w-11 h-11 flex items-center justify-center text-white hover:text-metro-red hover:scale-110 focus:text-metro-red focus:scale-110 focus:outline-none focus:ring-2 focus:ring-metro-red/50 focus:ring-offset-2 focus:ring-offset-black/20 transition-all duration-300 ease-out transform rounded-full touch-manipulation"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="w-11 h-11 flex items-center justify-center text-white hover:text-metro-red hover:scale-110 focus:text-metro-red focus:scale-110 focus:outline-none focus:ring-2 focus:ring-metro-red/50 focus:ring-offset-2 focus:ring-offset-black/20 transition-all duration-300 ease-out transform rounded-full touch-manipulation"
              aria-label="Siguiente slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-black/30 backdrop-blur-md rounded-lg px-3 py-2">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
      
      {/* ARIA Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {currentSlide + 1} de {slides.length}
        {!isPlaying && ', carrusel pausado'}
      </div>
    </section>
  );
}