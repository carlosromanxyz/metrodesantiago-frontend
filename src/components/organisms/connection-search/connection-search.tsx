"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Clock, 
  ArrowRight,
  RotateCcw,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logger";

export function ConnectionSearch() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureTime, setDepartureTime] = useState("now");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSearch = () => {
    logger.info("Searching route from", fromLocation, "to", toLocation);
  };

  return (
    <section className="py-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Planifica tu viaje
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Encuentra la mejor ruta en Metro y RED
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {/* From/To Inputs */}
              <div className="relative">
                <div className="grid grid-cols-1 gap-4">
                  {/* From Input */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                    <Input
                      placeholder="Desde (estación, dirección o lugar)"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSwapLocations}
                      className="rounded-full w-8 h-8 p-0"
                      title="Intercambiar origen y destino"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* To Input */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
                    <Input
                      placeholder="Hacia (estación, dirección o lugar)"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Time and Date Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hora de viaje
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="departure-time"
                        value="now"
                        checked={departureTime === "now"}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="mr-2 text-metro-red"
                      />
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Ahora</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="departure-time"
                        value="departure"
                        checked={departureTime === "departure"}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="mr-2 text-metro-red"
                      />
                      <span className="text-sm">Salida</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="departure-time"
                        value="arrival"
                        checked={departureTime === "arrival"}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        className="mr-2 text-metro-red"
                      />
                      <span className="text-sm">Llegada</span>
                    </label>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={!fromLocation || !toLocation}
                className="w-full bg-metro-red hover:bg-metro-red/90 text-white font-semibold py-3"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar conexión
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Aeropuerto SCL
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Estación Central
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Plaza Baquedano
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Las Condes
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}