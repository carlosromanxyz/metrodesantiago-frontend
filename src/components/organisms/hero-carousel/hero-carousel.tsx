"use client";

import { useState, useEffect } from "react";
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
    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-lg rounded-xl p-3 sm:p-4 shadow-xl border border-white/10 dark:border-black/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-metro-red rounded-full"></div>
        Planifica tu Viaje
      </h3>
      <div className="space-y-3">
        <div className="relative">
          <Combobox
            options={stationOptions}
            value={fromStation}
            onValueChange={setFromStation}
            placeholder="Desde..."
            searchPlaceholder="Buscar estación..."
            emptyMessage="No se encontró la estación."
            className="text-xs h-8 w-full"
          />
        </div>
        <div className="relative">
          <Combobox
            options={stationOptions}
            value={toStation}
            onValueChange={setToStation}
            placeholder="Hasta..."
            searchPlaceholder="Buscar estación..."
            emptyMessage="No se encontró la estación."
            className="text-xs h-8 w-full"
          />
        </div>
        <button 
          className="w-full px-3 py-2 bg-metro-red hover:bg-metro-red/90 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase"
          disabled={!fromStation || !toStation}
        >
          Buscar Ruta
        </button>
      </div>
    </div>
  );
};

export function HeroCarousel({ 
  slides, 
  autoPlayInterval = 5000,
  className 
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isPlaying, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section 
      className={cn("relative w-full overflow-hidden h-dvh", className)}
    >
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
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
            {/* Light overlay for better widget visibility */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Widgets Overlay - Above Navigation */}
      <div className="absolute bottom-24 z-20 left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            <div className="w-full max-w-sm sm:max-w-md lg:w-96 2xl:w-auto 2xl:max-w-md space-y-3 sm:space-y-4">
              {/* Trip Planner Widget */}
              <TripPlannerWidget />
              
              {/* Network Status & Schedule Side by Side */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white/70 dark:bg-black/70 backdrop-blur-lg rounded-xl p-2 sm:p-3 shadow-xl border border-white/10 dark:border-black/10">
                  <NetworkStatus className="text-xs" />
                </div>
                
                <div className="bg-white/70 dark:bg-black/70 backdrop-blur-lg rounded-xl p-2 sm:p-3 shadow-xl border border-white/10 dark:border-black/10">
                  <ScheduleIndicator className="text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - All Devices */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md rounded-full px-6 py-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-metro-red transition-colors"
            aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentSlide 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Previous/Next Buttons */}
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="w-8 h-8 flex items-center justify-center text-white hover:text-metro-red transition-colors"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="w-8 h-8 flex items-center justify-center text-white hover:text-metro-red transition-colors"
              aria-label="Siguiente slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-black/20 backdrop-blur-md rounded-lg px-3 py-2">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}