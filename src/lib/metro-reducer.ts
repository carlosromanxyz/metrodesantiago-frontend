/**
 * Metro State Reducer
 * 
 * Handles all state transitions for the Metro application using useReducer.
 * Implements immutable state updates with type safety and performance optimizations.
 */

import { nanoid } from 'nanoid';
import type {
  MetroState,
  MetroAction,
  SpecificMetroAction,
  SearchHistoryItem,
  FavoriteStation,
  RouteSearchResult,
} from '@/types/metro-context';
import {
  INITIAL_METRO_STATE,
  PERSISTENCE_CONFIG,
  DEFAULT_USER_PREFERENCES,
  DEFAULT_LOADING_STATES,
} from '@/types/metro-context';
import type { Station, NetworkStatusType, ServiceDisruption, TripPlannerData } from '@/types/metro';

/**
 * Helper function to create a new search history item
 */
function createSearchHistoryItem(
  query: string,
  resultCount: number,
  executionTime?: number
): SearchHistoryItem {
  return {
    id: nanoid(),
    query: query.trim(),
    timestamp: new Date(),
    resultCount,
    executionTime,
  };
}

/**
 * Helper function to create a new favorite station
 */
function createFavoriteStation(
  station: Station,
  nickname?: string,
  tags?: string[]
): FavoriteStation {
  return {
    id: nanoid(),
    station,
    addedAt: new Date(),
    nickname,
    tags: tags || [],
  };
}

/**
 * Helper function to limit array size and maintain chronological order
 */
function limitArraySize<T>(array: T[], maxSize: number): T[] {
  if (array.length <= maxSize) return array;
  return array.slice(-maxSize);
}

/**
 * Helper function to remove duplicates from search history based on query
 */
