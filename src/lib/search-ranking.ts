/**
 * Advanced ranking algorithm for station search results
 * Provides sophisticated scoring based on multiple factors
 */

import type { Station } from '@/types/metro';
import type { ValidMatchType } from '@/types/search';
import { 
  normalizeText, 
  calculateRelevanceScore, 
  startsWithIgnoreCase, 
  containsIgnoreCase,
  similarityRatio
} from './text-utils';

/**
 * Search result with comprehensive scoring
 */
export interface RankedSearchResult {
  station: Station;
  score: number;
  breakdown: ScoreBreakdown;
  matchType: MatchType;
  highlightRanges: HighlightRange[];
}

/**
 * Detailed score breakdown for transparency
 */
export interface ScoreBreakdown {
  exactMatch: number;
  prefixMatch: number;
  substringMatch: number;
  fuzzyMatch: number;
  transferStation: number;
  popularity: number;
  lineCount: number;
  lengthPenalty: number;
  positionBonus: number;
  total: number;
}

/**
 * Type of match found
 */
export type MatchType = 
  | 'exact'           // Exact name match
  | 'prefix'          // Name starts with query
  | 'substring'       // Name contains query
  | 'fuzzy'           // Fuzzy match with typos
  | 'token'           // Individual word matches
  | 'none';           // No match found

/**
 * Range to highlight in search results
 */
export interface HighlightRange {
  start: number;
  end: number;
  type: MatchType;
  confidence: number;
}

/**
 * Configuration for ranking algorithm
 */
export interface RankingConfig {
  weights: {
    exactMatch: number;
    prefixMatch: number;
    substringMatch: number;
    fuzzyMatch: number;
    transferStation: number;
    popularity: number;
    lineCount: number;
    lengthPenalty: number;
    positionBonus: number;
  };
  fuzzyThreshold: number;
  maxResults: number;
  minScore: number;
}

/**
 * Default ranking configuration
 */
export const DEFAULT_RANKING_CONFIG: RankingConfig = {
  weights: {
    exactMatch: 100,
    prefixMatch: 80,
    substringMatch: 60,
    fuzzyMatch: 40,
    transferStation: 20,
    popularity: 15,
    lineCount: 10,
    lengthPenalty: -5,
    positionBonus: 5
  },
  fuzzyThreshold: 0.7,
  maxResults: 20,
  minScore: 5
};

/**
 * Station popularity data (could be loaded from analytics)
 */
const STATION_POPULARITY: Record<string, number> = {
  'Baquedano': 10,
  'Los Héroes': 9,
  'Plaza de Armas': 9,
  'Universidad de Chile': 8,
  'Santa Ana': 8,
  'La Moneda': 7,
  'Tobalaba': 7,
  'Puente Cal y Canto': 6,
  'San Pablo': 6,
  'Franklin': 5,
  // Add more stations based on actual usage data
};

/**
 * Advanced search ranking engine
 */
export class SearchRanking {
  private config: RankingConfig;
  
  constructor(config: Partial<RankingConfig> = {}) {
    this.config = { ...DEFAULT_RANKING_CONFIG, ...config };
  }
  
  /**
   * Rank stations based on search query
   */
  rankStations(stations: Station[], query: string): RankedSearchResult[] {
    if (!query.trim()) {
      return [];
    }
    
    const normalizedQuery = normalizeText(query);
    const results: RankedSearchResult[] = [];
    
    for (const station of stations) {
      const result = this.scoreStation(station, query, normalizedQuery);
      if (result && result.score >= this.config.minScore) {
        results.push(result);
      }
    }
    
    // Sort by score (descending) and take top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxResults);
  }
  
