/**
 * Types for Metro Context State Management
 * 
 * This file contains all TypeScript types and interfaces needed for the
 * centralized Metro state management system.
 */

import type { Station, NetworkStatusType, TripPlannerData, ServiceDisruption } from './metro';

/**
 * Search history item for persisting recent searches
 */
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  executionTime?: number;
}

/**
 * User favorite station with optional metadata
 */
export interface FavoriteStation {
  id: string;
  station: Station;
  addedAt: Date;
  nickname?: string;
  tags?: string[];
}

/**
 * Route search result for trip planning
 */
export interface RouteSearchResult {
  id: string;
  from: Station;
  to: Station;
  searchedAt: Date;
  estimatedTime?: number;
  transfers?: number;
  route?: Station[];
}

/**
 * Loading states for different components/sections
 */
export interface LoadingStates {
  networkStatus: boolean;
  stationSearch: boolean;
  routePlanning: boolean;
  serviceDisruptions: boolean;
  favorites: boolean;
  searchHistory: boolean;
}

/**
 * User preferences for Metro app
 */
export interface UserPreferences {
  defaultTransportMode: 'metro' | 'bus' | 'mixed';
  preferredTransferStations: string[];
  accessibilityNeeds: string[];
  notificationSettings: {
    serviceDisruptions: boolean;
    routeUpdates: boolean;
    favoriteStationAlerts: boolean;
  };
  searchSettings: {
    maxResults: number;
    enableFuzzySearch: boolean;
    enableSuggestions: boolean;
    rememberSearches: boolean;
  };
}

/**
 * Main Metro state interface
 */
export interface MetroState {
  // Network and system status
  networkStatus: NetworkStatusType;
  serviceDisruptions: ServiceDisruption[];
  lastNetworkUpdate: Date | null;
  
  // Current selections
  selectedStation: Station | null;
  selectedLine: number | null;
  
  // Search and navigation
  searchHistory: SearchHistoryItem[];
  favorites: FavoriteStation[];
  lastRouteSearch: RouteSearchResult | null;
  
  // Trip planning
  currentTrip: TripPlannerData | null;
  savedTrips: TripPlannerData[];
  
  // UI state
  loadingStates: LoadingStates;
  
  // User preferences
  preferences: UserPreferences;
  
  // Cache and performance
  cacheTimestamps: {
    networkStatus: Date | null;
    serviceDisruptions: Date | null;
    stationData: Date | null;
  };
  
  // Error handling
  errors: {
    networkStatus: Error | null;
    stationSearch: Error | null;
    routePlanning: Error | null;
    general: Error | null;
  };
}

/**
 * Metro action types for reducer
 */
export type MetroActionType =
  // Network status actions
  | 'SET_NETWORK_STATUS'
  | 'SET_SERVICE_DISRUPTIONS'
  | 'UPDATE_NETWORK_STATUS'
  
  // Selection actions
  | 'SET_SELECTED_STATION'
  | 'SET_SELECTED_LINE'
  | 'CLEAR_SELECTIONS'
  
  // Search actions
  | 'ADD_SEARCH_HISTORY'
  | 'CLEAR_SEARCH_HISTORY'
  | 'REMOVE_SEARCH_HISTORY_ITEM'
  
  // Favorites actions
  | 'ADD_FAVORITE_STATION'
  | 'REMOVE_FAVORITE_STATION'
  | 'UPDATE_FAVORITE_STATION'
  | 'CLEAR_FAVORITES'
  
  // Route planning actions
  | 'SET_CURRENT_TRIP'
  | 'SET_LAST_ROUTE_SEARCH'
  | 'ADD_SAVED_TRIP'
  | 'REMOVE_SAVED_TRIP'
  | 'CLEAR_SAVED_TRIPS'
  
  // Loading actions
  | 'SET_LOADING_STATE'
  | 'SET_MULTIPLE_LOADING_STATES'
  | 'CLEAR_ALL_LOADING'
  
  // Preferences actions
  | 'UPDATE_PREFERENCES'
  | 'RESET_PREFERENCES'
  
  // Cache actions
  | 'UPDATE_CACHE_TIMESTAMP'
  | 'CLEAR_CACHE'
  
  // Error actions
  | 'SET_ERROR'
  | 'CLEAR_ERROR'
  | 'CLEAR_ALL_ERRORS'
  
  // Bulk actions
  | 'HYDRATE_STATE'
  | 'RESET_STATE'
  | 'PARTIAL_UPDATE';

/**
 * Metro actions interface
 */
export interface MetroAction {
  type: MetroActionType;
  payload?: any;
}

/**
 * Specific action interfaces for type safety
 */
export interface SetNetworkStatusAction extends MetroAction {
  type: 'SET_NETWORK_STATUS';
  payload: {
    status: NetworkStatusType;
    timestamp?: Date;
  };
}

export interface SetServiceDisruptionsAction extends MetroAction {
  type: 'SET_SERVICE_DISRUPTIONS';
  payload: {
    disruptions: ServiceDisruption[];
    timestamp?: Date;
  };
}

export interface SetSelectedStationAction extends MetroAction {
  type: 'SET_SELECTED_STATION';
  payload: {
    station: Station | null;
  };
}

export interface AddSearchHistoryAction extends MetroAction {
  type: 'ADD_SEARCH_HISTORY';
  payload: {
    item: Omit<SearchHistoryItem, 'id' | 'timestamp'>;
  };
}

export interface AddFavoriteStationAction extends MetroAction {
  type: 'ADD_FAVORITE_STATION';
  payload: {
    station: Station;
    nickname?: string;
    tags?: string[];
  };
}

