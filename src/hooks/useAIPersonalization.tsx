"use client";

import React, { useMemo } from 'react';
import { MapPin, Clock, Zap, Info, Navigation } from 'lucide-react';
import { 
  HeroContent, 
  UserContext, 
  PersonalizationScore,
  PersonalizationFactor,
  TimeOfDay 
} from '@/types/hero-types';

// Content database - in a real app, this would come from a CMS or API
const HERO_CONTENT_DATABASE: HeroContent[] = [
  {
    id: 'service-alerts',
    title: 'Manténte Informado',
    subtitle: 'Revisa el estado del servicio antes de viajar para evitar inconvenientes',
    primaryCTA: {
      text: 'Ver Interrupciones',
      action: 'service-status',
      icon: <Zap className="w-5 h-5" />
    },
    secondaryCTA: {
      text: 'Rutas Alternativas',
      action: 'alternative-routes',
      icon: <Navigation className="w-5 h-5" />
    },
    backgroundImage: '/images/hero-service-alerts.jpg',
    priority: 10,
    metadata: {
      category: 'service',
      targetAudience: 'all'
    }
  },
  {
    id: 'welcome-first-time',
    title: 'Bienvenido a Metro Santiago',
    subtitle: 'Descubre la red de transporte más moderna y eficiente de Chile',
    primaryCTA: {
      text: 'Planificar Primer Viaje',
      action: 'trip-planner',
      icon: <MapPin className="w-5 h-5" />
    },
    secondaryCTA: {
      text: 'Conocer el Metro',
      action: 'about',
      icon: <Info className="w-5 h-5" />
    },
    backgroundImage: '/images/hero-welcome.jpg',
    priority: 9,
    metadata: {
      category: 'welcome',
      targetAudience: 'first-time'
    }
  },
  {
    id: 'morning-commute',
    title: 'Buenos Días, Santiago',
    subtitle: 'Comienza tu día con el mejor transporte público de la ciudad',
    primaryCTA: {
      text: 'Planificar Viaje',
      action: 'trip-planner',
      icon: <MapPin className="w-5 h-5" />
    },
    backgroundImage: '/images/hero-morning.jpg',
    priority: 7,
    metadata: {
      category: 'promotional',
      targetAudience: 'frequent'
    }
  },
  {
    id: 'evening-return',
    title: 'Tu Viaje de Regreso',
    subtitle: 'Llega seguro a casa con nuestro servicio nocturno',
    primaryCTA: {
      text: 'Rutas Nocturnas',
      action: 'trip-planner',
      icon: <Clock className="w-5 h-5" />
    },
    backgroundImage: '/images/hero-evening.jpg',
    priority: 6,
    metadata: {
      category: 'promotional',
      targetAudience: 'frequent'
    }
  },
  {
    id: 'accessibility-focus',
    title: 'Metro Accesible para Todos',
    subtitle: 'Descubre nuestras facilidades de accesibilidad y asistencia',
    primaryCTA: {
      text: 'Servicios de Accesibilidad',
      action: 'about',
      icon: <Info className="w-5 h-5" />
    },
    secondaryCTA: {
      text: 'Planificar Viaje Accesible',
      action: 'trip-planner',
      icon: <MapPin className="w-5 h-5" />
    },
    backgroundImage: '/images/hero-accessibility.jpg',
    priority: 8,
    metadata: {
      category: 'service',
      targetAudience: 'accessibility'
    }
  },
  {
    id: 'default-explore',
    title: 'Tu Viaje Comienza Aquí',
    subtitle: 'Conectamos Santiago con transporte inteligente, sostenible y accesible',
    primaryCTA: {
      text: 'Planificar Viaje',
      action: 'trip-planner',
      icon: <MapPin className="w-5 h-5" />
    },
    secondaryCTA: {
      text: 'Estado del Servicio',
      action: 'service-status',
      icon: <Clock className="w-5 h-5" />
    },
    backgroundImage: '/images/hero-default.jpg',
    priority: 5,
    metadata: {
      category: 'promotional',
      targetAudience: 'all'
    }
  }
];

