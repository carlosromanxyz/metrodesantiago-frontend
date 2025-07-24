"use client";

import { motion } from "framer-motion";
import { 
  Info, 
  Clock, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceNote {
  id: string;
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

const serviceNotes: ServiceNote[] = [
  {
    id: "1",
    type: "info",
    title: "Nuevos horarios de atención al cliente",
    description: "Nuestras oficinas de atención al cliente están abiertas de lunes a viernes de 8:00 a 18:00 hrs.",
    link: "#",
    linkText: "Ver ubicaciones"
  },
  {
    id: "2", 
    type: "success",
    title: "Tarjeta bip! ahora disponible en más puntos",
    description: "Puedes adquirir y recargar tu tarjeta bip! en más de 2,000 puntos de venta en Santiago.",
    link: "#",
    linkText: "Encontrar punto de venta"
  }
];

function ServiceNoteCard({ note, delay = 0 }: { note: ServiceNote; delay?: number }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "info": return <Info className="h-5 w-5 text-blue-600" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "info": return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10";
      case "warning": return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10";
      case "success": return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10";
      default: return "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl border p-4 ${getBorderColor(note.type)}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(note.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {note.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {note.description}
          </p>
          {note.link && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto font-medium text-metro-red hover:text-metro-red/80"
            >
              {note.linkText}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ServiceNotes() {
  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-metro-red" />
              Notas importantes del servicio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Mantente informado sobre actualizaciones y cambios en el servicio
            </p>
          </div>

          {/* Service Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceNotes.map((note, index) => (
              <ServiceNoteCard
                key={note.id}
                note={note}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}