"use client";

import { cn } from "@/lib/utils";

interface SkipLink {
  href: string;
  label: string;
}

interface SkipNavigationProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: "#main-content", label: "Saltar al contenido principal" },
  { href: "#main-navigation", label: "Saltar a navegación principal" },
  { href: "#search", label: "Saltar a búsqueda" },
  { href: "#footer", label: "Saltar al pie de página" }
];

export function SkipNavigation({ links = defaultLinks, className }: SkipNavigationProps) {
  return (
    <nav 
      className={cn("sr-only focus-within:not-sr-only", className)}
      aria-label="Enlaces de navegación rápida"
    >
      <ul className="fixed top-4 left-4 z-[100] bg-metro-red text-white rounded-lg shadow-lg p-2 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="block px-4 py-2 text-sm font-medium hover:bg-white hover:text-metro-red focus:bg-white focus:text-metro-red focus:outline-none rounded transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = document.querySelector(link.href);
                  if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}