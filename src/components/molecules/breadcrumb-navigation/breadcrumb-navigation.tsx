'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigationState } from '@/hooks/use-navigation-state';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

interface BreadcrumbNavigationProps {
  className?: string;
  showHomeIcon?: boolean;
  maxItems?: number;
  collapsible?: boolean;
}

/**
 * Automatic breadcrumb navigation component
 * 
 * Features:
 * - Automatically generates breadcrumbs based on current route
 * - Integrates with navigation structure from /src/data/navigation.ts
 * - Fully accessible with ARIA support
 * - Mobile-responsive with collapsible long paths
 * - Navigable links to parent routes
 */
export function BreadcrumbNavigation({
  className,
  showHomeIcon = true,
  maxItems = 4,
  collapsible = true,
}: BreadcrumbNavigationProps) {
  const { breadcrumbs } = useNavigationState();

  // Don't render breadcrumbs if we only have the home item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // Handle collapsible breadcrumbs for long paths
  const shouldCollapse = collapsible && breadcrumbs.length > maxItems;
  const displayBreadcrumbs = shouldCollapse
    ? getCollapsedBreadcrumbs(breadcrumbs, maxItems)
    : breadcrumbs;

  return (
    <Breadcrumb className={cn('w-full', className)}>
      <BreadcrumbList>
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isHome = item.id === 'home';
          const isEllipsis = item.id === 'ellipsis';
          const itemHref = 'href' in item ? item.href : undefined;

          return (
            <div key={item.id} className="flex items-center">
              {/* Breadcrumb Item */}
              <BreadcrumbItem>
                {isEllipsis ? (
                  <BreadcrumbEllipsis />
                ) : isLast || item.isCurrentPage ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {isHome && showHomeIcon && (
                      <Home className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                ) : itemHref ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={itemHref}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    >
                      {isHome && showHomeIcon && (
                        <Home className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {isHome && showHomeIcon && (
                      <Home className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {/* Separator */}
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * Get collapsed breadcrumbs when the path is too long
 */
function getCollapsedBreadcrumbs(
  breadcrumbs: BreadcrumbItemType[],
  maxItems: number
): (BreadcrumbItemType | { id: 'ellipsis'; label: '...'; isCurrentPage?: boolean })[] {
  if (breadcrumbs.length <= maxItems) {
    return breadcrumbs;
  }

  // Always show: Home + ... + last two items
  const result = [];
  
  // First item (Home)
  result.push(breadcrumbs[0]);
  
  // Ellipsis indicator
  if (breadcrumbs.length > maxItems) {
    result.push({ id: 'ellipsis', label: '...' });
  }
  
  // Last items
  const remainingSlots = maxItems - 2; // Home + ellipsis take 2 slots
  const lastItems = breadcrumbs.slice(-remainingSlots);
  result.push(...lastItems);
  
  return result;
}

export default BreadcrumbNavigation;