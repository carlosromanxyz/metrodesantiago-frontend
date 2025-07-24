"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bus, Train, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TransportTeaser {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  link: string;
  icon: React.ReactNode;
  category: string;
}

const transportTeasers: TransportTeaser[] = [
  {
    id: "1",
    title: "RED Metropolitana de Movilidad",
    subtitle: "Buses integrados",
    description: "Conecta con la red de buses que complementa perfectamente el sistema Metro",
    imageUrl: "/assets/images/placeholders/red-bus.jpg",
    link: "#",
    icon: <Bus className="h-5 w-5" />,
    category: "Buses"
  },
  {
    id: "2", 
    title: "MetroTren Nos",
    subtitle: "Tren de cercanías",
    description: "Servicio ferroviario que conecta Santiago con las comunas del sur",
    imageUrl: "/assets/images/placeholders/metrotren.jpg", 
    link: "#",
    icon: <Train className="h-5 w-5" />,
    category: "Tren"
  },
  {
    id: "3",
    title: "Bikesantiago",
    subtitle: "Sistema de bicicletas públicas",
    description: "Red de bicicletas compartidas para complementar tu viaje en transporte público",
    imageUrl: "/assets/images/placeholders/bikesantiago.jpg",
    link: "#", 
    icon: <Bike className="h-5 w-5" />,
    category: "Bicicletas"
  }
];

function TransportTeaserCard({ teaser, delay = 0 }: { teaser: TransportTeaser; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group cursor-pointer"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-2">
              <div className="text-metro-red">
                {teaser.icon}
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-metro-red text-white px-3 py-1 rounded-full text-xs font-medium">
              {teaser.category}
            </span>
          </div>
          {/* Placeholder for actual image */}
          <div className="w-full h-full bg-gradient-to-br from-metro-red/20 to-metro-red/40 flex items-center justify-center">
            <div className="text-6xl text-metro-red/30">
              {teaser.icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-metro-red transition-colors">
              {teaser.title}
            </h3>
            <p className="text-sm font-medium text-metro-red">
              {teaser.subtitle}
            </p>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {teaser.description}
          </p>

          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-auto font-medium text-metro-red hover:text-metro-red/80 group-hover:translate-x-1 transition-transform"
          >
            Más información
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function TransportTeasers() {
  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Transporte público en Santiago
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre todas las opciones de movilidad que complementan el sistema Metro
            </p>
          </div>

          {/* Teasers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transportTeasers.map((teaser, index) => (
              <TransportTeaserCard
                key={teaser.id}
                teaser={teaser}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Ver toda la red de transporte
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}