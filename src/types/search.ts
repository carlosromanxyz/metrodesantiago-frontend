/**
 * TypeScript type definitions for optimized station search functionality
 */

import { z } from 'zod';
import type { Station } from './metro';

/**
 * Zod schemas for search-related types
 */

// Search options schema
export const SearchOptionsSchema = z.object({
  maxResults: z.number().int().positive().optional().default(10),
  enableFuzzy: z.boolean().optional().default(true),
  enableCache: z.boolean().optional().default(true),
  fuzzyThreshold: z.number().min(0).max(1).optional().default(0.7),
  includeTransferStations: z.boolean().optional().default(true),
  sortByRelevance: z.boolean().optional().default(true),
  highlightMatches: z.boolean().optional().default(false)
});

// Match type schema
export const MatchTypeSchema = z.enum([
  'exact',
  'prefix', 
  'substring',
  'fuzzy',
  'token',
  'none'
]);

// Highlight range schema
export const HighlightRangeSchema = z.object({
  start: z.number().int().min(0),
  end: z.number().int().min(0),
  type: MatchTypeSchema,
  confidence: z.number().min(0).max(1)
});

// Score breakdown schema
export const ScoreBreakdownSchema = z.object({
  exactMatch: z.number(),
  prefixMatch: z.number(),
  substringMatch: z.number(),
  fuzzyMatch: z.number(),
  transferStation: z.number(),
  popularity: z.number(),
  lineCount: z.number(),
  lengthPenalty: z.number(),
  positionBonus: z.number(),
  total: z.number()
});

// Search metrics schema
export const SearchMetricsSchema = z.object({
  searchTime: z.number().min(0),
  totalStations: z.number().int().min(0),
  resultsFound: z.number().int().min(0),
  cacheHit: z.boolean(),
  algorithmUsed: z.enum(['trie', 'fuzzy', 'ranking', 'hybrid']),
  processingSteps: z.array(z.string())
});

// Optimized search result schema
export const OptimizedSearchResultSchema = z.object({
  station: z.custom<Station>(),
  score: z.number(),
  matchType: MatchTypeSchema,
  highlights: z.array(z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(0)
  })).optional(),
  cached: z.boolean(),
  searchTime: z.number().min(0)
});

// Ranked search result schema
export const RankedSearchResultSchema = z.object({
  station: z.custom<Station>(),
  score: z.number(),
  breakdown: ScoreBreakdownSchema,
  matchType: MatchTypeSchema,
  highlightRanges: z.array(HighlightRangeSchema)
});

// Fuzzy match schema
export const FuzzyMatchSchema = z.object({
  item: z.custom<Station>(),
  score: z.number(),
  distance: z.number().int().min(0),
  similarity: z.number().min(0).max(1),
  matches: z.array(z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(0),
    type: z.enum(['exact', 'prefix', 'substring', 'fuzzy', 'transposition']),
    confidence: z.number().min(0).max(1)
  }))
});

// Search cache entry schema
export const SearchCacheEntrySchema = z.object({
  query: z.string(),
  results: z.array(OptimizedSearchResultSchema),
  timestamp: z.number(),
  ttl: z.number()
});

// Trie node schema (for debugging/testing)
export const TrieNodeSchema = z.object({
  isEndOfWord: z.boolean(),
  stationIds: z.array(z.string()),
  childrenCount: z.number().int().min(0)
});

// Fuzzy search options schema
export const FuzzySearchOptionsSchema = z.object({
  threshold: z.number().min(0).max(1).default(0.6),
  maxDistance: z.number().int().min(0).default(3),
  caseSensitive: z.boolean().default(false),
  ignoreAccents: z.boolean().default(true),
  matchPartialWords: z.boolean().default(true),
  transposeBonus: z.number().default(0.2),
  prefixBonus: z.number().default(0.3),
  substringBonus: z.number().default(0.1)
});

// Ranking configuration schema
export const RankingConfigSchema = z.object({
  weights: z.object({
    exactMatch: z.number().default(100),
    prefixMatch: z.number().default(80),
    substringMatch: z.number().default(60),
    fuzzyMatch: z.number().default(40),
    transferStation: z.number().default(20),
    popularity: z.number().default(15),
    lineCount: z.number().default(10),
    lengthPenalty: z.number().default(-5),
    positionBonus: z.number().default(5)
  }),
  fuzzyThreshold: z.number().min(0).max(1).default(0.7),
  maxResults: z.number().int().positive().default(20),
  minScore: z.number().default(5)
});

// Cache statistics schema
export const CacheStatsSchema = z.object({
  size: z.number().int().min(0),
  capacity: z.number().int().positive(),
  hitCount: z.number().int().min(0),
  missCount: z.number().int().min(0),
  hitRate: z.number().min(0).max(1),
  oldestEntry: z.number().nullable(),
  newestEntry: z.number().nullable()
});

