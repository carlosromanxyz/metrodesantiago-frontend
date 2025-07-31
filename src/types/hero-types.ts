import { ReactNode } from 'react';

// Action Types
export type ActionType = 
  | 'trip-planner' 
  | 'service-status' 
  | 'alternative-routes' 
  | 'about'
  | 'help'
  | 'news';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Language = 'es' | 'en';
export type AccessibilityNeed = 'screen-reader' | 'voice-control' | 'high-contrast' | 'reduced-motion';

// CTA Button Interface
export interface CTAButton {
  readonly text: string;
  readonly action: ActionType;
  readonly icon?: ReactNode;
  readonly priority?: number;
}

// Hero Content Interface
export interface HeroContent {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly primaryCTA: CTAButton;
  readonly secondaryCTA?: CTAButton;
  readonly backgroundImage: string;
  readonly priority: number;
  readonly metadata?: HeroContentMetadata;
}

export interface HeroContentMetadata {
  readonly category: 'service' | 'welcome' | 'promotional' | 'seasonal';
  readonly targetAudience: 'all' | 'first-time' | 'frequent' | 'accessibility';
  readonly validFrom?: Date;
  readonly validTo?: Date;
  readonly impressions?: number;
  readonly clicks?: number;
}

// User Context Interface
export interface UserContext {
  readonly hasActiveDisruptions: boolean;
  readonly isFirstTimeVisitor: boolean;
  readonly frequentStations: readonly string[];
  readonly timeOfDay: TimeOfDay;
  readonly preferredLanguage: Language;
  readonly accessibilityNeeds: readonly AccessibilityNeed[];
  readonly lastVisit?: Date;
  readonly sessionCount?: number;
  readonly preferredRoutes?: readonly string[];
}

// AI Personalization Types
export interface PersonalizationScore {
  content: HeroContent;
  score: number;
  factors: PersonalizationFactor[];
}

export interface PersonalizationFactor {
  name: string;
  weight: number;
  value: number;
  reason: string;
}

// Route and Station Types
export interface RouteResult {
  readonly duration: number;
  readonly distance: number;
  readonly transfers: number;
  readonly lines: readonly string[];
  readonly accessibility: boolean;
  readonly realTimeDelay?: number;
}

export interface StationOption {
  readonly value: string;
  readonly label: string;
  readonly lines: readonly LineInfo[];
}

export interface LineInfo {
  readonly lineNumber: string;
  readonly hexColor: string;
  readonly status?: 'operational' | 'delayed' | 'suspended';
}

// Component Props Types
export interface HeroStaticProps {
  readonly className?: string;
  readonly enableVoiceControl?: boolean;
  readonly enableAIPersonalization?: boolean;
  readonly userContext?: Partial<UserContext>;
  readonly onAnalyticsEvent?: (event: AnalyticsEvent) => void;
}

export interface TripPlannerWidgetProps {
  readonly onVoiceCommand?: (text: string) => void;
  readonly onRouteCalculated?: (route: RouteResult) => void;
  readonly className?: string;
  readonly disabled?: boolean;
}

// Analytics Types
export interface AnalyticsEvent {
  readonly type: 'hero_interaction' | 'voice_command' | 'trip_search' | 'cta_click';
  readonly action: string;
  readonly properties?: Record<string, unknown>;
  readonly timestamp: Date;
}

// Animation Types
export interface AnimationConfig {
  readonly duration: number;
  readonly delay?: number;
  readonly easing: string | number[];
}

// Component State Types
export interface ComponentState<T> {
  readonly loading: boolean;
  readonly error: string | null;
  readonly data: T | null;
}

// Utility Types
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;