// Personalization scoring algorithm
const calculatePersonalizationScore = (
  content: HeroContent,
  userContext: UserContext
): PersonalizationScore => {
  const factors: PersonalizationFactor[] = [];
  let totalScore = content.priority; // Base score from content priority

  // High priority: Active service disruptions
  if (content.id === 'service-alerts' && userContext.hasActiveDisruptions) {
    const factor: PersonalizationFactor = {
      name: 'Active Disruptions',
      weight: 10,
      value: 10,
      reason: 'User has active service disruptions affecting their routes'
    };
    factors.push(factor);
    totalScore += factor.weight * factor.value;
  }

  // First-time visitor preference
  if (userContext.isFirstTimeVisitor) {
    if (content.metadata?.targetAudience === 'first-time') {
      const factor: PersonalizationFactor = {
        name: 'First Time Visitor',
        weight: 8,
        value: 9,
        reason: 'Content specifically designed for new users'
      };
      factors.push(factor);
      totalScore += factor.weight * factor.value;
    }
  } else {
    // Returning user - prefer functional content
    if (content.metadata?.targetAudience === 'frequent') {
      const factor: PersonalizationFactor = {
        name: 'Returning User',
        weight: 6,
        value: 7,
        reason: 'Content optimized for frequent users'
      };
      factors.push(factor);
      totalScore += factor.weight * factor.value;
    }
  }

  // Time of day personalization
  const timeFactors = getTimeBasedFactors(content, userContext.timeOfDay);
  factors.push(...timeFactors);
  totalScore += timeFactors.reduce((sum, f) => sum + (f.weight * f.value), 0);

  // Accessibility needs
  if (userContext.accessibilityNeeds.length > 0) {
    if (content.metadata?.targetAudience === 'accessibility') {
      const factor: PersonalizationFactor = {
        name: 'Accessibility Needs',
        weight: 9,
        value: 8,
        reason: 'User has specified accessibility requirements'
      };
      factors.push(factor);
      totalScore += factor.weight * factor.value;
    }
  }

  // Language preference
  if (userContext.preferredLanguage === 'es') {
    const factor: PersonalizationFactor = {
      name: 'Language Match',
      weight: 2,
      value: 5,
      reason: 'Content matches user language preference'
    };
    factors.push(factor);
    totalScore += factor.weight * factor.value;
  }

  // Session recency
  if (userContext.lastVisit) {
    const daysSinceLastVisit = Math.floor(
      (Date.now() - userContext.lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastVisit > 30) {
      if (content.metadata?.targetAudience === 'first-time') {
        const factor: PersonalizationFactor = {
          name: 'Long Absence',
          weight: 4,
          value: 6,
          reason: 'User hasn\'t visited in over 30 days'
        };
        factors.push(factor);
        totalScore += factor.weight * factor.value;
      }
    }
  }

  return {
    content,
    score: Math.max(0, totalScore), // Ensure non-negative score
    factors
  };
};

const getTimeBasedFactors = (
  content: HeroContent,
  timeOfDay: TimeOfDay
): PersonalizationFactor[] => {
  const factors: PersonalizationFactor[] = [];

  switch (timeOfDay) {
    case 'morning':
      if (content.id === 'morning-commute') {
        factors.push({
          name: 'Morning Time Match',
          weight: 7,
          value: 8,
          reason: 'Content specifically designed for morning commuters'
        });
      }
      break;
    
    case 'evening':
      if (content.id === 'evening-return') {
        factors.push({
          name: 'Evening Time Match',
          weight: 6,
          value: 7,
          reason: 'Content optimized for evening travel'
        });
      }
      break;
    
    case 'night':
      if (content.id === 'evening-return' || content.primaryCTA.action === 'service-status') {
        factors.push({
          name: 'Night Service Info',
          weight: 5,
          value: 6,
          reason: 'Late night users need service information'
        });
      }
      break;
    
    default:
      // Afternoon - neutral scoring
      break;
  }

  return factors;
};

// Hook for AI-powered personalization
export const useAIPersonalization = (
  userContext: UserContext,
  enablePersonalization: boolean = true
): {
  heroContent: HeroContent;
  personalizationScore: PersonalizationScore;
  alternativeContents: PersonalizationScore[];
} => {
  const personalizationResults = useMemo(() => {
    if (!enablePersonalization) {
      // Return default content without personalization
      const defaultContent = HERO_CONTENT_DATABASE.find(c => c.id === 'default-explore') 
        || HERO_CONTENT_DATABASE[0];
      
      return {
        heroContent: defaultContent,
        personalizationScore: {
          content: defaultContent,
          score: defaultContent.priority,
          factors: []
        },
        alternativeContents: []
      };
    }

    // Calculate personalization scores for all content
    const scoredContents = HERO_CONTENT_DATABASE
      .map(content => calculatePersonalizationScore(content, userContext))
      .sort((a, b) => b.score - a.score);

    const topContent = scoredContents[0];
    const alternatives = scoredContents.slice(1, 4); // Top 3 alternatives

    return {
      heroContent: topContent.content,
      personalizationScore: topContent,
      alternativeContents: alternatives
    };
  }, [userContext, enablePersonalization]);


  return {
    ...personalizationResults
  };
};

// Utility hook for getting current time of day
export const useTimeOfDay = (): TimeOfDay => {
  return useMemo(() => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }, []);
};

// Utility function to simulate user context (for development)
export const createMockUserContext = (overrides: Partial<UserContext> = {}): UserContext => {
  const timeOfDay = new Date().getHours() >= 6 && new Date().getHours() < 12 ? 'morning' : 'afternoon';
  
  return {
    hasActiveDisruptions: false,
    isFirstTimeVisitor: false,
    frequentStations: ['Plaza de Armas', 'Universidad de Chile', 'Providencia'],
    timeOfDay,
    preferredLanguage: 'es',
    accessibilityNeeds: [],
    lastVisit: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    sessionCount: 5,
    preferredRoutes: ['L1-L2', 'L3-L5'],
    ...overrides
  };
};