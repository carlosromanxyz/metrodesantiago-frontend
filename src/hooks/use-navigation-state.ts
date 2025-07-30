'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { mainNavigation } from '@/data/navigation';
import type { NavigationItem, BreadcrumbItem } from '@/types';

/**
 * Custom hook for managing navigation state and breadcrumb generation
 * 
 * This hook provides:
 * - Current pathname from Next.js router
 * - Automatic breadcrumb generation based on current route
 * - Navigation hierarchy information
 * - Active navigation item detection
 */
export function useNavigationState() {
  const pathname = usePathname();

  // Generate breadcrumbs based on current pathname
  const breadcrumbs = useMemo(() => {
    return generateBreadcrumbs(pathname, mainNavigation);
  }, [pathname]);

  // Find the current active navigation item
  const activeNavigationItem = useMemo(() => {
    return findNavigationItemByPath(mainNavigation, pathname);
  }, [pathname]);

  // Get parent navigation items for hierarchy
  const navigationHierarchy = useMemo(() => {
    return getNavigationHierarchy(mainNavigation, pathname);
  }, [pathname]);

  return {
    pathname,
    breadcrumbs,
    activeNavigationItem,
    navigationHierarchy,
  };
}

/**
 * Generate breadcrumbs from a given pathname
 */
export function generateBreadcrumbs(
  pathname: string,
  navigationItems: NavigationItem[]
): BreadcrumbItem[] {
  // Always start with "Inicio"
  const breadcrumbs: BreadcrumbItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      href: '/',
      isCurrentPage: pathname === '/'
    }
  ];

  // If we're on the home page, return just the home breadcrumb
  if (pathname === '/') {
    return breadcrumbs;
  }

  // Find the navigation path for the current pathname
  const navigationPath = findNavigationPath(navigationItems, pathname);
  
  if (navigationPath.length > 0) {
    // Add navigation-based breadcrumbs
    navigationPath.forEach((item, index) => {
      const isLast = index === navigationPath.length - 1;
      breadcrumbs.push({
        id: item.id,
        label: item.label,
        href: isLast ? undefined : item.href,
        isCurrentPage: isLast
      });
    });
  } else {
    // Generate breadcrumbs from URL segments for routes not in navigation
    const segments = pathname.split('/').filter(Boolean);
    
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const href = '/' + segments.slice(0, index + 1).join('/');
      
      breadcrumbs.push({
        id: segment,
        label: formatSegmentLabel(segment),
        href: isLast ? undefined : href,
        isCurrentPage: isLast
      });
    });
  }

  return breadcrumbs;
}

/**
 * Find navigation path for a given pathname
 */
function findNavigationPath(
  items: NavigationItem[],
  pathname: string,
  currentPath: NavigationItem[] = []
): NavigationItem[] {
  for (const item of items) {
    const newPath = [...currentPath, item];
    
    // Exact match
    if (item.href === pathname) {
      return newPath;
    }
    
    // Check if pathname starts with item href (for nested routes)
    if (pathname.startsWith(item.href) && item.href !== '/') {
      // If this item has children, search within them
      if (item.children) {
        const childPath = findNavigationPath(item.children, pathname, newPath);
        if (childPath.length > 0) {
          return childPath;
        }
      }
      // If no children match, return this path
      return newPath;
    }
    
    // Search in children
    if (item.children) {
      const childPath = findNavigationPath(item.children, pathname, newPath);
      if (childPath.length > 0) {
        return childPath;
      }
    }
  }
  
  return [];
}

/**
 * Find navigation item by pathname
 */
function findNavigationItemByPath(
  items: NavigationItem[],
  pathname: string
): NavigationItem | null {
  for (const item of items) {
    if (item.href === pathname) {
      return item;
    }
    
    if (item.children) {
      const found = findNavigationItemByPath(item.children, pathname);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Get navigation hierarchy for a given pathname
 */
function getNavigationHierarchy(
  items: NavigationItem[],
  pathname: string
): NavigationItem[] {
  const path = findNavigationPath(items, pathname);
  return path;
}

/**
 * Format URL segment into readable label
 */
function formatSegmentLabel(segment: string): string {
  // Handle common URL segments with custom labels
  const segmentLabels: Record<string, string> = {
    'conexiones': 'Conexiones',
    'planificador': 'Planificador de Viajes',
    'mapa': 'Mapa de Red',
    'estaciones': 'Estaciones',
    'lineas': 'Líneas',
    'accesibilidad': 'Accesibilidad',
    'tarifas': 'Tarifas',
    'bip': 'Tarjeta BIP!',
    'estudiantes': 'Descuentos Estudiantiles',
    'tercera-edad': 'Tercera Edad',
    'empresas': 'Empresas',
    'servicio': 'Servicio',
    'estado': 'Estado del Servicio',
    'interrupciones': 'Interrupciones',
    'horarios': 'Horarios',
    'frecuencia': 'Frecuencia',
    'atencion-cliente': 'Atención al Cliente',
    'objetos-perdidos': 'Objetos Perdidos',
    'corporativo': 'Corporativo',
    'acerca': 'Acerca de Metro',
    'proyectos': 'Proyectos',
    'sustentabilidad': 'Sustentabilidad',
    'transparencia': 'Transparencia',
    'carreras': 'Trabaja con Nosotros',
    'prensa': 'Prensa',
    'emergencias': 'Emergencias',
    'denuncias': 'Denuncias',
    'login': 'Iniciar Sesión',
    'registro': 'Registrarse',
    'perfil': 'Mi Perfil'
  };

  // Return custom label if available
  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }

  // Convert kebab-case to title case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}