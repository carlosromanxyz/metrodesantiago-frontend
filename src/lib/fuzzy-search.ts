/**
 * Advanced fuzzy matching system for station search
 * Handles typos, transpositions, and partial matches
 */

import { 
  normalizeText, 
  tokenizeText, 
  levenshteinDistance, 
  similarityRatio,
  calculateRelevanceScore 
} from './text-utils';

/**
 * Fuzzy search configuration
 */
export interface FuzzySearchOptions {
  threshold: number;           // Minimum similarity ratio (0-1)
  maxDistance: number;         // Maximum Levenshtein distance
  caseSensitive: boolean;      // Case sensitivity
  ignoreAccents: boolean;      // Whether to ignore accents
  matchPartialWords: boolean;  // Allow partial word matching
  transposeBonus: number;      // Bonus for transposition matches
  prefixBonus: number;         // Bonus for prefix matches
  substringBonus: number;      // Bonus for substring matches
}

/**
 * Default fuzzy search options
 */
export const DEFAULT_FUZZY_OPTIONS: FuzzySearchOptions = {
  threshold: 0.6,
  maxDistance: 3,
  caseSensitive: false,
  ignoreAccents: true,
  matchPartialWords: true,
  transposeBonus: 0.2,
  prefixBonus: 0.3,
  substringBonus: 0.1
};

/**
 * Result of fuzzy matching with score
 */
export interface FuzzyMatch<T> {
  item: T;
  score: number;
  distance: number;
  similarity: number;
  matches: MatchInfo[];
}

/**
 * Information about where the match occurred
 */
export interface MatchInfo {
  start: number;
  end: number;
  type: 'exact' | 'prefix' | 'substring' | 'fuzzy' | 'transposition';
  confidence: number;
}

/**
 * Advanced fuzzy search engine
 */
export class FuzzySearch<T> {
  private options: FuzzySearchOptions;
  private items: Array<{ item: T; searchText: string; tokens: string[] }> = [];
  
  constructor(options: Partial<FuzzySearchOptions> = {}) {
    this.options = { ...DEFAULT_FUZZY_OPTIONS, ...options };
  }
  
  /**
   * Add items to search index
   */
  addItems(items: T[], getSearchText: (item: T) => string): void {
    this.items = items.map(item => ({
      item,
      searchText: this.normalizeSearchText(getSearchText(item)),
      tokens: tokenizeText(getSearchText(item))
    }));
  }
  