function deduplicateSearchHistory(history: SearchHistoryItem[]): SearchHistoryItem[] {
  const seen = new Set<string>();
  return history.filter(item => {
    const key = item.query.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Helper function to safely update nested objects
 */
function updateNestedState<T extends Record<string, unknown>>(
  current: T,
  updates: Partial<T>
): T {
  return {
    ...current,
    ...updates,
  };
}

/**
 * Main Metro reducer function
 */
export function metroReducer(
  state: MetroState,
  action: SpecificMetroAction
): MetroState {
  switch (action.type) {
    // =================================================================
    // NETWORK STATUS ACTIONS
    // =================================================================
    
    case 'SET_NETWORK_STATUS': {
      const { status, timestamp = new Date() } = action.payload;
      return {
        ...state,
        networkStatus: status,
        lastNetworkUpdate: timestamp,
        cacheTimestamps: {
          ...state.cacheTimestamps,
          networkStatus: timestamp,
        },
        errors: {
          ...state.errors,
          networkStatus: null, // Clear any previous network errors
        },
      };
    }
    
    case 'SET_SERVICE_DISRUPTIONS': {
      const { disruptions, timestamp = new Date() } = action.payload;
      return {
        ...state,
        serviceDisruptions: disruptions,
        cacheTimestamps: {
          ...state.cacheTimestamps,
          serviceDisruptions: timestamp,
        },
      };
    }
    
    case 'UPDATE_NETWORK_STATUS': {
      // This action would typically trigger an async operation
      // For now, we just set the loading state
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          networkStatus: true,
        },
      };
    }
    
    // =================================================================
    // SELECTION ACTIONS
    // =================================================================
    
    case 'SET_SELECTED_STATION': {
      const { station } = action.payload;
      return {
        ...state,
        selectedStation: station,
        // Also update selectedLine if station has only one line
        selectedLine: station && station.transferLines?.length === 0 
          ? station.lineNumber 
          : state.selectedLine,
      };
    }
    
    case 'SET_SELECTED_LINE': {
      return {
        ...state,
        selectedLine: action.payload,
      };
    }
    
    case 'CLEAR_SELECTIONS': {
      return {
        ...state,
        selectedStation: null,
        selectedLine: null,
      };
    }
    
    // =================================================================
    // SEARCH HISTORY ACTIONS
    // =================================================================
    
    case 'ADD_SEARCH_HISTORY': {
      const { item } = action.payload;
      const newItem = createSearchHistoryItem(
        item.query,
        item.resultCount,
        item.executionTime
      );
      
      // Remove any existing items with the same query (case-insensitive)
      const filteredHistory = state.searchHistory.filter(
        historyItem => historyItem.query.toLowerCase() !== item.query.toLowerCase()
      );
      
      // Add new item at the end and limit size
      const updatedHistory = limitArraySize(
        [...filteredHistory, newItem],
        PERSISTENCE_CONFIG.MAX_SEARCH_HISTORY
      );
      
      return {
        ...state,
        searchHistory: updatedHistory,
      };
    }
    
    case 'CLEAR_SEARCH_HISTORY': {
      return {
        ...state,
        searchHistory: [],
      };
    }
    
    case 'REMOVE_SEARCH_HISTORY_ITEM': {
      const { id } = action.payload;
      return {
        ...state,
        searchHistory: state.searchHistory.filter(item => item.id !== id),
      };
    }
    
    // =================================================================
    // FAVORITES ACTIONS
    // =================================================================
    
    case 'ADD_FAVORITE_STATION': {
      const { station, nickname, tags } = action.payload;
      
      // Check if station is already in favorites
      const existingFavoriteIndex = state.favorites.findIndex(
        fav => fav.station.id === station.id
      );
      
      if (existingFavoriteIndex >= 0) {
        // Update existing favorite
        const updatedFavorites = [...state.favorites];
        updatedFavorites[existingFavoriteIndex] = {
          ...updatedFavorites[existingFavoriteIndex],
          nickname,
          tags: tags || [],
        };
        
        return {
          ...state,
          favorites: updatedFavorites,
        };
      }
      
      // Add new favorite
      const newFavorite = createFavoriteStation(station, nickname, tags);
      return {
        ...state,
        favorites: [...state.favorites, newFavorite],
      };
    }
    
    case 'REMOVE_FAVORITE_STATION': {
      const { stationId } = action.payload;
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.station.id !== stationId),
      };
    }
    
    case 'UPDATE_FAVORITE_STATION': {
      const { id, updates } = action.payload;
      return {
        ...state,
        favorites: state.favorites.map(fav =>
          fav.id === id ? { ...fav, ...updates } : fav
        ),
      };
    }
    
    case 'CLEAR_FAVORITES': {
      return {
        ...state,
        favorites: [],
      };
    }
    
    // =================================================================
    // ROUTE PLANNING ACTIONS
    // =================================================================
    
    case 'SET_CURRENT_TRIP': {
      return {
        ...state,
        currentTrip: action.payload,
      };
    }
    
    case 'SET_LAST_ROUTE_SEARCH': {
      return {
        ...state,
        lastRouteSearch: action.payload,
      };
    }
    
    case 'ADD_SAVED_TRIP': {
      const trip = action.payload;
      
      // Check if trip already exists (same from/to stations)
      const existingTripIndex = state.savedTrips.findIndex(
        savedTrip => 
          savedTrip.fromStation === trip.fromStation &&
          savedTrip.toStation === trip.toStation
      );
      
      if (existingTripIndex >= 0) {
        // Update existing trip
        const updatedTrips = [...state.savedTrips];
        updatedTrips[existingTripIndex] = trip;
        return {
          ...state,
          savedTrips: updatedTrips,
        };
      }
      
      // Add new trip and limit size
      const updatedTrips = limitArraySize(
        [...state.savedTrips, trip],
        PERSISTENCE_CONFIG.MAX_SAVED_TRIPS
      );
      
      return {
        ...state,
        savedTrips: updatedTrips,
      };
    }
    
    case 'REMOVE_SAVED_TRIP': {
      const { tripId } = action.payload;
      return {
        ...state,
        savedTrips: state.savedTrips.filter((_, index) => index.toString() !== tripId),
      };
    }
    
    case 'CLEAR_SAVED_TRIPS': {
      return {
        ...state,
        savedTrips: [],
      };
    }
    
    // =================================================================
    // LOADING STATE ACTIONS
    // =================================================================
    
    case 'SET_LOADING_STATE': {
      const { key, isLoading } = action.payload;
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [key]: isLoading,
        },
      };
    }
    
    case 'SET_MULTIPLE_LOADING_STATES': {
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          ...action.payload,
        },
      };
    }
    
    case 'CLEAR_ALL_LOADING': {
      return {
        ...state,
        loadingStates: DEFAULT_LOADING_STATES,
      };
    }
    
    // =================================================================
    // PREFERENCES ACTIONS
    // =================================================================
    
    case 'UPDATE_PREFERENCES': {
      return {
        ...state,
        preferences: updateNestedState(state.preferences, action.payload),
      };
    }
    
    case 'RESET_PREFERENCES': {
      return {
        ...state,
        preferences: DEFAULT_USER_PREFERENCES,
      };
    }
    
    // =================================================================
    // CACHE ACTIONS
    // =================================================================
    
    case 'UPDATE_CACHE_TIMESTAMP': {
      const { key } = action.payload;
      return {
        ...state,
        cacheTimestamps: {
          ...state.cacheTimestamps,
          [key]: new Date(),
        },
      };
    }
    
    case 'CLEAR_CACHE': {
      return {
        ...state,
        cacheTimestamps: {
          networkStatus: null,
          serviceDisruptions: null,
          stationData: null,
        },
      };
    }
    
    // =================================================================
    // ERROR ACTIONS
    // =================================================================
    
    case 'SET_ERROR': {
      const { key, error } = action.payload;
      return {
        ...state,
        errors: {
          ...state.errors,
          [key]: error,
        },
      };
    }
    
    case 'CLEAR_ERROR': {
      const { key } = action.payload;
      return {
        ...state,
        errors: {
          ...state.errors,
          [key]: null,
        },
      };
    }
    
    case 'CLEAR_ALL_ERRORS': {
      return {
        ...state,
        errors: {
          networkStatus: null,
          stationSearch: null,
          routePlanning: null,
          general: null,
        },
      };
    }
    
    // =================================================================
    // BULK ACTIONS
    // =================================================================
    
    case 'HYDRATE_STATE': {
      const { state: partialState } = action.payload;
      return {
        ...state,
        ...partialState,
        // Ensure critical timestamps are dates
        cacheTimestamps: {
          ...state.cacheTimestamps,
          ...partialState.cacheTimestamps,
        },
        // Ensure search history items have proper date objects
        searchHistory: partialState.searchHistory?.map((item: SearchHistoryItem & { timestamp: string | Date }) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })) || state.searchHistory,
        // Ensure favorites have proper date objects
        favorites: partialState.favorites?.map((fav: FavoriteStation & { addedAt: string | Date }) => ({
          ...fav,
          addedAt: new Date(fav.addedAt),
        })) || state.favorites,
      };
    }
    
    case 'RESET_STATE': {
      return INITIAL_METRO_STATE;
    }
    
    case 'PARTIAL_UPDATE': {
      return {
        ...state,
        ...action.payload,
      };
    }
    
    // =================================================================
    // DEFAULT CASE
    // =================================================================
    
    default: {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Unknown Metro action type:', (action as SpecificMetroAction).type);
      }
      return state;
    }
  }
}

