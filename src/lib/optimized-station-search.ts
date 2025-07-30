/**
 * Optimized station search engine integrating all performance improvements
 * Maintains compatibility with existing API while providing O(log n) performance
 */

import type { Station } from '@/types/metro';
import type { ValidMatchType } from '@/types/search';
import { stations } from '@/data/stations';
import { Trie } from './trie';
import { SearchCache } from './lru-cache';
import { FuzzySearch, type FuzzyMatch } from './fuzzy-search';
import { SearchRanking, type RankedSearchResult } from './search-ranking';
import { normalizeText } from './text-utils';

/**
 * Search options for fine-tuning search behavior
 */
export interface SearchOptions {
  maxResults?: number;
  enableFuzzy?: boolean;
  enableCache?: boolean;
  fuzzyThreshold?: number;
  includeTransferStations?: boolean;
  sortByRelevance?: boolean;
  highlightMatches?: boolean;
}

/**
 * Extended search result with optimization metadata
 */
export interface OptimizedSearchResult {
  station: Station;
  score: number;
  matchType: ValidMatchType;
  highlights?: Array<{ start: number; end: number }>;
  cached: boolean;
  searchTime: number;
}

/**
 * Search performance metrics
 */
export interface SearchMetrics {
  searchTime: number;
  totalStations: number;
  resultsFound: number;
  cacheHit: boolean;
  algorithmUsed: 'trie' | 'fuzzy' | 'ranking' | 'hybrid';
  processingSteps: string[];
}

/**
 * Optimized station search engine
 */
class OptimizedStationSearchEngine {
  private trie: Trie;
  private cache: SearchCache;
  private fuzzySearch: FuzzySearch<Station>;
  private ranking: SearchRanking;
  private initialized: boolean = false;
  
  constructor() {
    this.trie = new Trie();
    this.cache = new SearchCache(100, 5 * 60 * 1000); // 5 minutes TTL
    this.fuzzySearch = new FuzzySearch<Station>();
    this.ranking = new SearchRanking();
    this.initialize();
  }
  
  /**
   * Initialize search engine with station data
   */
  private initialize(): void {
    if (this.initialized) return;
    
    const startTime = performance.now();
    
    // Build Trie index
    for (const station of stations) {
      this.trie.insert(station.name, station.id);
    }
    
    // Initialize fuzzy search
    this.fuzzySearch.addItems(stations, (station) => station.name);
    
    this.initialized = true;
    
    const initTime = performance.now() - startTime;
    console.log(`Station search engine initialized in ${initTime.toFixed(2)}ms`);
    console.log(`Indexed ${stations.length} stations`);
    console.log('Trie stats:', this.trie.getStats());
  }
  
