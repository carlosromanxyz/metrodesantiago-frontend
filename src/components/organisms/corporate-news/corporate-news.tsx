"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/atoms";
import { TIMEOUTS } from "@/lib/constants";

// Corporate news data using existing images
const featuredNews = [
  {
    id: 1,
    title: "Metro inaugura nueva estación sustentable en Ñuñoa",
    description: "La nueva estación incorpora paneles solares y sistemas de reciclaje de agua, marcando un hito en la sustentabilidad del transporte público",
    image: "/assets/images/placeholders/slides/2017-01.jpg",
    category: "INFRAESTRUCTURA",
    date: "15 Jul 2024",
    link: "/noticias/nueva-estacion-sustentable"
  },
  {
    id: 2,
    title: "Metro S.A. anuncia inversión récord de $500M para expansión 2025",
    description: "El plan incluye la construcción de 3 nuevas estaciones y la modernización completa de la flota de trenes",
    image: "/assets/images/placeholders/slides/2017-02.jpg",
    category: "FINANCIERO",
    date: "12 Jul 2024",
    link: "/noticias/inversion-record-expansion"
  },
  {
    id: 3,
    title: "Nueva aplicación móvil integra inteligencia artificial",
    description: "La app Metro 4.0 utiliza IA para optimizar rutas en tiempo real y predecir tiempos de viaje con 95% de precisión",
    image: "/assets/images/placeholders/slides/2017-03.jpg",
    category: "TECNOLOGÍA",
    date: "10 Jul 2024",
    link: "/noticias/app-inteligencia-artificial"
  },
  {
    id: 4,
    title: "Metro obtiene certificación ISO 14001 por gestión ambiental",
    description: "Reconocimiento internacional por las políticas de sostenibilidad y reducción de huella de carbono",
    image: "/assets/images/placeholders/slides/2017-06.jpg",
    category: "RSE",
    date: "08 Jul 2024",
    link: "/noticias/certificacion-iso-14001"
  }
];

const latestNews = [
  {
    id: 5,
    title: "Metro reduce 30% emisiones de CO2 en 2024",
    thumbnail: "/assets/images/placeholders/slides/DSC_4297.jpg",
    category: "RSE",
    date: "15 Jul",
    link: "/noticias/reduccion-emisiones-co2"
  },
  {
    id: 6,
    title: "Construcción L8 avanza según cronograma",
    thumbnail: "/assets/images/placeholders/slides/_DSC0079.jpg",
    category: "EXPANSIÓN",
    date: "12 Jul",
    link: "/noticias/construccion-l8-cronograma"
  },
  {
    id: 7,
    title: "Nueva app móvil con IA para usuarios",
    thumbnail: "/assets/images/placeholders/slides/_DSC0086.jpg",
    category: "TECNOLOGÍA",
    date: "10 Jul",
    link: "/noticias/nueva-app-ia"
  },
  {
    id: 8,
    title: "Programa becas estudiantes 2024",
    thumbnail: "/assets/images/placeholders/slides/2017-01.jpg",
    category: "SOCIAL",
    date: "08 Jul",
    link: "/noticias/programa-becas-estudiantes"
  },
  {
    id: 9,
    title: "Resultados Q2 superan expectativas",
    thumbnail: "/assets/images/placeholders/slides/2017-02.jpg",
    category: "FINANCIERO",
    date: "05 Jul",
    link: "/noticias/resultados-q2-2024"
  },
  {
    id: 10,
    title: "Nueva estrategia corporativa 2025-2030",
    thumbnail: "/assets/images/placeholders/slides/2017-03.jpg",
    category: "CORPORATIVO",
    date: "03 Jul",
    link: "/noticias/estrategia-corporativa-2025"
  }
];

// Category colors mapping
const categoryColors = {
  "INFRAESTRUCTURA": "bg-metro-red/10 text-metro-red border-metro-red/20",
  "FINANCIERO": "bg-green-500/10 text-green-600 border-green-500/20",
  "TECNOLOGÍA": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "RSE": "bg-green-600/10 text-green-700 border-green-600/20",
  "EXPANSIÓN": "bg-metro-orange/10 text-metro-orange border-metro-orange/20",
  "SOCIAL": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "CORPORATIVO": "bg-gray-500/10 text-gray-600 border-gray-500/20"
};

