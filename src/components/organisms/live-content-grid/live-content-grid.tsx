"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Smartphone, 
  CreditCard, 
  MapPin, 
  Clock,
  Users,
  Shield,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveContentItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  category: "app" | "service" | "info" | "contact";
  featured?: boolean;
}

const liveContentItems: LiveContentItem[] = [
  {
    id: "1",
    title: "App Metro de Santiago",
    description: "Planifica tu viaje, consulta horarios y recibe alertas en tiempo real",
    icon: <Smartphone className="h-5 w-5" />,
    link: "#",
    category: "app",
    featured: true
  },
  {
    id: "2",
    title: "Recarga tu tarjeta bip!",
    description: "Carga saldo online o encuentra puntos de recarga cercanos",
    icon: <CreditCard className="h-5 w-5" />,
    link: "#", 
    category: "service",
    featured: true
  },
  {
    id: "3",
    title: "Encuentra tu estación",
    description: "Busca estaciones, horarios y servicios disponibles",
    icon: <MapPin className="h-5 w-5" />,
    link: "#",
    category: "service"
  },
  {
    id: "4",
    title: "Horarios de servicio",
    description: "Consulta los horarios de apertura y cierre de todas las líneas",
    icon: <Clock className="h-5 w-5" />,
    link: "#",
    category: "info"
  },
  {
    id: "5",
    title: "Objetos perdidos",
    description: "Reporta o busca objetos extraviados en la red",
    icon: <Users className="h-5 w-5" />,
    link: "#",
    category: "service"
  },
  {
    id: "6",
    title: "Seguridad y emergencias",
    description: "Información sobre protocolos de seguridad y contactos de emergencia",
    icon: <Shield className="h-5 w-5" />,
    link: "#",
    category: "info"
  },
  {
    id: "7",
    title: "Call center 600 7007007",
    description: "Atención telefónica para consultas y reportes",
    icon: <Phone className="h-5 w-5" />,
    link: "#",
    category: "contact"
  },
  {
    id: "8",
    title: "Contáctanos",
    description: "Envía sugerencias, reclamos o consultas por correo electrónico",
    icon: <Mail className="h-5 w-5" />,
    link: "#",
    category: "contact"
  }
];

function LiveContentCard({ item, delay = 0 }: { item: LiveContentItem; delay?: number }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "app": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "service": return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "info": return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      case "contact": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`
        group cursor-pointer rounded-xl border p-4 hover:shadow-md transition-all duration-300
        ${item.featured ? 'md:col-span-2 lg:col-span-1' : ''}
        ${getCategoryColor(item.category)}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${getCategoryColor(item.category)}`}>
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-metro-red transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {item.description}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto font-medium text-metro-red hover:text-metro-red/80 group-hover:translate-x-1 transition-transform"
          >
            Acceder
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function LiveContentGrid() {
  const featuredItems = liveContentItems.filter(item => item.featured);
  const regularItems = liveContentItems.filter(item => !item.featured);

  return (
    <section className="py-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Servicios y aplicaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Herramientas digitales y servicios para mejorar tu experiencia de viaje
            </p>
          </div>

          {/* Featured Items */}
          {featuredItems.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredItems.map((item, index) => (
                  <LiveContentCard
                    key={item.id}
                    item={item}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularItems.map((item, index) => (
              <LiveContentCard
                key={item.id}
                item={item}
                delay={(featuredItems.length + index) * 0.1}
              />
            ))}
          </div>

          {/* Quick Access */}
          <div className="mt-8 p-6 bg-gradient-to-r from-metro-red/10 to-metro-red/5 dark:from-metro-red/20 dark:to-metro-red/10 rounded-2xl border border-metro-red/20">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                ¿Necesitas ayuda inmediata?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nuestro equipo de atención al cliente está disponible para ayudarte
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-metro-red hover:bg-metro-red/90 text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar 600 7007007
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar consulta
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}