  /**
   * Main search method with comprehensive optimization
   */
  search(
    query: string, 
    options: SearchOptions = {}
  ): { results: OptimizedSearchResult[]; metrics: SearchMetrics } {
    const startTime = performance.now();
    const processingSteps: string[] = [];
    
    // Default options
    const opts = {
      maxResults: 10,
      enableFuzzy: true,
      enableCache: true,
      fuzzyThreshold: 0.7,
      includeTransferStations: true,
      sortByRelevance: true,
      highlightMatches: false,
      ...options
    };
    
    // Early return for empty query
    if (!query.trim()) {
      return {
        results: [],
        metrics: {
          searchTime: performance.now() - startTime,
          totalStations: stations.length,
          resultsFound: 0,
          cacheHit: false,
          algorithmUsed: 'hybrid',
          processingSteps: ['empty-query']
        }
      };
    }
    
    processingSteps.push('query-validation');
    
    // Check cache first
    let cachedResults: OptimizedSearchResult[] | undefined;
    if (opts.enableCache) {
      cachedResults = this.cache.get(query);
      if (cachedResults) {
        processingSteps.push('cache-hit');
        return {
          results: cachedResults.slice(0, opts.maxResults),
          metrics: {
            searchTime: performance.now() - startTime,
            totalStations: stations.length,
            resultsFound: cachedResults.length,
            cacheHit: true,
            algorithmUsed: 'hybrid',
            processingSteps
          }
        };
      }
      processingSteps.push('cache-miss');
    }
    
    let results: OptimizedSearchResult[] = [];
    let algorithmUsed: 'trie' | 'fuzzy' | 'ranking' | 'hybrid' = 'hybrid';
    
    // Strategy 1: Try Trie-based prefix search (fastest)
    const normalizedQuery = normalizeText(query);
    const trieResults = this.searchWithTrie(normalizedQuery);
    
    if (trieResults.length > 0) {
      processingSteps.push('trie-search');
      results = this.convertTrieResults(trieResults, query, opts);
      algorithmUsed = 'trie';
    }
    
    // Strategy 2: If Trie doesn't find enough results, use fuzzy search
    if (results.length < Math.min(5, opts.maxResults) && opts.enableFuzzy) {
      processingSteps.push('fuzzy-search');
      const fuzzyResults = this.searchWithFuzzy(query, opts);
      
      // Merge and deduplicate results
      const existingIds = new Set(results.map(r => r.station.id));
      const newFuzzyResults = fuzzyResults.filter(r => !existingIds.has(r.station.id));
      
      results = [...results, ...newFuzzyResults];
      algorithmUsed = results.length > trieResults.length ? 'hybrid' : 'trie';
    }
    
    // Strategy 3: Apply advanced ranking if enabled
    if (opts.sortByRelevance && results.length > 1) {
      processingSteps.push('relevance-ranking');
      results = this.applyAdvancedRanking(results, query);
      algorithmUsed = 'hybrid';
    }
    
    // Strategy 4: Filter transfer stations if requested
    if (!opts.includeTransferStations) {
      processingSteps.push('transfer-filter');
      results = results.filter(r => !r.station.isTransfer);
    }
    
    // Strategy 5: Add highlights if requested
    if (opts.highlightMatches) {
      processingSteps.push('highlight-generation');
      results = this.addHighlights(results, query);
    }
    
    // Limit results
    results = results.slice(0, opts.maxResults);
    
    // Cache results
    if (opts.enableCache && results.length > 0) {
      processingSteps.push('cache-store');
      this.cache.set(query, results);
    }
    
    const searchTime = performance.now() - startTime;
    
    // Update performance metadata
    results = results.map(result => ({
      ...result,
      cached: false,
      searchTime
    }));
    
    return {
      results,
      metrics: {
        searchTime,
        totalStations: stations.length,
        resultsFound: results.length,
        cacheHit: false,
        algorithmUsed,
        processingSteps
      }
    };
  }
  
  /**
   * Search using Trie data structure
   */
  private searchWithTrie(query: string): Station[] {
    const stationIds = this.trie.findByPrefix(query);
    return Array.from(stationIds)
      .map(id => stations.find(s => s.id === id))
      .filter((station): station is Station => station !== undefined);
  }
  
  /**
   * Search using fuzzy matching
   */
  private searchWithFuzzy(query: string, options: SearchOptions): OptimizedSearchResult[] {
    const fuzzyMatches = this.fuzzySearch.search(query, options.maxResults || 10);
    
    return fuzzyMatches.map(match => ({
      station: match.item,
      score: match.score,
      matchType: this.convertMatchType(match),
      cached: false,
      searchTime: 0
    }));
  }
  
  /**
   * Apply advanced ranking to results
   */
  private applyAdvancedRanking(
    results: OptimizedSearchResult[], 
    query: string
  ): OptimizedSearchResult[] {
    const stationsToRank = results.map(r => r.station);
    const rankedResults = this.ranking.rankStations(stationsToRank, query);
    
    // Merge ranking scores with existing results
    const rankedMap = new Map(rankedResults.map(r => [r.station.id, r]));
    
    return results
      .map(result => {
        const ranked = rankedMap.get(result.station.id);
        const rankedMatchType = ranked?.matchType;
        return {
          ...result,
          score: ranked?.score || result.score,
          matchType: (rankedMatchType && rankedMatchType !== 'none') ? rankedMatchType : result.matchType
        };
      })
      .sort((a, b) => b.score - a.score);
  }
  