// Featured News Carousel Component (Opción 1)
function FeaturedNewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredNews.length);
    }, TIMEOUTS.CORPORATE_NEWS);

    return () => clearInterval(interval);
  }, [isAutoPlay, isDragging]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredNews.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  // Drag gesture handlers
  const handleDragStart = () => {
    setIsDragging(true);
    setIsAutoPlay(false);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const isMobile = window.innerWidth < 768;
    const distanceThreshold = isMobile ? 50 : 80;
    const velocityThreshold = isMobile ? 300 : 400;
    
    const velocity = Math.abs(info.velocity.x);
    const distance = Math.abs(info.offset.x);
    
    const shouldChangeSlide = distance > distanceThreshold || velocity > velocityThreshold;
    
    if (shouldChangeSlide) {
      if (info.offset.x > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    
    setTimeout(() => {
      if (!isDragging) {
        setIsAutoPlay(true);
      }
    }, 1000);
  };

  const currentNews = featuredNews[currentIndex];

  return (
    <div 
      className="relative h-[300px] sm:h-[400px] xl:h-[500px] 2xl:h-[730px] bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
      ref={constraintsRef}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut",
            type: "tween"
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ 
            scale: 0.98,
            transition: { 
              duration: 0.1,
              type: "tween"
            }
          }}
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={currentNews.image}
              alt={currentNews.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-end p-3 sm:p-4 lg:p-6 text-white">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[currentNews.category as keyof typeof categoryColors]} bg-white dark:bg-black/90 backdrop-blur-sm`}>
                {currentNews.category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 leading-tight"
            >
              {currentNews.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4 line-clamp-2"
            >
              {currentNews.description}
            </motion.p>

            {/* Date and Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                {currentNews.date}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Leer más
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - All controls at top */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        {/* Left: Arrow Navigation */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={goToPrev}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Dots and Auto-play */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Dots Indicator */}
          <div className="flex gap-2">
            {featuredNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-white w-6" 
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Ir a noticia ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="text-white/70 hover:text-white text-xs cursor-pointer"
          >
            {isAutoPlay ? "⏸️" : "▶️"}
          </button>
        </div>
      </div>

      {/* Drag Indicator */}
      {isDragging && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-lg rounded-lg px-4 py-2 shadow-2xl">
              <div className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                Arrastra para cambiar
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Latest News List Component (Opción 1)
function LatestNewsList() {
  return (
    <div className="space-y-4">
      {/* Mobile: Title only, button below */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-metro-red flex-shrink-0" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Últimas Publicaciones
          </h3>
        </div>
      </div>

      {/* Desktop: Title and button side by side */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-metro-red flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Últimas Publicaciones
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="text-metro-red hover:text-metro-red/80">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver todas
        </Button>
      </div>

      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 xl:block xl:space-y-3">
        {latestNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <a
              href={news.link}
              className="flex items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-gray-800/50 hover:border-metro-red/30 dark:hover:border-metro-red/30 transition-all duration-200 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {news.date}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[news.category as keyof typeof categoryColors]}`}>
                    {news.category}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-metro-red transition-colors duration-200">
                  {news.title}
                </h4>
              </div>

              {/* Arrow indicator */}
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-metro-red transition-colors duration-200" />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Button below all news */}
      <div className="sm:hidden pt-4">
        <Button variant="ghost" size="sm" className="text-metro-red hover:text-metro-red/80 w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver todas
        </Button>
      </div>
    </div>
  );
}

// Main Corporate News Component (Opción 1)
export function CorporateNews() {
  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionTitle
          title="Metro informa"
          subtitle="Conoce las novedades más relevantes de Metro S.A."
          alignment="left"
          dotColor="red"
        />

        {/* News Grid */}
        <div className="space-y-6 xl:space-y-8">
          {/* Featured Carousel - Full width on tablets, 2/3 on XL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:grid xl:grid-cols-3 xl:gap-8"
          >
            <div className="xl:col-span-2">
              <FeaturedNewsCarousel />
            </div>

            {/* Right Panel - Latest News (only visible on XL) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden xl:block bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6"
            >
              <LatestNewsList />
            </motion.div>
          </motion.div>

          {/* Latest News - Full width on tablets, hidden on XL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="xl:hidden bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6"
          >
            <LatestNewsList />
          </motion.div>
        </div>
      </div>
    </section>
  );
}