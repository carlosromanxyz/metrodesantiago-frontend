"use client";

import React, { 
  createContext, 
  useReducer, 
  useCallback, 
  useMemo, 
  useEffect, 
  useRef,
  ReactNode 
} from 'react';
import type {
  MetroState,
  MetroContextValue,
  MetroProviderProps,
  LoadingStates,
  UserPreferences,
  SearchHistoryItem,
  FavoriteStation,
  RouteSearchResult,
} from '@/types/metro-context';
import {
  INITIAL_METRO_STATE,
  CACHE_DURATIONS,
} from '@/types/metro-context';
import type { Station, NetworkStatusType, ServiceDisruption, TripPlannerData } from '@/types/metro';
import { createMetroReducer, metroSelectors } from '@/lib/metro-reducer';
import { 
  saveMetroState, 
  loadMetroState, 
  createDebouncedSave,
  withPersistenceErrorHandling,
  PersistenceError 
} from '@/lib/metro-persistence';

/**
 * Metro Context
 */
const MetroContext = createContext<MetroContextValue | undefined>(undefined);

/**
 * Metro Provider Component
 * 
 * Provides centralized state management for Metro-related data with:
 * - useReducer for complex state management
 * - Memoized actions to prevent unnecessary re-renders
 * - localStorage persistence with debouncing
 * - Error handling and recovery
 * - Type-safe API
 */