  /**
   * Add highlight information to results
   */
  private addHighlights(
    results: OptimizedSearchResult[], 
    query: string
  ): OptimizedSearchResult[] {
    const normalizedQuery = normalizeText(query);
    
    return results.map(result => {
      const normalizedName = normalizeText(result.station.name);
      const highlights: Array<{ start: number; end: number }> = [];
      
      // Find highlight positions
      const index = normalizedName.indexOf(normalizedQuery);
      if (index !== -1) {
        highlights.push({
          start: index,
          end: index + normalizedQuery.length
        });
      }
      
      return {
        ...result,
        highlights: highlights.length > 0 ? highlights : undefined
      };
    });
  }
  
  /**
   * Convert fuzzy match type to our match type
   */
  private convertMatchType(match: FuzzyMatch<Station>): OptimizedSearchResult['matchType'] {
    if (match.similarity === 1) return 'exact';
    if (match.distance === 0) return 'exact';
    if (match.score > 8) return 'prefix';
    if (match.score > 5) return 'substring';
    return 'fuzzy';
  }
  
  /**
   * Convert Trie results to OptimizedSearchResult format
   */
  private convertTrieResults(
    stations: Station[], 
    query: string, 
    options: SearchOptions
  ): OptimizedSearchResult[] {
    const normalizedQuery = normalizeText(query);
    
    return stations.map(station => {
      const normalizedName = normalizeText(station.name);
      let matchType: OptimizedSearchResult['matchType'];
      let score: number;
      
      if (normalizedName === normalizedQuery) {
        matchType = 'exact';
        score = 100;
      } else if (normalizedName.startsWith(normalizedQuery)) {
        matchType = 'prefix';
        score = 80;
      } else if (normalizedName.includes(normalizedQuery)) {
        matchType = 'substring';
        score = 60;
      } else {
        matchType = 'fuzzy';
        score = 40;
      }
      
      // Bonus for transfer stations
      if (station.isTransfer) {
        score += 10;
      }
      
      return {
        station,
        score,
        matchType,
        cached: false,
        searchTime: 0
      };
    }).sort((a, b) => b.score - a.score);
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get search engine statistics
   */
  getStats() {
    return {
      trie: this.trie.getStats(),
      cache: this.cache.getStats(),
      fuzzy: {
        size: this.fuzzySearch.size(),
        options: this.fuzzySearch.getOptions()
      },
      initialized: this.initialized
    };
  }
}

// Global search engine instance
const searchEngine = new OptimizedStationSearchEngine();

/**
 * Optimized search function maintaining backward compatibility
 * This replaces the original searchStations function
 */
export function searchStations(query: string): Station[] {
  const { results } = searchEngine.search(query, {
    maxResults: 20,
    enableFuzzy: true,
    enableCache: true,
    sortByRelevance: true
  });
  
  return results.map(r => r.station);
}

/**
 * Advanced search function with full options
 */
export function searchStationsAdvanced(
  query: string, 
  options?: SearchOptions
): { results: OptimizedSearchResult[]; metrics: SearchMetrics } {
  return searchEngine.search(query, options);
}

/**
 * Get search suggestions/completions
 */
export function getSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = normalizeText(query);
  const trie = searchEngine['trie']; // Access private member for suggestions
  
  return trie.getCompletions(normalizedQuery, limit);
}

/**
 * Get search engine performance statistics
 */
export function getSearchStats() {
  return searchEngine.getStats();
}

/**
 * Clear search cache
 */
export function clearSearchCache(): void {
  searchEngine.clearCache();
}

// Export the engine for advanced usage
export { searchEngine as stationSearchEngine };