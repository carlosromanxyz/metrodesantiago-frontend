"use client";

import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  Construction,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Disruption {
  id: string;
  type: "construction" | "incident" | "maintenance";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  affectedLines: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

const disruptions: Disruption[] = [
  {
    id: "1",
    type: "construction",
    severity: "high",
    title: "Trabajos de mantención Línea 1",
    description: "Mantención programada en estaciones San Pablo y Neptuno. Servicio parcial los fines de semana.",
    affectedLines: ["L1"],
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    isActive: true
  },
  {
    id: "2", 
    type: "maintenance",
    severity: "medium",
    title: "Renovación de vías Línea 4A",
    description: "Trabajos de renovación de vías entre estaciones La Cisterna y San Ramón.",
    affectedLines: ["L4A"],
    startDate: "2024-01-20",
    endDate: "2024-03-15",
    isActive: true
  },
  {
    id: "3",
    type: "incident",
    severity: "low", 
    title: "Servicio normal en todas las líneas",
    description: "No hay incidencias reportadas en este momento. Todas las líneas operan con normalidad.",
    affectedLines: [],
    startDate: "2024-01-24",
    isActive: true
  }
];

function DisruptionCard({ disruption, delay = 0 }: { disruption: Disruption; delay?: number }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "construction": return <Construction className="h-5 w-5" />;
      case "incident": return <AlertTriangle className="h-5 w-5" />;
      case "maintenance": return <Info className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "high": return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-red-600";
      case "medium": return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10 text-orange-600";
      case "low": return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 text-green-600";
      default: return "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/10 text-gray-600";
    }
  };

  const getLineColor = (line: string) => {
    const lineColors: { [key: string]: string } = {
      "L1": "bg-red-600",
      "L2": "bg-yellow-500", 
      "L3": "bg-yellow-600",
      "L4": "bg-blue-600",
      "L4A": "bg-blue-400",
      "L5": "bg-green-600",
      "L6": "bg-purple-600"
    };
    return lineColors[line] || "bg-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl border p-4 ${getSeverityColors(disruption.severity)}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${getSeverityColors(disruption.severity)}`}>
          {getIcon(disruption.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {disruption.title}
            </h3>
            {disruption.affectedLines.length > 0 && (
              <div className="flex gap-1 ml-2">
                {disruption.affectedLines.map((line) => (
                  <span
                    key={line}
                    className={`inline-block px-2 py-1 text-xs font-bold text-white rounded ${getLineColor(line)}`}
                  >
                    {line}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {disruption.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                Desde {new Date(disruption.startDate).toLocaleDateString('es-CL')}
                {disruption.endDate && ` hasta ${new Date(disruption.endDate).toLocaleDateString('es-CL')}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TrafficDisruptions() {
  const activeDisruptions = disruptions.filter(d => d.isActive);

  return (
    <section className="py-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-metro-red" />
                Interrupciones del tráfico
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mantente informado sobre obras y mantenciones en la red
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ver todas
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {/* Disruptions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeDisruptions.map((disruption, index) => (
              <DisruptionCard
                key={disruption.id}
                disruption={disruption}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Quick Status */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Estado general de la red
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-metro-red hover:text-metro-red/80">
                Ver mapa en tiempo real
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}