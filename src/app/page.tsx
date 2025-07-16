import { Metadata } from "next";
import { HeroCarousel } from "@/components/organisms";

export const metadata: Metadata = {
  title: "Metro de Santiago - Inicio",
  description: "Bienvenido al sistema de transporte metropolitano de Santiago de Chile. Planifica tu viaje, consulta horarios y descubre los servicios de Metro de Santiago.",
};

export default function Home() {
  // Hero carousel slides data
  const heroSlides = [
    {
      id: "slide-1",
      title: "Conectando Santiago desde hace casi 50 años",
      subtitle: "Tu sistema de transporte metropolitano desde 1975. Más de 140 estaciones distribuidas en 7 líneas conectando todos los rincones de la ciudad, transportando más de 2.5 millones de pasajeros diariamente.",
      ctaText: "Planificar Viaje",
      ctaAction: "/conexiones/planificador",
      backgroundImage: "/assets/images/placeholders/slides/2017-01.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-2", 
      title: "Viaja Inteligente con Tecnología BIP!",
      subtitle: "Usa tu tarjeta BIP! y disfruta de tarifas preferenciales integradas con todo el transporte público. Recarga fácil y rápido en nuestras estaciones, centros comerciales y aplicaciones móviles.",
      ctaText: "Conocer BIP!",
      ctaAction: "/tickets/bip",
      backgroundImage: "/assets/images/placeholders/slides/2017-02.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-3",
      title: "El Futuro del Transporte ya está en Construcción",
      subtitle: "Nuevas líneas 7, 8 y 9 en construcción para expandir la red metropolitana. Ampliando la conectividad para llegar a más comunas de Santiago y mejorar los tiempos de viaje de millones de santiaguinos.",
      ctaText: "Ver Proyectos",
      ctaAction: "/corporativo/proyectos",
      backgroundImage: "/assets/images/placeholders/slides/2017-03.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-4",
      title: "Metro 100% Sustentable y Responsable",
      subtitle: "Funcionamos con 100% energía renovable desde 2018. Comprometidos con el medio ambiente, la reducción de emisiones y la sustentabilidad urbana para las futuras generaciones.",
      ctaText: "Conocer Más",
      ctaAction: "/corporativo/sustentabilidad",
      backgroundImage: "/assets/images/placeholders/slides/2017-06.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-5",
      title: "Una Experiencia de Viaje Única en Latinoamérica",
      subtitle: "Estaciones modernas, cómodas y seguras diseñadas con los más altos estándares internacionales. Espacios accesibles, climatizados y equipados con la mejor tecnología para brindarte confort en cada viaje.",
      ctaText: "Explorar Estaciones",
      ctaAction: "/conexiones/estaciones",
      backgroundImage: "/assets/images/placeholders/slides/DSC_4297.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-6",
      title: "Tecnología de Vanguardia en Cada Detalle",
      subtitle: "Sistemas de control automático, señalización digital en tiempo real y tecnología de última generación. Garantizamos un servicio eficiente, puntual, seguro y confiable las 24 horas del día.",
      ctaText: "Conocer Tecnología",
      ctaAction: "/corporativo/tecnologia",
      backgroundImage: "/assets/images/placeholders/slides/_DSC0079.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-7",
      title: "Arte y Cultura al Alcance de Todos",
      subtitle: "MetroArte es el programa cultural más grande de Chile, transformando nuestras estaciones en galerías de arte gratuitas y accesibles. Más de 100 obras de artistas nacionales e internacionales para disfrutar en tu viaje diario.",
      ctaText: "Descubrir MetroArte",
      ctaAction: "/servicio/metroarte",
      backgroundImage: "/assets/images/placeholders/slides/_DSC0086.jpg",
      backgroundPosition: "center"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoPlayInterval={8000} />

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
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
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