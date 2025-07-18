import { Metadata } from "next";
import { HeroCarousel, CorporateNews } from "@/components/organisms";

export const metadata: Metadata = {
  title: "Metro de Santiago - Inicio",
  description: "Bienvenido al sistema de transporte metropolitano de Santiago de Chile. Planifica tu viaje, consulta horarios y descubre los servicios de Metro de Santiago.",
};

export default function Home() {
  // Hero carousel slides data - Simplified for image-only display
  const heroSlides = [
    {
      id: "slide-1",
      backgroundImage: "/assets/images/placeholders/slides/2017-01.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-2", 
      backgroundImage: "/assets/images/placeholders/slides/2017-02.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-3",
      backgroundImage: "/assets/images/placeholders/slides/2017-03.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-4",
      backgroundImage: "/assets/images/placeholders/slides/2017-06.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-5",
      backgroundImage: "/assets/images/placeholders/slides/DSC_4297.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-6",
      backgroundImage: "/assets/images/placeholders/slides/_DSC0079.jpg",
      backgroundPosition: "center"
    },
    {
      id: "slide-7",
      backgroundImage: "/assets/images/placeholders/slides/_DSC0086.jpg",
      backgroundPosition: "center"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoPlayInterval={8000} />

      {/* Corporate News Section */}
      <CorporateNews />

    </div>
  );
}