/**
 * Higher-order reducer that adds middleware-like functionality
 */
export function createMetroReducer(
  middleware?: {
    onStateChange?: (prevState: MetroState, nextState: MetroState, action: SpecificMetroAction) => void;
    onError?: (error: Error, action: SpecificMetroAction) => void;
  }
) {
  return (state: MetroState, action: SpecificMetroAction): MetroState => {
    try {
      const nextState = metroReducer(state, action);
      
      // Call middleware if provided
      if (middleware?.onStateChange && nextState !== state) {
        middleware.onStateChange(state, nextState, action);
      }
      
      return nextState;
    } catch (error) {
      // Handle reducer errors gracefully
      if (middleware?.onError) {
        middleware.onError(error as Error, action);
      } else if (process.env.NODE_ENV === 'development') {
        console.error('Metro reducer error:', error, 'Action:', action);
      }
      
      // Return previous state on error to prevent crashes
      return state;
    }
  };
}

/**
 * Selector functions for common state derivations
 */
export const metroSelectors = {
  // Network status selectors
  hasActiveDisruptions: (state: MetroState): boolean => 
    state.serviceDisruptions.some(disruption => disruption.isActive),
  
  getDisruptionsByLine: (state: MetroState, lineNumber: number): ServiceDisruption[] =>
    state.serviceDisruptions.filter(disruption => 
      disruption.lineNumber === lineNumber && disruption.isActive
    ),
  
  // Favorites selectors
  getFavoriteStationsCount: (state: MetroState): number => state.favorites.length,
  
  isFavoriteStation: (state: MetroState, stationId: string): boolean =>
    state.favorites.some(fav => fav.station.id === stationId),
  
  getFavoritesByLine: (state: MetroState, lineNumber: number): FavoriteStation[] =>
    state.favorites.filter(fav => fav.station.lineNumber === lineNumber),
  
  // Search selectors
  getSearchHistoryCount: (state: MetroState): number => state.searchHistory.length,
  
  getRecentSearches: (state: MetroState, limit = 5): SearchHistoryItem[] =>
    state.searchHistory.slice(-limit).reverse(),
  
  // Loading selectors
  isAnyLoading: (state: MetroState): boolean =>
    Object.values(state.loadingStates).some(Boolean),
  
  getLoadingStates: (state: MetroState): string[] =>
    Object.entries(state.loadingStates)
      .filter(([_, isLoading]) => isLoading)
      .map(([key]) => key),
  
  // Error selectors
  hasAnyError: (state: MetroState): boolean =>
    Object.values(state.errors).some(error => error !== null),
  
  getActiveErrors: (state: MetroState): Array<{ key: string; error: Error }> =>
    Object.entries(state.errors)
      .filter(([_, error]) => error !== null)
      .map(([key, error]) => ({ key, error: error! })),
  
  // Cache selectors
  isCacheValid: (state: MetroState, key: keyof MetroState['cacheTimestamps'], maxAge: number): boolean => {
    const timestamp = state.cacheTimestamps[key];
    if (!timestamp) return false;
    return Date.now() - timestamp.getTime() < maxAge;
  },
};