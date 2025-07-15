export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

// Main navigation structure inspired by Berlin Metro but with Santiago Metro content
export const mainNavigation: NavigationItem[] = [
  {
    id: "home",
    label: "Inicio",
    href: "/",
    icon: "home"
  },
  {
    id: "connections",
    label: "Conexiones",
    href: "/conexiones",
    icon: "route",
    children: [
      {
        id: "trip-planner",
        label: "Planificador de Viajes",
        href: "/conexiones/planificador"
      },
      {
        id: "network-map",
        label: "Mapa de Red",
        href: "/conexiones/mapa"
      },
      {
        id: "stations",
        label: "Estaciones",
        href: "/conexiones/estaciones"
      },
      {
        id: "lines",
        label: "Líneas",
        href: "/conexiones/lineas"
      },
      {
        id: "accessibility",
        label: "Accesibilidad",
        href: "/conexiones/accesibilidad"
      }
    ]
  },
  {
    id: "tickets",
    label: "Tickets y Tarifas",
    href: "/tickets",
    icon: "credit-card",
    children: [
      {
        id: "bip-card",
        label: "Tarjeta BIP!",
        href: "/tickets/bip"
      },
      {
        id: "fares",
        label: "Tarifas",
        href: "/tickets/tarifas"
      },
      {
        id: "student-discounts",
        label: "Descuentos Estudiantiles",
        href: "/tickets/estudiantes"
      },
      {
        id: "senior-discounts",
        label: "Tercera Edad",
        href: "/tickets/tercera-edad"
      },
      {
        id: "corporate",
        label: "Empresas",
        href: "/tickets/empresas"
      }
    ]
  },
  {
    id: "service",
    label: "Servicio",
    href: "/servicio",
    icon: "info",
    children: [
      {
        id: "service-status",
        label: "Estado del Servicio",
        href: "/servicio/estado"
      },
      {
        id: "disruptions",
        label: "Interrupciones",
        href: "/servicio/interrupciones"
      },
      {
        id: "schedules",
        label: "Horarios",
        href: "/servicio/horarios"
      },
      {
        id: "frequency",
        label: "Frecuencia",
        href: "/servicio/frecuencia"
      },
      {
        id: "customer-service",
        label: "Atención al Cliente",
        href: "/servicio/atencion-cliente"
      },
      {
        id: "lost-found",
        label: "Objetos Perdidos",
        href: "/servicio/objetos-perdidos"
      }
    ]
  },
  {
    id: "corporate",
    label: "Corporativo",
    href: "/corporativo",
    icon: "building",
    children: [
      {
        id: "about",
        label: "Acerca de Metro",
        href: "/corporativo/acerca"
      },
      {
        id: "projects",
        label: "Proyectos",
        href: "/corporativo/proyectos"
      },
      {
        id: "sustainability",
        label: "Sustentabilidad",
        href: "/corporativo/sustentabilidad"
      },
      {
        id: "transparency",
        label: "Transparencia",
        href: "/corporativo/transparencia"
      },
      {
        id: "careers",
        label: "Trabaja con Nosotros",
        href: "/corporativo/carreras"
      },
      {
        id: "press",
        label: "Prensa",
        href: "/corporativo/prensa"
      }
    ]
  }
];

// Quick access navigation (top bar)
export const quickNavigation: NavigationItem[] = [
  {
    id: "emergency",
    label: "Emergencias",
    href: "/emergencias",
    icon: "alert-triangle"
  },
  {
    id: "complaints",
    label: "Denuncias",
    href: "/denuncias",
    icon: "flag"
  },
  {
    id: "accessibility-menu",
    label: "Accesibilidad",
    href: "/accesibilidad",
    icon: "accessibility"
  }
];

// Social media links
export const socialLinks: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/Metrostgo/",
    icon: "facebook"
  },
  {
    id: "instagram", 
    label: "Instagram",
    href: "https://www.instagram.com/metrodesantiago/",
    icon: "instagram"
  },
  {
    id: "twitter",
    label: "Twitter",
    href: "https://twitter.com/metrodesantiago",
    icon: "twitter"
  },
  {
    id: "tiktok",
    label: "TikTok", 
    href: "https://www.tiktok.com/@tiometrodesantiago",
    icon: "music"
  },
  {
    id: "spotify",
    label: "Spotify",
    href: "https://open.spotify.com/show/5U3TuK7su3rtOGHJRtCtm1",
    icon: "music"
  }
];

// User account navigation
export const userNavigation: NavigationItem[] = [
  {
    id: "login",
    label: "Iniciar Sesión",
    href: "/login",
    icon: "log-in"
  },
  {
    id: "register",
    label: "Registrarse", 
    href: "/registro",
    icon: "user-plus"
  },
  {
    id: "profile",
    label: "Mi Perfil",
    href: "/perfil",
    icon: "user"
  }
];