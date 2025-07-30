/**
 * Text normalization and processing utilities for station search optimization
 */

/**
 * Normalizes text by removing accents, converting to lowercase, and trimming whitespace
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose characters with accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .trim();
}

/**
 * Creates search tokens from text (splits by spaces and common separators)
 */
export function tokenizeText(text: string): string[] {
  return normalizeText(text)
    .split(/[\s\-_\.]+/)
    .filter(token => token.length > 0);
}

/**
 * Calculates Levenshtein distance between two strings (for fuzzy matching)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculates similarity ratio between two strings (0-1, where 1 is identical)
 */
export function similarityRatio(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return (maxLen - distance) / maxLen;
}

/**
 * Checks if two strings are similar within a threshold (fuzzy match)
 */
export function isFuzzyMatch(str1: string, str2: string, threshold: number = 0.8): boolean {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Fuzzy similarity check
  return similarityRatio(normalized1, normalized2) >= threshold;
}

/**
 * Checks if text starts with query (case and accent insensitive)
 */
export function startsWithIgnoreCase(text: string, query: string): boolean {
  return normalizeText(text).startsWith(normalizeText(query));
}

/**
 * Checks if text contains query (case and accent insensitive)
 */
export function containsIgnoreCase(text: string, query: string): boolean {
  return normalizeText(text).includes(normalizeText(query));
}

/**
 * Calculates relevance score for search results
 * Higher scores indicate better matches
 */
export function calculateRelevanceScore(
  text: string, 
  query: string, 
  exactMatchBonus: number = 10,
  startsWithBonus: number = 5,
  containsBonus: number = 2
): number {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  
  let score = 0;
  
  // Exact match gets highest score
  if (normalizedText === normalizedQuery) {
    score += exactMatchBonus;
  }
  // Starts with query gets bonus
  else if (normalizedText.startsWith(normalizedQuery)) {
    score += startsWithBonus;
  }
  // Contains query gets smaller bonus
  else if (normalizedText.includes(normalizedQuery)) {
    score += containsBonus;
  }
  
  // Additional scoring based on similarity ratio
  const similarity = similarityRatio(normalizedText, normalizedQuery);
  score += similarity * 3; // Scale similarity to 0-3 points
  
  // Shorter matches are generally more relevant
  const lengthPenalty = Math.max(0, (normalizedText.length - normalizedQuery.length) / 20);
  score -= lengthPenalty;
  
  return Math.max(0, score);
}