export interface SetLoadingStateAction extends MetroAction {
  type: 'SET_LOADING_STATE';
  payload: {
    key: keyof LoadingStates;
    isLoading: boolean;
  };
}

export interface SetErrorAction extends MetroAction {
  type: 'SET_ERROR';
  payload: {
    key: keyof MetroState['errors'];
    error: Error | null;
  };
}

export interface HydrateStateAction extends MetroAction {
  type: 'HYDRATE_STATE';
  payload: {
    state: Partial<MetroState>;
  };
}

/**
 * Union type of all specific actions
 */
export type SpecificMetroAction =
  | SetNetworkStatusAction
  | SetServiceDisruptionsAction
  | SetSelectedStationAction
  | AddSearchHistoryAction
  | AddFavoriteStationAction
  | SetLoadingStateAction
  | SetErrorAction
  | HydrateStateAction
  | MetroAction;

/**
 * Metro context value interface
 */
export interface MetroContextValue {
  // State
  state: MetroState;
  
  // Network status actions
  setNetworkStatus: (status: NetworkStatusType) => void;
  setServiceDisruptions: (disruptions: ServiceDisruption[]) => void;
  updateNetworkStatus: () => Promise<void>;
  
  // Selection actions
  setSelectedStation: (station: Station | null) => void;
  setSelectedLine: (lineNumber: number | null) => void;
  clearSelections: () => void;
  
  // Search actions
  addSearchHistory: (query: string, resultCount: number, executionTime?: number) => void;
  clearSearchHistory: () => void;
  removeSearchHistoryItem: (id: string) => void;
  
  // Favorites actions
  addFavoriteStation: (station: Station, nickname?: string, tags?: string[]) => void;
  removeFavoriteStation: (stationId: string) => void;
  updateFavoriteStation: (id: string, updates: Partial<FavoriteStation>) => void;
  clearFavorites: () => void;
  isFavoriteStation: (stationId: string) => boolean;
  
  // Route planning actions
  setCurrentTrip: (trip: TripPlannerData | null) => void;
  setLastRouteSearch: (result: RouteSearchResult | null) => void;
  addSavedTrip: (trip: TripPlannerData) => void;
  removeSavedTrip: (tripId: string) => void;
  clearSavedTrips: () => void;
  
  // Loading actions
  setLoadingState: (key: keyof LoadingStates, isLoading: boolean) => void;
  setMultipleLoadingStates: (states: Partial<LoadingStates>) => void;
  clearAllLoading: () => void;
  
  // Preferences actions
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Cache actions
  updateCacheTimestamp: (key: keyof MetroState['cacheTimestamps']) => void;
  clearCache: () => void;
  isCacheValid: (key: keyof MetroState['cacheTimestamps'], maxAge: number) => boolean;
  
  // Error actions
  setError: (key: keyof MetroState['errors'], error: Error | null) => void;
  clearError: (key: keyof MetroState['errors']) => void;
  clearAllErrors: () => void;
  
  // Utility actions
  resetState: () => void;
  hydrateState: (partialState: Partial<MetroState>) => void;
  
  // Computed properties
  hasActiveDisruptions: boolean;
  favoriteStationsCount: number;
  searchHistoryCount: number;
  isAnyLoading: boolean;
  hasAnyError: boolean;
}

/**
 * Props for MetroProvider component
 */
export interface MetroProviderProps {
  children: React.ReactNode;
  initialState?: Partial<MetroState>;
  enablePersistence?: boolean;
  persistenceKey?: string;
  onStateChange?: (state: MetroState) => void;
  onError?: (error: Error) => void;
}

/**
 * Default values and constants
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultTransportMode: 'metro',
  preferredTransferStations: [],
  accessibilityNeeds: [],
  notificationSettings: {
    serviceDisruptions: true,
    routeUpdates: true,
    favoriteStationAlerts: true,
  },
  searchSettings: {
    maxResults: 10,
    enableFuzzySearch: true,
    enableSuggestions: true,
    rememberSearches: true,
  },
};

export const DEFAULT_LOADING_STATES: LoadingStates = {
  networkStatus: false,
  stationSearch: false,
  routePlanning: false,
  serviceDisruptions: false,
  favorites: false,
  searchHistory: false,
};

export const INITIAL_METRO_STATE: MetroState = {
  networkStatus: 'available',
  serviceDisruptions: [],
  lastNetworkUpdate: null,
  
  selectedStation: null,
  selectedLine: null,
  
  searchHistory: [],
  favorites: [],
  lastRouteSearch: null,
  
  currentTrip: null,
  savedTrips: [],
  
  loadingStates: DEFAULT_LOADING_STATES,
  preferences: DEFAULT_USER_PREFERENCES,
  
  cacheTimestamps: {
    networkStatus: null,
    serviceDisruptions: null,
    stationData: null,
  },
  
  errors: {
    networkStatus: null,
    stationSearch: null,
    routePlanning: null,
    general: null,
  },
};

/**
 * Cache configuration constants
 */
export const CACHE_DURATIONS = {
  NETWORK_STATUS: 30000, // 30 seconds
  SERVICE_DISRUPTIONS: 60000, // 1 minute
  STATION_DATA: 300000, // 5 minutes
} as const;

/**
 * Persistence configuration constants
 */
export const PERSISTENCE_CONFIG = {
  DEFAULT_KEY: 'metro-app-state',
  VERSION: '1.0.0',
  PERSIST_FIELDS: [
    'favorites',
    'searchHistory',
    'savedTrips',
    'preferences',
    'selectedStation',
    'selectedLine',
  ] as const,
  MAX_SEARCH_HISTORY: 50,
  MAX_SAVED_TRIPS: 20,
} as const;