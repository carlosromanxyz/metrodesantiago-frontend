"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { TIMEOUTS } from "@/lib/constants";

// Import the existing components we'll reuse
import { NetworkStatus } from "@/components/atoms/network-status/network-status";
import { ScheduleIndicator } from "@/components/atoms/schedule-indicator/schedule-indicator";

import type { HeroCarouselProps } from '@/types';

// Simplified Trip planner widget component
const TripPlannerWidget = () => {
  const [fromStation, setFromStation] = React.useState("");
  const [toStation, setToStation] = React.useState("");
  
  return (
    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-lg rounded-xl p-3 sm:p-4 shadow-xl border border-white/10 dark:border-black/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-metro-red rounded-full"></div>
        Planifica tu Viaje
      </h3>
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Desde..."
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full text-xs h-8 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Hasta..."
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full text-xs h-8 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <button 
          className="w-full px-3 py-2 min-h-[44px] bg-metro-red hover:bg-metro-red/90 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase touch-manipulation"
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
  autoPlayInterval = TIMEOUTS.HERO_CAROUSEL,
  className 
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isPlaying, isDragging, slides.length, autoPlayInterval]);

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

  // Drag gesture handlers optimized for mobile
  const handleDragStart = () => {
    setIsDragging(true);
    setIsPlaying(false); // Pause auto-play during drag
  };

  const handleDragEnd = (event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Mobile-optimized thresholds
    const isMobile = window.innerWidth < 768;
    const distanceThreshold = isMobile ? 50 : 100; // Lower threshold for mobile
    const velocityThreshold = isMobile ? 300 : 500; // Lower velocity threshold for mobile
    
    const velocity = Math.abs(info.velocity.x);
    const distance = Math.abs(info.offset.x);
    
    // Determine if we should change slides based on drag distance or velocity
    const shouldChangeSlide = distance > distanceThreshold || velocity > velocityThreshold;
    
    if (shouldChangeSlide) {
      if (info.offset.x > 0) {
        // Dragged right - go to previous slide
        goToPrevious();
      } else {
        // Dragged left - go to next slide
        goToNext();
      }
    }
    
    // Resume auto-play after a short delay if it was playing before
    setTimeout(() => {
      if (!isDragging) {
        setIsPlaying(true);
      }
    }, 1000);
  };

  // Touch event handlers for additional mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default touch behaviors that might interfere
    if (e.touches.length === 1) {
      e.preventDefault();
    }
  };

  return (
    <section 
      className={cn("relative w-full overflow-hidden h-dvh", className)}
      ref={constraintsRef}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut",
            // Performance optimizations
            type: "tween"
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-x select-none"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.15}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          whileDrag={{ 
            scale: 0.98,
            transition: { 
              duration: 0.1,
              type: "tween"
            }
          }}
          // Performance optimizations for mobile
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)", // Enable hardware acceleration
          }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
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
      <div className="absolute bottom-24 z-20 left-0 right-0 pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            <div className="w-full max-w-sm sm:max-w-md lg:w-96 2xl:w-auto 2xl:max-w-md space-y-3 sm:space-y-4 pointer-events-auto">
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md rounded-full px-6 py-3 pointer-events-auto">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center text-white hover:text-metro-red transition-colors touch-manipulation"
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
                  "w-2 h-2 min-h-[44px] min-w-[44px] sm:min-h-[16px] sm:min-w-[16px] rounded-full transition-all duration-300 touch-manipulation flex items-center justify-center",
                  index === currentSlide 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Ir al slide ${index + 1}`}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  index === currentSlide 
                    ? "bg-white" 
                    : "bg-white/50"
                )}></div>
              </button>
            ))}
          </div>

          {/* Previous/Next Buttons */}
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="w-8 h-8 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center text-white hover:text-metro-red transition-colors touch-manipulation"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="w-8 h-8 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center text-white hover:text-metro-red transition-colors touch-manipulation"
              aria-label="Siguiente slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 pointer-events-none">
        <div className="bg-black/20 backdrop-blur-md rounded-lg px-3 py-2">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-lg rounded-full p-4 shadow-2xl">
              <div className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                {isDragging ? "Arrastra para cambiar" : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}