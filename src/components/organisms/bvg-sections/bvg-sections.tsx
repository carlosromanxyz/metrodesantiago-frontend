"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  ArrowRight,
  Download,
  Route,
  MapPin,
  Construction,
  Clock,
  Train
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineIndicator } from "@/components/atoms/line-indicator";
import { metroLines } from "@/data/stations";

interface Disruption {
  id: string;
  title: string;
  description: string;
  status: "active" | "planned" | "resolved";
  affectedLines: string[];
}

interface TransportTeaser {
  id: string;
  title: string;
  subline: string;
  link: string;
  icon: React.ReactNode;
  imageUrl: string;
}

interface TrainArrival {
  line: string;
  currentStation: string;
  destination: string;
  arrivalTime: number; // minutos
  trainType: "Largo" | "Corto";
  model: string;
  cars: CarStatus[];
}

interface CarStatus {
  id: number;
  occupancy: "empty" | "medium" | "full";
}

const currentDisruptions: Disruption[] = [
  {
    id: "1",
    title: "Mantención Línea 1 - Estaciones San Pablo y Neptuno",
    description: "Trabajos de mantención programada los fines de semana",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "2", 
    title: "Renovación de vías Línea 4A",
    description: "Trabajos entre La Cisterna y San Ramón hasta marzo",
    status: "planned",
    affectedLines: ["L4A"]
  },
  {
    id: "3",
    title: "Mantención escaleras mecánicas L2 - Los Héroes",
    description: "Reparación de escaleras mecánicas durante horarios nocturnos",
    status: "active",
    affectedLines: ["L2"]
  },
  {
    id: "4",
    title: "Renovación de señalética L5 - Quinta Normal a Maipú",
    description: "Actualización de señalética en 8 estaciones",
    status: "planned",
    affectedLines: ["L5"]
  },
  {
    id: "5",
    title: "Mantención sistema eléctrico L3 - Plaza de Armas",
    description: "Trabajos en subestación eléctrica madrugadas",
    status: "active",
    affectedLines: ["L3"]
  },
  {
    id: "6",
    title: "Renovación torniquetes L6 - Cerrillos a Ñuñoa",
    description: "Instalación de nuevos sistemas de acceso",
    status: "planned",
    affectedLines: ["L6"]
  },
  {
    id: "7",
    title: "Mantención andenes L1 - Universidad de Chile",
    description: "Reparación de pavimento de andenes centrales",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "8",
    title: "Instalación cámaras de seguridad L4 - Tobalaba",
    description: "Mejoras en sistema de videovigilancia",
    status: "planned",
    affectedLines: ["L4"]
  },
  {
    id: "9",
    title: "Mantención túneles L2 - Cal y Canto a Maipú",
    description: "Inspección y mantención de infraestructura",
    status: "active",
    affectedLines: ["L2"]
  },
  {
    id: "10",
    title: "Renovación luminarias L5 - Plaza de Maipú",
    description: "Cambio a tecnología LED en toda la estación",
    status: "planned",
    affectedLines: ["L5"]
  },
  {
    id: "11",
    title: "Mantención ascensores L3 - Baquedano",
    description: "Revisión técnica de todos los ascensores",
    status: "active",
    affectedLines: ["L3"]
  },
  {
    id: "12",
    title: "Reparación techos L6 - Franklin",
    description: "Trabajos de impermeabilización nocturos",
    status: "planned",
    affectedLines: ["L6"]
  },
  {
    id: "13",
    title: "Mantención vías L1 - Las Rejas a San Pablo",
    description: "Soldadura y nivelación de rieles",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "14",
    title: "Instalación wifi L4A - La Cisterna",
    description: "Ampliación de cobertura de internet gratuito",
    status: "planned",
    affectedLines: ["L4A"]
  },
  {
    id: "15",
    title: "Mantención sistema de ventilación L2 - Santa Ana",
    description: "Limpieza y calibración de extractores",
    status: "active",
    affectedLines: ["L2"]
  },
  {
    id: "16",
    title: "Renovación baños L5 - Pudahuel",
    description: "Modernización completa de servicios higiénicos",
    status: "planned",
    affectedLines: ["L5"]
  },
  {
    id: "17",
    title: "Mantención puertas de andén L3 - Manuel Montt",
    description: "Ajuste y lubricación de mecanismos",
    status: "active",
    affectedLines: ["L3"]
  },
  {
    id: "18",
    title: "Instalación paneles informativos L6 - Bio Bio",
    description: "Nuevas pantallas de información en tiempo real",
    status: "planned",
    affectedLines: ["L6"]
  },
  {
    id: "19",
    title: "Mantención catenaria L1 - Escuela Militar",
    description: "Revisión del sistema de alimentación eléctrica",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "20",
    title: "Renovación pisos L4 - Vicente Valdés",
    description: "Cambio de baldosas y señalización táctil",
    status: "planned",
    affectedLines: ["L4"]
  },
  {
    id: "21",
    title: "Mantención bombas de agua L2 - Dorsal",
    description: "Revisión sistema de drenaje de túneles",
    status: "active",
    affectedLines: ["L2"]
  },
  {
    id: "22",
    title: "Instalación cargadores USB L5 - Las Parcelas",
    description: "Puntos de carga gratuitos para dispositivos",
    status: "planned",
    affectedLines: ["L5"]
  },
  {
    id: "23",
    title: "Mantención aires acondicionados L3 - Plaza Italia",
    description: "Servicio técnico de climatización",
    status: "active",
    affectedLines: ["L3"]
  },
  {
    id: "24",
    title: "Renovación sistema de audio L6 - Ñuble",
    description: "Mejora en calidad de anuncios",
    status: "planned",
    affectedLines: ["L6"]
  },
  {
    id: "25",
    title: "Mantención rieles L1 - Universidad Católica",
    description: "Pulido y rectificación de superficie",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "26",
    title: "Instalación desfibriladores L4A - Vicuña Mackenna",
    description: "Equipos de emergencia médica",
    status: "planned",
    affectedLines: ["L4A"]
  },
  {
    id: "27",
    title: "Mantención estación L2 - Franklin",
    description: "Pintura y limpieza profunda de instalaciones",
    status: "active",
    affectedLines: ["L2"]
  },
  {
    id: "28",
    title: "Renovación boleterías L5 - San Alberto Hurtado",
    description: "Modernización de puntos de atención",
    status: "planned",
    affectedLines: ["L5"]
  },
  {
    id: "29",
    title: "Mantención grupos electrógenos L3 - Salvador",
    description: "Revisión sistemas de emergencia eléctrica",
    status: "active",
    affectedLines: ["L3"]
  },
  {
    id: "30",
    title: "Instalación espejos de seguridad L6 - Stadium",
    description: "Mejoras en puntos ciegos de andenes",
    status: "planned",
    affectedLines: ["L6"]
  },
  {
    id: "31",
    title: "Mantención transformadores L1 - Baquedano",
    description: "Revisión de equipos de alta tensión",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "32",
    title: "Renovación mapas de red L4 - Grecia",
    description: "Actualización de planos en estación",
    status: "planned",
    affectedLines: ["L4"]
  },
  {
    id: "33",
    title: "Mantención detectores de humo L2 - Rondizzoni",
    description: "Calibración sistema contraincendios",
    status: "active",
    affectedLines: ["L2"]
  },
  {
    id: "34",
    title: "Instalación biciparkings L5 - Laguna Sur",
    description: "Nuevos estacionamientos para bicicletas",
    status: "planned",
    affectedLines: ["L5"]
  },
  {
    id: "35",
    title: "Mantención conexiones L3 - Irarrázaval",
    description: "Revisión de empalmes eléctricos",
    status: "active",
    affectedLines: ["L3"]
  },
  {
    id: "36",
    title: "Renovación marquesinas L6 - Los Leones",
    description: "Reparación de cubiertas exteriores",
    status: "planned",
    affectedLines: ["L6"]
  },
  {
    id: "37",
    title: "Mantención válvulas L1 - Toesca",
    description: "Sistema hidráulico de emergencia",
    status: "active",
    affectedLines: ["L1"]
  },
  {
    id: "38",
    title: "Instalación punto limpio L4A - Hospital Sótero del Río",
    description: "Centro de reciclaje en estación",
    status: "planned",
    affectedLines: ["L4A"]
  }
];