  /**
   * Score a single station against the query
   */
  private scoreStation(
    station: Station, 
    originalQuery: string, 
    normalizedQuery: string
  ): RankedSearchResult | null {
    const normalizedStationName = normalizeText(station.name);
    const breakdown: ScoreBreakdown = {
      exactMatch: 0,
      prefixMatch: 0,
      substringMatch: 0,
      fuzzyMatch: 0,
      transferStation: 0,
      popularity: 0,
      lineCount: 0,
      lengthPenalty: 0,
      positionBonus: 0,
      total: 0
    };
    
    let matchType: ValidMatchType = 'fuzzy'; // Default to fuzzy instead of 'none'
    let hasMatch = false;
    const highlightRanges: HighlightRange[] = [];
    
    // 1. Exact match scoring
    if (normalizedStationName === normalizedQuery) {
      breakdown.exactMatch = this.config.weights.exactMatch;
      matchType = 'exact';
      hasMatch = true;
      highlightRanges.push({
        start: 0,
        end: station.name.length,
        type: 'exact',
        confidence: 1.0
      });
    }
    // 2. Prefix match scoring
    else if (startsWithIgnoreCase(station.name, originalQuery)) {
      breakdown.prefixMatch = this.config.weights.prefixMatch;
      matchType = 'prefix';
      hasMatch = true;
      highlightRanges.push({
        start: 0,
        end: originalQuery.length,
        type: 'prefix',
        confidence: 0.9
      });
    }
    // 3. Substring match scoring
    else if (containsIgnoreCase(station.name, originalQuery)) {
      breakdown.substringMatch = this.config.weights.substringMatch;
      matchType = 'substring';
      hasMatch = true;
      
      const startIndex = normalizedStationName.indexOf(normalizedQuery);
      if (startIndex !== -1) {
        highlightRanges.push({
          start: startIndex,
          end: startIndex + normalizedQuery.length,
          type: 'substring',
          confidence: 0.8
        });
      }
    }
    // 4. Fuzzy match scoring
    else {
      const similarity = similarityRatio(normalizedStationName, normalizedQuery);
      if (similarity >= this.config.fuzzyThreshold) {
        breakdown.fuzzyMatch = this.config.weights.fuzzyMatch * similarity;
        matchType = 'fuzzy';
        hasMatch = true;
        highlightRanges.push({
          start: 0,
          end: station.name.length,
          type: 'fuzzy',
          confidence: similarity
        });
      }
    }
    
    // If no strong match found, try token-based matching
    if (!hasMatch) {
      const tokenMatch = this.scoreTokenMatch(station, originalQuery, normalizedQuery);
      if (tokenMatch.score > 0) {
        breakdown.substringMatch = tokenMatch.score;
        matchType = 'token';
        hasMatch = true;
        highlightRanges.push(...tokenMatch.highlights);
      }
    }
    
    // Skip if no meaningful match
    if (!hasMatch) {
      return null;
    }
    
    // 5. Transfer station bonus
    if (station.isTransfer) {
      breakdown.transferStation = this.config.weights.transferStation;
    }
    
    // 6. Popularity bonus
    const popularity = STATION_POPULARITY[station.name] || 0;
    breakdown.popularity = this.config.weights.popularity * (popularity / 10);
    
    // 7. Line count bonus (more lines = more important)
    const lineCount = station.transferLines?.length || 1;
    breakdown.lineCount = this.config.weights.lineCount * Math.log(lineCount);
    
    // 8. Length penalty (shorter names are often more relevant)
    const lengthDiff = Math.max(0, station.name.length - normalizedQuery.length);
    breakdown.lengthPenalty = this.config.weights.lengthPenalty * (lengthDiff / 10);
    
    // 9. Position bonus (earlier matches in alphabet might be more common)
    const alphabetPosition = normalizedStationName.charCodeAt(0) - 97; // a=0, z=25
    breakdown.positionBonus = this.config.weights.positionBonus * (1 - alphabetPosition / 26);
    
    // Calculate total score
    breakdown.total = 
      breakdown.exactMatch +
      breakdown.prefixMatch +
      breakdown.substringMatch +
      breakdown.fuzzyMatch +
      breakdown.transferStation +
      breakdown.popularity +
      breakdown.lineCount +
      breakdown.lengthPenalty +
      breakdown.positionBonus;
    
    return {
      station,
      score: breakdown.total,
      breakdown,
      matchType,
      highlightRanges
    };
  }
  
  /**
   * Score token-based matches (individual words)
   */
  private scoreTokenMatch(
    station: Station, 
    originalQuery: string, 
    normalizedQuery: string
  ): { score: number; highlights: HighlightRange[] } {
    const stationWords = normalizeText(station.name).split(/\s+/);
    const queryWords = normalizedQuery.split(/\s+/);
    const highlights: HighlightRange[] = [];
    let totalScore = 0;
    
    for (const queryWord of queryWords) {
      let bestWordScore = 0;
      let bestWordIndex = -1;
      
      for (let i = 0; i < stationWords.length; i++) {
        const stationWord = stationWords[i];
        let wordScore = 0;
        
        if (stationWord === queryWord) {
          wordScore = 30; // Exact word match
        } else if (stationWord.startsWith(queryWord)) {
          wordScore = 20; // Word prefix match
        } else if (stationWord.includes(queryWord)) {
          wordScore = 15; // Word substring match
        } else {
          const similarity = similarityRatio(stationWord, queryWord);
          if (similarity >= this.config.fuzzyThreshold) {
            wordScore = 10 * similarity; // Fuzzy word match
          }
        }
        
        if (wordScore > bestWordScore) {
          bestWordScore = wordScore;
          bestWordIndex = i;
        }
      }
      
      if (bestWordScore > 0) {
        totalScore += bestWordScore;
        
        // Find position in original text for highlighting
        const originalWords = station.name.split(/\s+/);
        if (bestWordIndex < originalWords.length) {
          let start = 0;
          for (let i = 0; i < bestWordIndex; i++) {
            start += originalWords[i].length + 1; // +1 for space
          }
          
          highlights.push({
            start,
            end: start + originalWords[bestWordIndex].length,
            type: 'token',
            confidence: bestWordScore / 30
          });
        }
      }
    }
    
    return { score: totalScore, highlights };
  }
  
  /**
   * Update ranking configuration
   */
  updateConfig(config: Partial<RankingConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Get current configuration
   */
  getConfig(): RankingConfig {
    return { ...this.config };
  }
  
  /**
   * Add or update station popularity scores
   */
  updatePopularity(stationPopularity: Record<string, number>): void {
    Object.assign(STATION_POPULARITY, stationPopularity);
  }
  
  /**
   * Get popularity score for a station
   */
  getPopularity(stationName: string): number {
    return STATION_POPULARITY[stationName] || 0;
  }
}

/**
 * Utility function for quick ranking without creating a class instance
 */
export function quickRankStations(
  stations: Station[], 
  query: string, 
  config: Partial<RankingConfig> = {}
): RankedSearchResult[] {
  const ranker = new SearchRanking(config);
  return ranker.rankStations(stations, query);
}