/**
 * Optimized React hook for station search with debouncing and advanced features
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Station } from '@/types/metro';
import { 
  searchStationsAdvanced, 
  getSearchSuggestions,
  type OptimizedSearchResult,
  type SearchOptions,
  type SearchMetrics
} from '@/lib/optimized-station-search';

/**
 * Hook configuration options
 */
export interface UseStationSearchOptions extends SearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enableSuggestions?: boolean;
  autoSearch?: boolean;
  onSearchStart?: () => void;
  onSearchComplete?: (results: OptimizedSearchResult[], metrics: SearchMetrics) => void;
  onError?: (error: Error) => void;
}

/**
 * Search state interface
 */
export interface StationSearchState {
  query: string;
  results: OptimizedSearchResult[];
  suggestions: string[];
  isLoading: boolean;
  isDebouncing: boolean;
  error: Error | null;
  metrics: SearchMetrics | null;
  hasSearched: boolean;
}

/**
 * Search actions interface
 */
export interface StationSearchActions {
  setQuery: (query: string) => void;
  search: (query?: string) => Promise<void>;
  clear: () => void;
  clearCache: () => void;
  getSuggestions: (query: string) => string[];
  retry: () => Promise<void>;
}

/**
 * Hook return type
 */
export interface UseStationSearchReturn extends StationSearchState, StationSearchActions {
  // Convenience getters
  stations: Station[];
  isEmpty: boolean;
  hasResults: boolean;
  isInitialized: boolean;
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: Required<UseStationSearchOptions> = {
  debounceMs: 300,
  minQueryLength: 1,
  maxResults: 10,
  enableFuzzy: true,
  enableCache: true,
  enableSuggestions: true,
  autoSearch: true,
  fuzzyThreshold: 0.7,
  includeTransferStations: true,
  sortByRelevance: true,
  highlightMatches: false,
  onSearchStart: () => {},
  onSearchComplete: () => {},
  onError: () => {}
};

/**
 * Optimized station search hook with debouncing and advanced features
 */
export function useStationSearch(
  initialQuery: string = '',
  options: Partial<UseStationSearchOptions> = {}
): UseStationSearchReturn {
  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  
  // State management
  const [state, setState] = useState<StationSearchState>({
    query: initialQuery,
    results: [],
    suggestions: [],
    isLoading: false,
    isDebouncing: false,
    error: null,
    metrics: null,
    hasSearched: false
  });
  
  // Refs for cleanup and debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>('');
  
  /**
   * Perform the actual search
   */
  const performSearch = useCallback(async (searchQuery: string) => {
    // Abort previous search if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isDebouncing: false,
        error: null
      }));
      
      opts.onSearchStart();
      
      // Skip search if query is too short
      if (searchQuery.length < opts.minQueryLength) {
        setState(prev => ({
          ...prev,
          results: [],
          suggestions: [],
          isLoading: false,
          metrics: null,
          hasSearched: true
        }));
        return;
      }
      
      // Perform the search
      const searchStart = performance.now();
      const { results, metrics } = searchStationsAdvanced(searchQuery, opts);
      const searchTime = performance.now() - searchStart;
      
      // Check if search was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      // Get suggestions if enabled
      let suggestions: string[] = [];
      if (opts.enableSuggestions) {
        suggestions = getSearchSuggestions(searchQuery, 5);
      }
      
      // Update state with results
      setState(prev => ({
        ...prev,
        results,
        suggestions,
        isLoading: false,
        metrics: {
          ...metrics,
          searchTime: searchTime
        },
        hasSearched: true
      }));
      
      opts.onSearchComplete(results, metrics);
      
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        const searchError = new Error(`Search failed: ${error.message}`);
        
        setState(prev => ({
          ...prev,
          error: searchError,
          isLoading: false,
          isDebouncing: false
        }));
        
