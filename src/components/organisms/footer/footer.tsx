"use client";

import React from "react";
import { Logo } from "@/components/atoms";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { socialLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaTiktok, 
  FaSpotify 
} from "react-icons/fa";
import { 
  Phone, 
  MapPin, 
  Mail, 
  ExternalLink,
  Train,
  CreditCard,
  Building,
  Users,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const footerSections = [
    {
      title: "MetroServicio",
      icon: Train,
      links: [
        { label: "Planificador de Viajes", href: "/conexiones/planificador" },
        { label: "Estado del Servicio", href: "/servicio/estado" },
        { label: "Estaciones", href: "/conexiones/estaciones" },
        { label: "Mapa de Red", href: "/conexiones/mapa" },
        { label: "Horarios y Frecuencias", href: "/servicio/horarios" },
        { label: "Accesibilidad", href: "/conexiones/accesibilidad" }
      ]
    },
    {
      title: "Tarifas y Pagos",
      icon: CreditCard,
      links: [
        { label: "Tarjeta BIP!", href: "/tickets/bip" },
        { label: "Recarga BIP!", href: "/tickets/recarga" },
        { label: "Tarifas", href: "/tickets/tarifas" },
        { label: "Descuentos Estudiantiles", href: "/tickets/estudiantes" },
        { label: "Tercera Edad", href: "/tickets/tercera-edad" },
        { label: "Empresas", href: "/tickets/empresas" }
      ]
    },
    {
      title: "MetroCorporativo",
      icon: Building,
      links: [
        { label: "Acerca de Metro", href: "/corporativo/acerca" },
        { label: "Misión y Visión", href: "/corporativo/mision" },
        { label: "Sustentabilidad", href: "/corporativo/sustentabilidad" },
        { label: "Nuevos Proyectos", href: "/corporativo/proyectos" },
        { label: "Inversionistas", href: "/corporativo/inversionistas" },
        { label: "Transparencia", href: "/corporativo/transparencia" }
      ]
    },
    {
      title: "Atención al Cliente",
      icon: Users,
      links: [
        { label: "Centro de Llamados", href: "/servicio/centro-llamados" },
        { label: "Sugerencias y Reclamos", href: "/servicio/sugerencias" },
        { label: "Objetos Perdidos", href: "/servicio/objetos-perdidos" },
        { label: "Tours Guiados", href: "/servicio/tours" },
        { label: "MetroArte", href: "/servicio/metroarte" },
        { label: "Canal de Denuncias", href: "/servicio/denuncias" }
      ]
    },
    {
      title: "Aplicaciones y Sitios",
      icon: Smartphone,
      links: [
        { label: "App Metro de Santiago", href: "/app/metro" },
        { label: "Portal Web Principal", href: "https://www.metro.cl", external: true },
        { label: "Sitio de Transparencia", href: "/transparencia", external: true },
        { label: "MetroArte Cultural", href: "/metroarte", external: true },
        { label: "Mapa Interactivo", href: "/mapa-interactivo" },
        { label: "APIs para Desarrolladores", href: "/api" }
      ]
    }
  ];

  const legalLinks = [
    { label: "Política de Privacidad", href: "/legal/privacidad" },
    { label: "Términos de Uso", href: "/legal/terminos" },
    { label: "Normas de Uso", href: "/legal/normas" },
    { label: "Derechos del Pasajero", href: "/legal/derechos" },
    { label: "Mapa del Sitio", href: "/mapa-sitio" },
    { label: "Información Transparente", href: "/transparencia" }
  ];

  return (
    <footer className={cn("bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Media Section */}
        <div className="py-8 border-b border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Logo variant="lines" size="md" href="" className="h-12" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Síguenos en nuestras redes sociales
            </p>
            <div className="flex justify-center items-center gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon === 'facebook' ? FaFacebookF : 
                                    social.icon === 'instagram' ? FaInstagram :
                                    social.icon === 'twitter' ? FaTwitter :
                                    social.icon === 'music' && social.id === 'tiktok' ? FaTiktok :
                                    social.icon === 'music' && social.id === 'spotify' ? FaSpotify :
                                    FaFacebookF;
                return (
                  <Tooltip key={social.id}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-metro-red/10 text-metro-red dark:text-white hover:bg-metro-red hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-110"
                        aria-label={social.label}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {footerSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.title} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-metro-red" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-metro-red dark:hover:text-metro-red transition-colors duration-200 flex items-center gap-1 group"
                        >
                          <span>{link.label}</span>
                          {link.external && (
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-metro-red/10 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-metro-red" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Centro de Llamados</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">600 600 9292</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-metro-red/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-metro-red" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dirección</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Av. Libertador Bernardo O&apos;Higgins #1414</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-metro-red/10 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-metro-red" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Contacto Web</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">info@metro.cl</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          {/* Mobile: Vertical List */}
          <div className="md:hidden">
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label} className="text-center">
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-metro-red dark:hover:text-metro-red transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Desktop: Horizontal with red dots */}
          <div className="hidden md:block">
            <div className="flex flex-wrap justify-center items-center gap-2">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-metro-red dark:hover:text-metro-red transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="w-1 h-1 bg-metro-red rounded-full"></span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo variant="horizontal" size="sm" className="h-8" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Metro de Santiago S.A. Todos los derechos reservados.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Desarrollado con ❤️ por <Link href={'https://carlosroman.xyz/'} target={'_blank'}>{'Carlos Román'}</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}