const transportTeasers: TransportTeaser[] = [
  {
    id: "1",
    title: "Descargar mapas de la red",
    subline: "Metro, buses, tren y conexiones",
    link: "#",
    icon: <Download className="h-4 w-4" />,
    imageUrl: "/assets/images/placeholders/network-map.jpg"
  },
  {
    id: "2",
    title: "Rutas digitales", 
    subline: "Toda la info sobre tu línea",
    link: "#",
    icon: <Route className="h-4 w-4" />,
    imageUrl: "/assets/images/placeholders/digital-routes.jpg"
  },
  {
    id: "3",
    title: "Vista general de estaciones",
    subline: "Todas las estaciones de un vistazo",
    link: "#",
    icon: <MapPin className="h-4 w-4" />,
    imageUrl: "/assets/images/placeholders/stations-overview.jpg"
  }
];

// Función para generar datos realistas de trenes basados en el parque real 2025
const generateTrainData = (): TrainArrival[] => {
  // Configuraciones reales por línea basadas en el parque 2025
  const lineConfigs = {
    1: [
      { model: "NS-93", cars: 6, weight: 0.5 },   // NS-93
      { model: "NS-2007", cars: 9, weight: 0.3 }, // CAF 2007
      { model: "NS-2010", cars: 8, weight: 0.2 }  // NS-2010
    ],
    2: [
      { model: "NS-2016", cars: 7, weight: 0.7 }, // Alstom 2016
      { model: "NS-2004", cars: 6, weight: 0.3 }  // NS-2004
    ],
    3: [
      { model: "AS-2014", cars: 6, weight: 1.0 }  // Solo CAF 2014
    ],
    4: [
      { model: "AS-2002", cars: 3, weight: 1.0 }  // Solo Alstom 2002
    ],
    41: [  // Línea 4A
      { model: "AS-2002", cars: 3, weight: 1.0 }  // Solo Alstom 2002
    ],
    5: [
      { model: "NS-1974", cars: 5, weight: 0.6 }, // Trenes antiguos
      { model: "NS-93", cars: 6, weight: 0.4 }    // NS-93
    ],
    6: [
      { model: "AS-2014", cars: 6, weight: 1.0 }  // Solo CAF 2014
    ]
  };
  
  const generateCars = (carCount: number): CarStatus[] => {
    const occupancies: ("empty" | "medium" | "full")[] = ["empty", "medium", "full"];
    
    return Array.from({ length: carCount }, (_, i) => ({
      id: i + 1,
      occupancy: occupancies[Math.floor(Math.random() * occupancies.length)]
    }));
  };

  const selectTrainForLine = (lineNumber: number) => {
    const configs = lineConfigs[lineNumber as keyof typeof lineConfigs];
    const random = Math.random();
    let cumulative = 0;
    
    for (const config of configs) {
      cumulative += config.weight;
      if (random <= cumulative) {
        return config;
      }
    }
    return configs[0]; // Fallback
  };

  return metroLines.map((line) => {
    const trainConfig = selectTrainForLine(line.number);
    const stations = line.stations;
    const terminals = [stations[0], stations[stations.length - 1]];
    
    // Seleccionar estación intermedia aleatoria (no terminal)
    const intermediateStations = stations.slice(1, -1);
    const currentStation = intermediateStations[Math.floor(Math.random() * intermediateStations.length)];
    
    // Seleccionar terminal de destino
    const destination = terminals[Math.floor(Math.random() * 2)];
    
    return {
      line: `L${line.number}`,
      currentStation,
      destination,
      arrivalTime: Math.floor(Math.random() * 8) + 1, // 1-8 minutos
      trainType: trainConfig.cars >= 7 ? "Largo" as const : "Corto" as const,
      model: trainConfig.model,
      cars: generateCars(trainConfig.cars)
    };
  });
};

