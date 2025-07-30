/**
 * Metro Hooks
 * 
 * Collection of hooks for interacting with Metro state and performing
 * common Metro-related operations with optimized performance and type safety.
 */

import { useCallback, useMemo, useEffect, useState } from 'react';
import { useMetroContext } from '@/components/providers/metro-provider';
import { metroSelectors } from '@/lib/metro-reducer';
import { CACHE_DURATIONS } from '@/types/metro-context';
import type { 
  MetroState, 
  SearchHistoryItem, 
  FavoriteStation, 
  LoadingStates,
  UserPreferences 
} from '@/types/metro-context';
import type { 
  Station, 
  NetworkStatusType, 
  ServiceDisruption, 
  TripPlannerData 
} from '@/types/metro';

// =================================================================
// MAIN HOOK - useMetro
// =================================================================

/**
 * Main hook to access Metro context with all functionality
 */
export function useMetro() {
  return useMetroContext();
}

// =================================================================
// SPECIALIZED HOOKS - Network Status
// =================================================================

/**
 * Hook for network status with auto-refresh capabilities
 */
export function useNetworkStatus(options?: {
  autoRefresh?: boolean;
  refreshInterval?: number;
}) {
  const { 
    state, 
    setNetworkStatus, 
    setServiceDisruptions, 
    updateNetworkStatus,
    isCacheValid,
    setLoadingState,
    setError 
  } = useMetroContext();
  
  const { autoRefresh = false, refreshInterval = 30000 } = options || {};
  
  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Only refresh if cache is stale
      if (!isCacheValid('networkStatus', CACHE_DURATIONS.NETWORK_STATUS)) {
        updateNetworkStatus();
      }
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, updateNetworkStatus, isCacheValid]);
  
  return {
    networkStatus: state.networkStatus,
    serviceDisruptions: state.serviceDisruptions,
    lastUpdate: state.lastNetworkUpdate,
    isLoading: state.loadingStates.networkStatus,
    error: state.errors.networkStatus,
    hasActiveDisruptions: metroSelectors.hasActiveDisruptions(state),
    // Actions
    setNetworkStatus,
    setServiceDisruptions,
    updateNetworkStatus,
    refresh: updateNetworkStatus,
  };
}

/**
 * Hook for service disruptions with filtering capabilities
 */
