import { Metadata } from "next";
import { 
  CorporateNews, 
  BvgSections
} from "@/components/organisms";
import { HeroIndustrial } from "@/components/organisms/hero-industrial/hero-industrial";

export const metadata: Metadata = {
  title: "Metro de Santiago - Inicio",
  description: "Bienvenido al sistema de transporte metropolitano de Santiago de Chile. Planifica tu viaje, consulta horarios y descubre los servicios de Metro de Santiago.",
};

export default function Home() {

  return (
    <div className="min-h-screen">
      {/* Industrial Hero - Clean, Performance-First */}
      <HeroIndustrial />

      {/* Corporate News Section */}
      <CorporateNews />

      {/* BVG-Style Two-Column Sections */}
      <BvgSections />
    </div>
  );
}