function DisruptionItem({ disruption }: { disruption: Disruption }) {
  const getLineColor = (line: string) => {
    const metroLine = metroLines.find(l => l.number.toString() === line.replace('L', '') || 
                                     (line === 'L4A' && l.number === 41));
    if (!metroLine) return "bg-gray-600";
    
    // Convert hex to Tailwind classes (approximation)
    const hexToTailwind: { [key: string]: string } = {
      "#E10E0E": "bg-red-600",     // L1
      "#FFD100": "bg-yellow-400",  // L2  
      "#8B4513": "bg-yellow-600",  // L3
      "#0066CC": "bg-blue-600",    // L4
      "#00A4E4": "bg-blue-400",    // L4A
      "#00B04F": "bg-green-600",   // L5
      "#8B1FA9": "bg-purple-600"   // L6
    };
    
    return hexToTailwind[metroLine.colorHex] || "bg-gray-600";
  };

  return (
    <div className="flex items-start gap-3">
      <Construction className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          {disruption.title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {disruption.description}
        </p>
        <div className="flex gap-1">
          {disruption.affectedLines.map((line) => (
            <span
              key={line}
              className={`inline-block px-2 py-0.5 text-xs font-bold text-white rounded ${getLineColor(line)}`}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StationDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextTrain, setNextTrain] = useState<TrainArrival | null>(null);
  const [allTrains, setAllTrains] = useState<TrainArrival[]>([]);

  // Inicializar datos una sola vez
  useEffect(() => {
    const initialTrains = generateTrainData();
    setAllTrains(initialTrains);
    setNextTrain(initialTrains[0]);
  }, []);

  // Actualizar hora cada segundo
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Generar nuevos datos cada 30 segundos
  useEffect(() => {
    const dataInterval = setInterval(() => {
      const trains = generateTrainData();
      setAllTrains(trains);
      setNextTrain(trains[0]);
    }, 30000);

    return () => clearInterval(dataInterval);
  }, []);

  // Rotar entre trenes cada 5 segundos
  useEffect(() => {
    if (allTrains.length === 0) return;

    let currentIndex = 0;
    const rotationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % allTrains.length;
      setNextTrain(allTrains[currentIndex]);
    }, 5000);

    return () => clearInterval(rotationInterval);
  }, [allTrains]);

  const getLineNumber = (line: string): number => {
    if (line === "L4A") return 41;
    return parseInt(line.replace('L', ''));
  };

  const getOccupancyColor = (occupancy: "empty" | "medium" | "full") => {
    switch (occupancy) {
      case "empty": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "full": return "bg-red-500";
    }
  };

  if (!nextTrain) return null;

  return (
    <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-lg border-2 border-gray-700">
      {/* Header de pantalla */}
      <div className="flex justify-between items-center mb-3 border-b border-green-400 pb-2">
        <div className="flex items-center gap-1">
          <Train className="h-3 w-3" />
          <span className="text-xs">PRÓXIMO TREN</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className="text-xs">
            {currentTime.toLocaleTimeString('es-CL', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Información del próximo tren */}
      <div className="border border-green-600 rounded p-3 bg-gray-900">
        {/* Línea y ruta */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <LineIndicator 
              lineNumber={getLineNumber(nextTrain.line)} 
              hexColor={metroLines.find(line => line.number === getLineNumber(nextTrain.line))?.colorHex || "#666666"}
              size="sm"
              className="font-sans flex-shrink-0"
            />
            <span className="text-xs text-green-300 leading-tight">{nextTrain.currentStation} → {nextTrain.destination}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-yellow-400 font-bold leading-none">{nextTrain.arrivalTime} min</div>
          </div>
        </div>

        {/* Tipo, modelo y diagrama */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{nextTrain.trainType} - {nextTrain.model}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{nextTrain.cars.length} vagones</span>
            <div className="flex gap-1">
              {nextTrain.cars.map((car) => (
                <div
                  key={car.id}
                  className={`w-6 h-3 rounded-sm ${getOccupancyColor(car.occupancy)} border border-gray-600`}
                  title={`Vagón ${car.id}: ${car.occupancy === 'empty' ? 'Vacío' : car.occupancy === 'medium' ? 'Medio' : 'Lleno'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransportTeaserCard({ teaser }: { teaser: TransportTeaser }) {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
        <div className="flex items-center h-24">
          {/* Content */}
          <div className="flex-1 p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-metro-red transition-colors mb-1">
              {teaser.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {teaser.subline}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-xs font-medium text-metro-red hover:text-metro-red/80"
            >
              Ver más
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          {/* Image/Icon on the right */}
          <div className="w-24 h-24 bg-gradient-to-br from-metro-red/20 to-metro-red/40 flex items-center justify-center flex-shrink-0">
            <div className="text-2xl text-metro-red/60">
              {teaser.icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BvgSections() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentDisruptions.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentDisruptions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? currentDisruptions.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Construction measures and traffic disruptions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-auto lg:h-[420px] flex flex-col"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Zonas de construcción e interrupciones de tránsito
                </h2>
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  Ver todas
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aquí encontrarás información sobre las interrupciones de servicio y las zonas de construcción actuales.
              </p>
            </div>

            {/* Carrusel de interrupciones */}
            <div className="flex-1">
              {/* Contenido del carrusel */}
              <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <DisruptionItem disruption={currentDisruptions[currentIndex]} />
                </motion.div>
                
                {/* Botones de navegación */}
                <div className="absolute top-2 right-4 flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevSlide}
                    className="w-6 h-6 p-0 rounded-full"
                    title="Anterior"
                  >
                    ←
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextSlide}
                    className="w-6 h-6 p-0 rounded-full"
                    title="Siguiente"
                  >
                    →
                  </Button>
                </div>
                
                {/* Indicador de posición */}
                <div className="absolute bottom-2 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {currentIndex + 1} / {currentDisruptions.length}
                </div>
              </div>
              
              {/* Botón móvil */}
              <div className="mt-3 lg:hidden">
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas las interrupciones
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </div>

            {/* Pantalla de estación */}
            <div className="mt-6">
              <StationDisplay />
            </div>
          </motion.div>

          {/* Right Section: Transport Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Transporte público en Santiago
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {transportTeasers.map((teaser) => (
                <TransportTeaserCard key={teaser.id} teaser={teaser} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}