// Search engine statistics schema
export const SearchEngineStatsSchema = z.object({
  trie: z.object({
    nodes: z.number().int().min(0),
    words: z.number().int().min(0),
    maxDepth: z.number().int().min(0)
  }),
  cache: CacheStatsSchema,
  fuzzy: z.object({
    size: z.number().int().min(0),
    options: FuzzySearchOptionsSchema
  }),
  initialized: z.boolean()
});

/**
 * TypeScript types inferred from Zod schemas
 */

export type SearchOptions = z.infer<typeof SearchOptionsSchema>;
export type MatchType = z.infer<typeof MatchTypeSchema>;
export type HighlightRange = z.infer<typeof HighlightRangeSchema>;
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;
export type SearchMetrics = z.infer<typeof SearchMetricsSchema>;
export type OptimizedSearchResult = z.infer<typeof OptimizedSearchResultSchema>;
export type RankedSearchResult = z.infer<typeof RankedSearchResultSchema>;
export type FuzzyMatch<T = Station> = Omit<z.infer<typeof FuzzyMatchSchema>, 'item'> & { item: T };
export type SearchCacheEntry = z.infer<typeof SearchCacheEntrySchema>;
export type TrieNodeInfo = z.infer<typeof TrieNodeSchema>;
export type FuzzySearchOptions = z.infer<typeof FuzzySearchOptionsSchema>;
export type RankingConfig = z.infer<typeof RankingConfigSchema>;
export type CacheStats = z.infer<typeof CacheStatsSchema>;
export type SearchEngineStats = z.infer<typeof SearchEngineStatsSchema>;

/**
 * Additional utility types
 */

// Search result with station and metadata
export interface SearchResultWithStation {
  station: Station;
  score: number;
  relevance: number;
  matchedFields: string[];
  highlightedText?: string;
}

// Search filter options
export interface SearchFilters {
  lineNumbers?: number[];
  transferOnly?: boolean;
  minScore?: number;
  maxResults?: number;
}

// Search context for advanced filtering
export interface SearchContext {
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  recentSearches?: string[];
  favoriteStations?: string[];
  searchHistory?: Array<{
    query: string;
    timestamp: number;
    resultCount: number;
  }>;
}

// Search suggestion with metadata
export interface SearchSuggestion {
  text: string;
  type: 'station' | 'line' | 'area' | 'completion';
  confidence: number;
  metadata?: {
    lineNumber?: number;
    isTransfer?: boolean;
    popularity?: number;
  };
}

// Search analytics event
export interface SearchAnalyticsEvent {
  type: 'search_performed' | 'suggestion_selected' | 'result_clicked' | 'cache_hit' | 'cache_miss';
  query: string;
  resultCount: number;
  searchTime: number;
  algorithm: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Performance benchmark result
export interface SearchBenchmarkResult {
  query: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  memoryUsage: number;
  algorithm: string;
  cacheEnabled: boolean;
}

/**
 * Type guards and validation functions
 */

export const isValidSearchOptions = (data: unknown): data is SearchOptions => {
  return SearchOptionsSchema.safeParse(data).success;
};

export const isValidMatchType = (data: unknown): data is MatchType => {
  return MatchTypeSchema.safeParse(data).success;
};

export const isValidSearchResult = (data: unknown): data is OptimizedSearchResult => {
  return OptimizedSearchResultSchema.safeParse(data).success;
};

export const isValidSearchMetrics = (data: unknown): data is SearchMetrics => {
  return SearchMetricsSchema.safeParse(data).success;
};

/**
 * Default configurations and constants
 */

export const DEFAULT_SEARCH_OPTIONS: Required<SearchOptions> = {
  maxResults: 10,
  enableFuzzy: true,
  enableCache: true,
  fuzzyThreshold: 0.7,
  includeTransferStations: true,
  sortByRelevance: true,
  highlightMatches: false
};

export const SEARCH_PERFORMANCE_THRESHOLDS = {
  FAST: 10,      // < 10ms
  MEDIUM: 50,    // 10-50ms
  SLOW: 100,     // 50-100ms
  VERY_SLOW: 200 // > 100ms
} as const;

export const CACHE_CONFIG = {
  DEFAULT_CAPACITY: 100,
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MIN_QUERY_LENGTH: 1,
  MAX_QUERY_LENGTH: 100
} as const;

/**
 * Error types for search operations
 */

export class SearchError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SearchError';
  }
}

export class SearchTimeoutError extends SearchError {
  constructor(timeout: number) {
    super(`Search operation timed out after ${timeout}ms`, 'SEARCH_TIMEOUT', { timeout });
  }
}

export class SearchValidationError extends SearchError {
  constructor(field: string, value: unknown) {
    super(`Invalid search parameter: ${field}`, 'SEARCH_VALIDATION', { field, value });
  }
}

export class SearchCacheError extends SearchError {
  constructor(operation: string, reason: string) {
    super(`Cache operation failed: ${operation} - ${reason}`, 'SEARCH_CACHE_ERROR', { operation, reason });
  }
}