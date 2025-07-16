"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as React from "react";

// Import stations data and UI components
import { uniqueStationNames, getStationLines } from "@/data/stations";
import { Combobox } from "@/components/ui/combobox";

// Typewriter animation component
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + index * 0.02,
            duration: 0.1
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Import the existing components we'll reuse
import { NetworkStatus } from "@/components/atoms/network-status/network-status";
import { ScheduleIndicator } from "@/components/atoms/schedule-indicator/schedule-indicator";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction: string;
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
    <div className="bg-white/95 dark:bg-black/95 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/20 dark:border-black/30">
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
  const router = useRouter();

  const handleCtaClick = (action: string) => {
    router.push(action);
  };

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
    <section className={cn("relative h-screen w-full overflow-hidden", className)}>
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
            {/* Desktop Overlay */}
            <div className="absolute inset-0 bg-black/40 lg:block hidden"></div>
            
            {/* Mobile Gradient Overlay - Bottom to Top */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:hidden"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center lg:items-center items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full lg:h-auto items-center lg:items-center items-end pb-8 lg:pb-0">
                
                {/* Left Side - Content */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-center h-full lg:col-span-3 w-full"
                >
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                    className="relative max-w-4xl overflow-hidden w-full"
                  >
                    {/* Desktop Content Container - Metro Clean Design */}
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="relative bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-lg p-8 lg:p-10 shadow-2xl border-l-4 border-metro-red hidden lg:block"
                    >
                      {/* Metro Red Line Accent */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                        className="absolute left-0 top-0 w-1 bg-metro-red h-full origin-top"
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 ml-4">
                        <div className="space-y-6">
                          {/* Title with slide animation */}
                          <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight text-gray-900 dark:text-white"
                          >
                            <TypewriterText text={slides[currentSlide].title} delay={1.2} />
                          </motion.h1>
                          
                          {/* Separator line */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "4rem" }}
                            transition={{ duration: 0.6, delay: 1.8 }}
                            className="h-0.5 bg-metro-red/60"
                          />
                          
                          {/* Subtitle with slide animation */}
                          <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 2.0 }}
                            className="text-sm lg:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium"
                          >
                            <TypewriterText text={slides[currentSlide].subtitle} delay={2.2} />
                          </motion.p>
                          
                          {/* CTA Button with enhanced animation */}
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 3.0 }}
                          >
                            <motion.button
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 3.5, duration: 0.4, ease: "easeOut" }}
                              whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleCtaClick(slides[currentSlide].ctaAction)}
                              className="inline-flex items-center px-8 py-4 bg-metro-red hover:bg-metro-red/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-metro-red/20 border border-metro-red hover:border-metro-red/80"
                            >
                              <span className="mr-2">{slides[currentSlide].ctaText}</span>
                              <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                →
                              </motion.div>
                            </motion.button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile Content Container - Bottom Left Corner (Elevated) */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                      className="lg:hidden block w-full"
                    >
                      <div className="ml-4 mr-4 space-y-4 pb-20">
                        {/* Content with subtle background only behind text */}
                        <div className="inline-block bg-black/30 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                          <div className="text-left space-y-3">
                            {/* Title */}
                            <motion.h1
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.6, delay: 1.0 }}
                              className="text-xl sm:text-2xl font-bold leading-tight text-white"
                            >
                              <TypewriterText text={slides[currentSlide].title} delay={1.2} />
                            </motion.h1>
                            
                            {/* Subtitle */}
                            <motion.p
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.6, delay: 1.5 }}
                              className="text-sm text-white/90 leading-relaxed"
                            >
                              <TypewriterText text={slides[currentSlide].subtitle} delay={1.8} />
                            </motion.p>
                          </div>
                        </div>
                        
                        {/* CTA Button - Left aligned */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 2.0 }}
                          className="flex justify-start"
                        >
                          <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2.5, duration: 0.4, ease: "easeOut" }}
                            whileHover={{ 
                              scale: 1.05,
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCtaClick(slides[currentSlide].ctaAction)}
                            className="inline-flex items-center px-6 py-3 bg-metro-red hover:bg-metro-red/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-metro-red/20 text-sm"
                          >
                            <span className="mr-2">{slides[currentSlide].ctaText}</span>
                            <motion.div
                              initial={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              →
                            </motion.div>
                          </motion.button>
                        </motion.div>
                        
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right Side - Empty space for widgets overlay */}
                <div className="hidden lg:block lg:col-span-2"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Widgets Overlay - Within Container */}
      <div className="absolute top-1/2 transform -translate-y-1/2 z-20 hidden lg:block left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Left Side - Empty space for content */}
            <div className="col-span-3"></div>
            
            {/* Right Side - Widgets */}
            <div className="col-span-2 space-y-4">
              {/* Trip Planner Widget */}
              <TripPlannerWidget />
              
              {/* Network Status & Schedule Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/95 dark:bg-black/95 backdrop-blur-lg rounded-xl p-3 shadow-xl border border-white/20 dark:border-black/30">
                  <NetworkStatus className="text-xs" />
                </div>
                
                <div className="bg-white/95 dark:bg-black/95 backdrop-blur-lg rounded-xl p-3 shadow-xl border border-white/20 dark:border-black/30">
                  <ScheduleIndicator className="text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
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

      {/* Mobile Navigation Controls - Expanded with Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 lg:hidden">
        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md rounded-full px-6 py-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-metro-red transition-colors"
            aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Slide Indicators - Integrated */}
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