        opts.onError(searchError);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [opts]);
  
  /**
   * Debounced search function
   */
  const debouncedSearch = useCallback((query: string) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Don't debounce if query is empty or too short
    if (!query.trim() || query.length < opts.minQueryLength) {
      performSearch(query);
      return;
    }
    
    // Set debouncing state
    setState(prev => ({
      ...prev,
      isDebouncing: true
    }));
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, opts.debounceMs);
  }, [performSearch, opts.debounceMs, opts.minQueryLength]);
  
  /**
   * Set query and trigger search if auto-search is enabled
   */
  const setQuery = useCallback((newQuery: string) => {
    setState(prev => ({ ...prev, query: newQuery }));
    
    if (opts.autoSearch) {
      debouncedSearch(newQuery);
    }
  }, [debouncedSearch, opts.autoSearch]);
  
  /**
   * Manual search function
   */
  const search = useCallback(async (searchQuery?: string) => {
    const queryToSearch = searchQuery ?? state.query;
    lastQueryRef.current = queryToSearch;
    await performSearch(queryToSearch);
  }, [state.query, performSearch]);
  
  /**
   * Clear search state
   */
  const clear = useCallback(() => {
    // Clear timers
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Abort ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      query: '',
      results: [],
      suggestions: [],
      isLoading: false,
      isDebouncing: false,
      error: null,
      metrics: null,
      hasSearched: false
    });
  }, []);
  
  /**
   * Clear search cache
   */
  const clearCache = useCallback(() => {
    // Import clearSearchCache dynamically to avoid circular dependencies
    import('@/lib/optimized-station-search').then(({ clearSearchCache }) => {
      clearSearchCache();
    });
  }, []);
  
  /**
   * Get suggestions for a query
   */
  const getSuggestions = useCallback((query: string): string[] => {
    return getSearchSuggestions(query, 5);
  }, []);
  
  /**
   * Retry last search
   */
  const retry = useCallback(async () => {
    const queryToRetry = lastQueryRef.current || state.query;
    await performSearch(queryToRetry);
  }, [state.query, performSearch]);
  
  // Auto-search on initial query
  useEffect(() => {
    if (initialQuery && opts.autoSearch) {
      debouncedSearch(initialQuery);
    }
  }, [initialQuery, opts.autoSearch, debouncedSearch]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Computed values
  const stations = useMemo(() => state.results.map(r => r.station), [state.results]);
  const isEmpty = state.results.length === 0;
  const hasResults = state.results.length > 0;
  const isInitialized = state.hasSearched || state.query.length >= opts.minQueryLength;
  
  return {
    // State
    ...state,
    
    // Actions
    setQuery,
    search,
    clear,
    clearCache,
    getSuggestions,
    retry,
    
    // Computed values
    stations,
    isEmpty,
    hasResults,
    isInitialized
  };
}

/**
 * Simple hook for basic station search without advanced features
 */
export function useSimpleStationSearch(
  initialQuery: string = '',
  debounceMs: number = 300
): {
  query: string;
  stations: Station[];
  isLoading: boolean;
  setQuery: (query: string) => void;
} {
  const {
    query,
    stations,
    isLoading,
    setQuery
  } = useStationSearch(initialQuery, {
    debounceMs,
    maxResults: 10,
    enableFuzzy: true,
    enableCache: true,
    enableSuggestions: false,
    highlightMatches: false
  });
  
  return {
    query,
    stations,
    isLoading,
    setQuery
  };
}

/**
 * Hook for search with suggestions
 */
export function useStationSearchWithSuggestions(
  initialQuery: string = '',
  options: Partial<UseStationSearchOptions> = {}
): UseStationSearchReturn & {
  selectedSuggestion: string | null;
  selectSuggestion: (suggestion: string) => void;
  clearSuggestion: () => void;
} {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  const searchResult = useStationSearch(initialQuery, {
    enableSuggestions: true,
    ...options
  });
  
  const selectSuggestion = useCallback((suggestion: string) => {
    setSelectedSuggestion(suggestion);
    searchResult.setQuery(suggestion);
  }, [searchResult]);
  
  const clearSuggestion = useCallback(() => {
    setSelectedSuggestion(null);
  }, []);
  
  return {
    ...searchResult,
    selectedSuggestion,
    selectSuggestion,
    clearSuggestion
  };
}