export function useServiceDisruptions(lineNumber?: number) {
  const { state } = useMetroContext();
  
  const filteredDisruptions = useMemo(() => {
    if (lineNumber !== undefined) {
      return metroSelectors.getDisruptionsByLine(state, lineNumber);
    }
    return state.serviceDisruptions.filter(d => d.isActive);
  }, [state.serviceDisruptions, lineNumber]);
  
  const disruptionsByLine = useMemo(() => {
    const groups: Record<number, ServiceDisruption[]> = {};
    state.serviceDisruptions.forEach(disruption => {
      if (disruption.isActive) {
        if (!groups[disruption.lineNumber]) {
          groups[disruption.lineNumber] = [];
        }
        groups[disruption.lineNumber].push(disruption);
      }
    });
    return groups;
  }, [state.serviceDisruptions]);
  
  return {
    disruptions: filteredDisruptions,
    disruptionsByLine,
    hasDisruptions: filteredDisruptions.length > 0,
    totalDisruptions: filteredDisruptions.length,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Selections
// =================================================================

/**
 * Hook for station selection with validation
 */
export function useStationSelection() {
  const { 
    state, 
    setSelectedStation, 
    setSelectedLine, 
    clearSelections 
  } = useMetroContext();
  
  const selectStation = useCallback((station: Station | null) => {
    if (station) {
      setSelectedStation(station);
      // Auto-select line if station only belongs to one line
      if (!station.isTransfer) {
        setSelectedLine(station.lineNumber);
      }
    } else {
      setSelectedStation(null);
    }
  }, [setSelectedStation, setSelectedLine]);
  
  const selectLine = useCallback((lineNumber: number | null) => {
    setSelectedLine(lineNumber);
    // Clear station selection if it doesn't belong to selected line
    if (lineNumber && state.selectedStation) {
      const stationBelongsToLine = 
        state.selectedStation.lineNumber === lineNumber ||
        state.selectedStation.transferLines?.includes(lineNumber);
      
      if (!stationBelongsToLine) {
        setSelectedStation(null);
      }
    }
  }, [setSelectedLine, setSelectedStation, state.selectedStation]);
  
  return {
    selectedStation: state.selectedStation,
    selectedLine: state.selectedLine,
    selectStation,
    selectLine,
    clearSelections,
    hasSelection: state.selectedStation !== null || state.selectedLine !== null,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Search & History
// =================================================================

/**
 * Hook for search history with utilities
 */
export function useSearchHistory() {
  const { 
    state, 
    addSearchHistory, 
    clearSearchHistory, 
    removeSearchHistoryItem 
  } = useMetroContext();
  
  const recentSearches = useMemo(() => 
    metroSelectors.getRecentSearches(state, 10),
    [state.searchHistory]
  );
  
  const addSearch = useCallback((
    query: string, 
    resultCount: number, 
    executionTime?: number
  ) => {
    if (query.trim() && state.preferences.searchSettings.rememberSearches) {
      addSearchHistory(query.trim(), resultCount, executionTime);
    }
  }, [addSearchHistory, state.preferences.searchSettings.rememberSearches]);
  
  const getSearchSuggestions = useCallback((currentQuery: string, limit = 5) => {
    if (!currentQuery.trim()) return [];
    
    const query = currentQuery.toLowerCase();
    return state.searchHistory
      .filter(item => item.query.toLowerCase().includes(query))
      .slice(-limit)
      .reverse()
      .map(item => item.query);
  }, [state.searchHistory]);
  
  return {
    searchHistory: state.searchHistory,
    recentSearches,
    searchCount: metroSelectors.getSearchHistoryCount(state),
    addSearch,
    clearSearchHistory,
    removeSearchHistoryItem,
    getSearchSuggestions,
    isEnabled: state.preferences.searchSettings.rememberSearches,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Favorites
// =================================================================

/**
 * Hook for favorite stations with advanced operations
 */
export function useFavorites() {
  const { 
    state, 
    addFavoriteStation, 
    removeFavoriteStation, 
    updateFavoriteStation, 
    clearFavorites,
    isFavoriteStation 
  } = useMetroContext();
  
  const favoritesByLine = useMemo(() => {
    const groups: Record<number, FavoriteStation[]> = {};
    state.favorites.forEach(favorite => {
      const lineNumber = favorite.station.lineNumber;
      if (!groups[lineNumber]) {
        groups[lineNumber] = [];
      }
      groups[lineNumber].push(favorite);
    });
    return groups;
  }, [state.favorites]);
  
  const toggleFavorite = useCallback((station: Station, nickname?: string) => {
    if (isFavoriteStation(station.id)) {
      removeFavoriteStation(station.id);
    } else {
      addFavoriteStation(station, nickname);
    }
  }, [isFavoriteStation, addFavoriteStation, removeFavoriteStation]);
  
  const getFavoriteById = useCallback((stationId: string) => {
    return state.favorites.find(fav => fav.station.id === stationId);
  }, [state.favorites]);
  
  const searchFavorites = useCallback((query: string) => {
    if (!query.trim()) return state.favorites;
    
    const searchTerm = query.toLowerCase();
    return state.favorites.filter(fav => 
      fav.station.name.toLowerCase().includes(searchTerm) ||
      fav.nickname?.toLowerCase().includes(searchTerm) ||
      fav.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }, [state.favorites]);
  
  return {
    favorites: state.favorites,
    favoritesByLine,
    favoritesCount: metroSelectors.getFavoriteStationsCount(state),
    addFavoriteStation,
    removeFavoriteStation,
    updateFavoriteStation,
    clearFavorites,
    toggleFavorite,
    isFavoriteStation,
    getFavoriteById,
    searchFavorites,
    isEmpty: state.favorites.length === 0,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Trip Planning
// =================================================================

/**
 * Hook for trip planning functionality
 */
export function useTripPlanning() {
  const { 
    state, 
    setCurrentTrip, 
    setLastRouteSearch, 
    addSavedTrip, 
    removeSavedTrip, 
    clearSavedTrips 
  } = useMetroContext();
  
  const planTrip = useCallback((fromStation: string, toStation: string) => {
    const trip: TripPlannerData = {
      fromStation,
      toStation,
      departureTime: new Date(),
    };
    
    setCurrentTrip(trip);
    
    // This would typically trigger route calculation
    // For now, we just save the trip
    addSavedTrip(trip);
  }, [setCurrentTrip, addSavedTrip]);
  
  const clearCurrentTrip = useCallback(() => {
    setCurrentTrip(null);
  }, [setCurrentTrip]);
  
  const getSavedTripsByStation = useCallback((stationId: string) => {
    return state.savedTrips.filter(trip => 
      trip.fromStation === stationId || trip.toStation === stationId
    );
  }, [state.savedTrips]);
  
  return {
    currentTrip: state.currentTrip,
    lastRouteSearch: state.lastRouteSearch,
    savedTrips: state.savedTrips,
    savedTripsCount: state.savedTrips.length,
    planTrip,
    clearCurrentTrip,
    setLastRouteSearch,
    addSavedTrip,
    removeSavedTrip,
    clearSavedTrips,
    getSavedTripsByStation,
    hasCurrentTrip: state.currentTrip !== null,
    hasSavedTrips: state.savedTrips.length > 0,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Loading States
// =================================================================

/**
 * Hook for managing loading states
 */
export function useMetroLoading() {
  const { 
    state, 
    setLoadingState, 
    setMultipleLoadingStates, 
    clearAllLoading 
  } = useMetroContext();
  
  const setLoading = useCallback((
    key: keyof LoadingStates | (keyof LoadingStates)[], 
    isLoading: boolean
  ) => {
    if (Array.isArray(key)) {
      const states = key.reduce((acc, k) => ({ ...acc, [k]: isLoading }), {});
      setMultipleLoadingStates(states);
    } else {
      setLoadingState(key, isLoading);
    }
  }, [setLoadingState, setMultipleLoadingStates]);
  
  const withLoading = useCallback(async <T>(
    key: keyof LoadingStates,
    operation: () => Promise<T>
  ): Promise<T> => {
    setLoadingState(key, true);
    try {
      const result = await operation();
      return result;
    } finally {
      setLoadingState(key, false);
    }
  }, [setLoadingState]);
  
  return {
    loadingStates: state.loadingStates,
    isAnyLoading: metroSelectors.isAnyLoading(state),
    activeLoadingStates: metroSelectors.getLoadingStates(state),
    setLoading,
    setLoadingState,
    setMultipleLoadingStates,
    clearAllLoading,
    withLoading,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Preferences
// =================================================================

/**
 * Hook for user preferences management
 */
export function useMetroPreferences() {
  const { state, updatePreferences, resetPreferences } = useMetroContext();
  
  const updateSearchSettings = useCallback((
    updates: Partial<UserPreferences['searchSettings']>
  ) => {
    updatePreferences({
      searchSettings: {
        ...state.preferences.searchSettings,
        ...updates,
      },
    });
  }, [updatePreferences, state.preferences.searchSettings]);
  
  const updateNotificationSettings = useCallback((
    updates: Partial<UserPreferences['notificationSettings']>
  ) => {
    updatePreferences({
      notificationSettings: {
        ...state.preferences.notificationSettings,
        ...updates,
      },
    });
  }, [updatePreferences, state.preferences.notificationSettings]);
  
  const toggleNotification = useCallback((
    key: keyof UserPreferences['notificationSettings']
  ) => {
    updateNotificationSettings({
      [key]: !state.preferences.notificationSettings[key],
    });
  }, [updateNotificationSettings, state.preferences.notificationSettings]);
  
  return {
    preferences: state.preferences,
    updatePreferences,
    updateSearchSettings,
    updateNotificationSettings,
    toggleNotification,
    resetPreferences,
  };
}

// =================================================================
// SPECIALIZED HOOKS - Error Handling
// =================================================================

/**
 * Hook for error handling with utilities
 */
export function useMetroErrors() {
  const { state, setError, clearError, clearAllErrors } = useMetroContext();
  
  const hasError = useCallback((key?: keyof MetroState['errors']) => {
    if (key) {
      return state.errors[key] !== null;
    }
    return metroSelectors.hasAnyError(state);
  }, [state.errors]);
  
  const getError = useCallback((key: keyof MetroState['errors']) => {
    return state.errors[key];
  }, [state.errors]);
  
  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    errorKey: keyof MetroState['errors']
  ): Promise<T | null> => {
    try {
      clearError(errorKey);
      return await operation();
    } catch (error) {
      setError(errorKey, error as Error);
      return null;
    }
  }, [setError, clearError]);
  
  return {
    errors: state.errors,
    activeErrors: metroSelectors.getActiveErrors(state),
    hasError,
    hasAnyError: metroSelectors.hasAnyError(state),
    getError,
    setError,
    clearError,
    clearAllErrors,
    withErrorHandling,
  };
}

// =================================================================
// UTILITY HOOKS
// =================================================================

/**
 * Hook for cache management
 */
export function useMetroCache() {
  const { state, updateCacheTimestamp, clearCache, isCacheValid } = useMetroContext();
  
  const getCacheAge = useCallback((key: keyof MetroState['cacheTimestamps']) => {
    const timestamp = state.cacheTimestamps[key];
    return timestamp ? Date.now() - timestamp.getTime() : null;
  }, [state.cacheTimestamps]);
  
  const refreshCache = useCallback((key: keyof MetroState['cacheTimestamps']) => {
    updateCacheTimestamp(key);
  }, [updateCacheTimestamp]);
  
  return {
    cacheTimestamps: state.cacheTimestamps,
    isCacheValid,
    getCacheAge,
    refreshCache,
    clearCache,
  };
}

/**
 * Hook that combines multiple Metro hooks for convenience
 */
export function useMetroAll() {
  const networkStatus = useNetworkStatus();
  const selections = useStationSelection();
  const searchHistory = useSearchHistory();
  const favorites = useFavorites();
  const tripPlanning = useTripPlanning();
  const loading = useMetroLoading();
  const preferences = useMetroPreferences();
  const errors = useMetroErrors();
  const cache = useMetroCache();
  
  return {
    networkStatus,
    selections,
    searchHistory,
    favorites,
    tripPlanning,
    loading,
    preferences,
    errors,
    cache,
  };
}