  /**
   * Search for items matching the query
   */
  search(query: string, limit: number = 10): FuzzyMatch<T>[] {
    if (!query.trim()) {
      return [];
    }
    
    const normalizedQuery = this.normalizeSearchText(query);
    const queryTokens = tokenizeText(query);
    const matches: FuzzyMatch<T>[] = [];
    
    for (const { item, searchText, tokens } of this.items) {
      const match = this.matchItem(normalizedQuery, queryTokens, searchText, tokens, item);
      if (match && match.score > 0) {
        matches.push(match);
      }
    }
    
    // Sort by score (descending) and take top results
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  /**
   * Match a single item against the query
   */
  private matchItem(
    query: string, 
    queryTokens: string[], 
    searchText: string, 
    textTokens: string[], 
    item: T
  ): FuzzyMatch<T> | null {
    const matches: MatchInfo[] = [];
    let totalScore = 0;
    let bestDistance = Infinity;
    let bestSimilarity = 0;
    
    // 1. Try exact match
    if (searchText === query) {
      matches.push({
        start: 0,
        end: searchText.length,
        type: 'exact',
        confidence: 1.0
      });
      totalScore += 10;
      bestDistance = 0;
      bestSimilarity = 1.0;
    }
    // 2. Try prefix match
    else if (searchText.startsWith(query)) {
      matches.push({
        start: 0,
        end: query.length,
        type: 'prefix',
        confidence: 0.9
      });
      totalScore += 8 + this.options.prefixBonus;
      bestDistance = searchText.length - query.length;
      bestSimilarity = query.length / searchText.length;
    }
    // 3. Try substring match
    else if (searchText.includes(query)) {
      const startIndex = searchText.indexOf(query);
      matches.push({
        start: startIndex,
        end: startIndex + query.length,
        type: 'substring',
        confidence: 0.7
      });
      totalScore += 5 + this.options.substringBonus;
      bestDistance = searchText.length - query.length;
      bestSimilarity = query.length / searchText.length;
    }
    // 4. Try fuzzy matching
    else {
      const distance = levenshteinDistance(query, searchText);
      const similarity = similarityRatio(query, searchText);
      
      if (distance <= this.options.maxDistance && similarity >= this.options.threshold) {
        matches.push({
          start: 0,
          end: searchText.length,
          type: 'fuzzy',
          confidence: similarity
        });
        totalScore += similarity * 4;
        bestDistance = distance;
        bestSimilarity = similarity;
        
        // Check for transpositions (common typo)
        if (this.isTransposition(query, searchText)) {
          totalScore += this.options.transposeBonus;
          matches[matches.length - 1].type = 'transposition';
          matches[matches.length - 1].confidence += 0.1;
        }
      }
    }
    
    // 5. Try token-based matching
    if (this.options.matchPartialWords) {
      const tokenMatches = this.matchTokens(queryTokens, textTokens);
      for (const tokenMatch of tokenMatches) {
        matches.push(tokenMatch);
        totalScore += tokenMatch.confidence * 2;
      }
    }
    
    // 6. Apply additional scoring
    totalScore += calculateRelevanceScore(searchText, query) * 0.5;
    
    // Filter out low-scoring matches
    if (totalScore < 1 && matches.length === 0) {
      return null;
    }
    
    return {
      item,
      score: totalScore,
      distance: bestDistance,
      similarity: bestSimilarity,
      matches
    };
  }
  
  /**
   * Match individual tokens
   */
  private matchTokens(queryTokens: string[], textTokens: string[]): MatchInfo[] {
    const matches: MatchInfo[] = [];
    
    for (const queryToken of queryTokens) {
      for (const textToken of textTokens) {
        // Exact token match
        if (textToken === queryToken) {
          matches.push({
            start: 0,
            end: textToken.length,
            type: 'exact',
            confidence: 1.0
          });
        }
        // Prefix token match
        else if (textToken.startsWith(queryToken)) {
          matches.push({
            start: 0,
            end: queryToken.length,
            type: 'prefix',
            confidence: 0.8
          });
        }
        // Fuzzy token match
        else {
          const similarity = similarityRatio(queryToken, textToken);
          if (similarity >= this.options.threshold) {
            matches.push({
              start: 0,
              end: textToken.length,
              type: 'fuzzy',
              confidence: similarity
            });
          }
        }
      }
    }
    
    return matches;
  }
  
  /**
   * Check if two strings are transpositions of each other
   */
  private isTransposition(str1: string, str2: string): boolean {
    if (Math.abs(str1.length - str2.length) > 1) {
      return false;
    }
    
    let differences = 0;
    const minLength = Math.min(str1.length, str2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) {
        differences++;
        if (differences > 2) return false;
        
        // Check if this is a simple transposition
        if (i < minLength - 1 && str1[i] === str2[i + 1] && str1[i + 1] === str2[i]) {
          i++; // Skip next character as it's part of the transposition
        }
      }
    }
    
    return differences <= 2;
  }
  
  /**
   * Normalize search text based on options
   */
  private normalizeSearchText(text: string): string {
    let normalized = text;
    
    if (!this.options.caseSensitive) {
      normalized = normalized.toLowerCase();
    }
    
    if (this.options.ignoreAccents) {
      normalized = normalizeText(normalized);
    }
    
    return normalized.trim();
  }
  
  /**
   * Update fuzzy search options
   */
  updateOptions(options: Partial<FuzzySearchOptions>): void {
    this.options = { ...this.options, ...options };
  }
  
  /**
   * Get current options
   */
  getOptions(): FuzzySearchOptions {
    return { ...this.options };
  }
  
  /**
   * Clear all indexed items
   */
  clear(): void {
    this.items = [];
  }
  
  /**
   * Get number of indexed items
   */
  size(): number {
    return this.items.length;
  }
}

/**
 * Utility function for quick fuzzy search without creating a class instance
 */
export function quickFuzzySearch<T>(
  items: T[],
  query: string,
  getText: (item: T) => string,
  options: Partial<FuzzySearchOptions> = {},
  limit: number = 10
): FuzzyMatch<T>[] {
  const searcher = new FuzzySearch<T>(options);
  searcher.addItems(items, getText);
  return searcher.search(query, limit);
}