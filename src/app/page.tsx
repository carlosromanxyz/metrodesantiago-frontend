import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metro de Santiago - Inicio",
  description: "Bienvenido al sistema de transporte metropolitano de Santiago de Chile. Planifica tu viaje, consulta horarios y descubre los servicios de Metro de Santiago.",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Bienvenido a Metro de Santiago
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Tu sistema de transporte metropolitano. Conectando Santiago desde 1975.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-metro-red hover:bg-metro-red/90 text-white rounded-lg font-semibold transition-colors">
                Planificar Viaje
              </button>
              <button className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-semibold transition-colors">
                Ver Mapa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Accesos Rápidos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Encuentra rápidamente lo que necesitas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder cards */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-metro-red/10 rounded-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Acción Rápida {i + 1}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Descripción de la acción disponible
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Status Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Estado del Servicio
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Información en tiempo real del estado de las líneas
            </p>
          </div>
          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>Estado del servicio - En construcción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Planner Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Planifica tu Viaje
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Encuentra la mejor ruta para llegar a tu destino utilizando el Metro de Santiago.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p>Planificador de viajes - En construcción</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Mapa interactivo</p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Noticias y Actualizaciones
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mantente informado sobre las últimas novedades del Metro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder news cards */}
            {[...Array(3)].map((_, i) => (
              <article
                key={i}
                className="bg-white dark:bg-black rounded-lg shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Noticia {i + 1}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Resumen de la noticia o actualización importante del Metro de Santiago.
                  </p>
                  <span className="text-xs text-metro-red font-medium">
                    Leer más →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-metro-red">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-metro-red/10 text-white/90 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier consulta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-metro-red hover:bg-gray-100 rounded-lg font-semibold transition-colors">
              Centro de Llamados
            </button>
            <button className="px-8 py-3 border border-white text-white hover:bg-white/10 rounded-lg font-semibold transition-colors">
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}