export function MetroProvider({
  children,
  initialState,
  enablePersistence = true,
  persistenceKey = 'metro-app-state',
  onStateChange,
  onError,
}: MetroProviderProps) {
  // Initialize reducer with middleware
  const reducerMiddleware = useMemo(() => ({
    onStateChange: (prevState: MetroState, nextState: MetroState) => {
      // Call external state change handler
      if (onStateChange) {
        onStateChange(nextState);
      }
      
      // Debounced persistence save
      if (enablePersistence && nextState !== prevState) {
        debouncedSave(nextState, persistenceKey);
      }
    },
    onError: (error: Error) => {
      console.error('Metro reducer error:', error);
      if (onError) {
        onError(error);
      }
    },
  }), [enablePersistence, persistenceKey, onStateChange, onError]);

  const reducer = useMemo(() => createMetroReducer(reducerMiddleware), [reducerMiddleware]);
  
  // State management
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_METRO_STATE,
    ...initialState,
  });
  
  // Refs for persistence and cleanup
  const isHydratedRef = useRef(false);
  const debouncedSave = useMemo(() => createDebouncedSave(1000), []);
  
  // =================================================================
  // INITIALIZATION & PERSISTENCE
  // =================================================================
  
  // Load persisted state on mount
  useEffect(() => {
    if (!enablePersistence || isHydratedRef.current) return;
    
    const loadPersistedState = async () => {
      try {
        const persistedState = await loadMetroState(persistenceKey);
        if (persistedState) {
          dispatch({
            type: 'HYDRATE_STATE',
            payload: { state: persistedState },
          });
        }
        isHydratedRef.current = true;
      } catch (error) {
        console.error('Failed to load persisted Metro state:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };
    
    loadPersistedState();
  }, [enablePersistence, persistenceKey, onError]);
  
  // =================================================================
  // MEMOIZED ACTIONS - Network Status
  // =================================================================
  
  const setNetworkStatus = useCallback((status: NetworkStatusType) => {
    dispatch({
      type: 'SET_NETWORK_STATUS',
      payload: { status },
    });
  }, []);
  
  const setServiceDisruptions = useCallback((disruptions: ServiceDisruption[]) => {
    dispatch({
      type: 'SET_SERVICE_DISRUPTIONS',
      payload: { disruptions },
    });
  }, []);
  
  const updateNetworkStatus = useCallback(async () => {
    dispatch({ type: 'UPDATE_NETWORK_STATUS' });
    
    try {
      // This would typically make API calls to update network status
      // For now, we just simulate the loading state
      
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update loading state
      dispatch({
        type: 'SET_LOADING_STATE',
        payload: { key: 'networkStatus', isLoading: false },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { key: 'networkStatus', error: error as Error },
      });
    }
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Selections
  // =================================================================
  
  const setSelectedStation = useCallback((station: Station | null) => {
    dispatch({
      type: 'SET_SELECTED_STATION',
      payload: { station },
    });
  }, []);
  
  const setSelectedLine = useCallback((lineNumber: number | null) => {
    dispatch({
      type: 'SET_SELECTED_LINE',
      payload: lineNumber,
    });
  }, []);
  
  const clearSelections = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTIONS' });
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Search History
  // =================================================================
  
  const addSearchHistory = useCallback((
    query: string, 
    resultCount: number, 
    executionTime?: number
  ) => {
    if (!state.preferences.searchSettings.rememberSearches) return;
    
    dispatch({
      type: 'ADD_SEARCH_HISTORY',
      payload: { item: { query, resultCount, executionTime } },
    });
  }, [state.preferences.searchSettings.rememberSearches]);
  
  const clearSearchHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
  }, []);
  
  const removeSearchHistoryItem = useCallback((id: string) => {
    dispatch({
      type: 'REMOVE_SEARCH_HISTORY_ITEM',
      payload: { id },
    });
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Favorites
  // =================================================================
  
  const addFavoriteStation = useCallback((
    station: Station,
    nickname?: string,
    tags?: string[]
  ) => {
    dispatch({
      type: 'ADD_FAVORITE_STATION',
      payload: { station, nickname, tags },
    });
  }, []);
  
  const removeFavoriteStation = useCallback((stationId: string) => {
    dispatch({
      type: 'REMOVE_FAVORITE_STATION',
      payload: { stationId },
    });
  }, []);
  
  const updateFavoriteStation = useCallback((
    id: string, 
    updates: Partial<FavoriteStation>
  ) => {
    dispatch({
      type: 'UPDATE_FAVORITE_STATION',
      payload: { id, updates },
    });
  }, []);
  
  const clearFavorites = useCallback(() => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  }, []);
  
  const isFavoriteStation = useCallback((stationId: string): boolean => {
    return metroSelectors.isFavoriteStation(state, stationId);
  }, [state]);
  
  // =================================================================
  // MEMOIZED ACTIONS - Route Planning
  // =================================================================
  
  const setCurrentTrip = useCallback((trip: TripPlannerData | null) => {
    dispatch({
      type: 'SET_CURRENT_TRIP',
      payload: trip,
    });
  }, []);
  
  const setLastRouteSearch = useCallback((result: RouteSearchResult | null) => {
    dispatch({
      type: 'SET_LAST_ROUTE_SEARCH',
      payload: result,
    });
  }, []);
  
  const addSavedTrip = useCallback((trip: TripPlannerData) => {
    dispatch({
      type: 'ADD_SAVED_TRIP',
      payload: trip,
    });
  }, []);
  
  const removeSavedTrip = useCallback((tripId: string) => {
    dispatch({
      type: 'REMOVE_SAVED_TRIP',
      payload: { tripId },
    });
  }, []);
  
  const clearSavedTrips = useCallback(() => {
    dispatch({ type: 'CLEAR_SAVED_TRIPS' });
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Loading States
  // =================================================================
  
  const setLoadingState = useCallback((
    key: keyof LoadingStates, 
    isLoading: boolean
  ) => {
    dispatch({
      type: 'SET_LOADING_STATE',
      payload: { key, isLoading },
    });
  }, []);
  
  const setMultipleLoadingStates = useCallback((states: Partial<LoadingStates>) => {
    dispatch({
      type: 'SET_MULTIPLE_LOADING_STATES',
      payload: states,
    });
  }, []);
  
  const clearAllLoading = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_LOADING' });
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Preferences
  // =================================================================
  
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: updates,
    });
  }, []);
  
  const resetPreferences = useCallback(() => {
    dispatch({ type: 'RESET_PREFERENCES' });
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Cache Management
  // =================================================================
  
  const updateCacheTimestamp = useCallback((key: keyof MetroState['cacheTimestamps']) => {
    dispatch({
      type: 'UPDATE_CACHE_TIMESTAMP',
      payload: { key },
    });
  }, []);
  
  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);
  
  const isCacheValid = useCallback((
    key: keyof MetroState['cacheTimestamps'], 
    maxAge: number
  ): boolean => {
    return metroSelectors.isCacheValid(state, key, maxAge);
  }, [state]);
  
  // =================================================================
  // MEMOIZED ACTIONS - Error Handling
  // =================================================================
  
  const setError = useCallback((
    key: keyof MetroState['errors'], 
    error: Error | null
  ) => {
    dispatch({
      type: 'SET_ERROR',
      payload: { key, error },
    });
  }, []);
  
  const clearError = useCallback((key: keyof MetroState['errors']) => {
    dispatch({
      type: 'CLEAR_ERROR',
      payload: { key },
    });
  }, []);
  
  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  }, []);
  
  // =================================================================
  // MEMOIZED ACTIONS - Utility Actions
  // =================================================================
  
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);
  
  const hydrateState = useCallback((partialState: Partial<MetroState>) => {
    dispatch({
      type: 'HYDRATE_STATE',
      payload: { state: partialState },
    });
  }, []);
  
  // =================================================================
  // MEMOIZED COMPUTED PROPERTIES
  // =================================================================
  
  const computedProperties = useMemo(() => ({
    hasActiveDisruptions: metroSelectors.hasActiveDisruptions(state),
    favoriteStationsCount: metroSelectors.getFavoriteStationsCount(state),
    searchHistoryCount: metroSelectors.getSearchHistoryCount(state),
    isAnyLoading: metroSelectors.isAnyLoading(state),
    hasAnyError: metroSelectors.hasAnyError(state),
  }), [state]);
  
  // =================================================================
  // MEMOIZED CONTEXT VALUE
  // =================================================================
  
  const contextValue = useMemo<MetroContextValue>(() => ({
    // State
    state,
    
    // Network status actions
    setNetworkStatus,
    setServiceDisruptions,
    updateNetworkStatus,
    
    // Selection actions
    setSelectedStation,
    setSelectedLine,
    clearSelections,
    
    // Search actions
    addSearchHistory,
    clearSearchHistory,
    removeSearchHistoryItem,
    
    // Favorites actions
    addFavoriteStation,
    removeFavoriteStation,
    updateFavoriteStation,
    clearFavorites,
    isFavoriteStation,
    
    // Route planning actions
    setCurrentTrip,
    setLastRouteSearch,
    addSavedTrip,
    removeSavedTrip,
    clearSavedTrips,
    
    // Loading actions
    setLoadingState,
    setMultipleLoadingStates,
    clearAllLoading,
    
    // Preferences actions
    updatePreferences,
    resetPreferences,
    
    // Cache actions
    updateCacheTimestamp,
    clearCache,
    isCacheValid,
    
    // Error actions
    setError,
    clearError,
    clearAllErrors,
    
    // Utility actions
    resetState,
    hydrateState,
    
    // Computed properties
    ...computedProperties,
  }), [
    state,
    // Network status actions
    setNetworkStatus,
    setServiceDisruptions,
    updateNetworkStatus,
    // Selection actions
    setSelectedStation,
    setSelectedLine,
    clearSelections,
    // Search actions
    addSearchHistory,
    clearSearchHistory,
    removeSearchHistoryItem,
    // Favorites actions
    addFavoriteStation,
    removeFavoriteStation,
    updateFavoriteStation,
    clearFavorites,
    isFavoriteStation,
    // Route planning actions
    setCurrentTrip,
    setLastRouteSearch,
    addSavedTrip,
    removeSavedTrip,
    clearSavedTrips,
    // Loading actions
    setLoadingState,
    setMultipleLoadingStates,
    clearAllLoading,
    // Preferences actions
    updatePreferences,
    resetPreferences,
    // Cache actions
    updateCacheTimestamp,
    clearCache,
    isCacheValid,
    // Error actions
    setError,
    clearError,
    clearAllErrors,
    // Utility actions
    resetState,
    hydrateState,
    // Computed properties
    computedProperties,
  ]);
  
  return (
    <MetroContext.Provider value={contextValue}>
      {children}
    </MetroContext.Provider>
  );
}

/**
 * Hook to access Metro context
 * Throws an error if used outside of MetroProvider
 */
export function useMetroContext(): MetroContextValue {
  const context = React.useContext(MetroContext);
  
  if (context === undefined) {
    throw new Error(
      'useMetroContext must be used within a MetroProvider. ' +
      'Make sure your component is wrapped with <MetroProvider>.'
    );
  }
  
  return context;
}

/**
 * Development-only hook for debugging Metro state
 */
export function useMetroDebug() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('useMetroDebug is only available in development mode');
  }
  
  const context = useMetroContext();
  
  return {
    ...context,
    // Additional debug utilities
    _debugState: context.state,
    _debugSelectors: metroSelectors,
    _logState: () => console.log('Metro State:', context.state),
    _logErrors: () => console.log('Metro Errors:', context.state.errors),
    _logLoadingStates: () => console.log('Loading States:', context.state.loadingStates),
  };
}