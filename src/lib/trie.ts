/**
 * Trie (Prefix Tree) implementation for optimized station search
 * Provides O(m) search complexity where m is the length of the search term
 */

import { normalizeText, tokenizeText } from './text-utils';

/**
 * Node in the Trie structure
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  stationIds: Set<string> = new Set(); // Store station IDs that match this prefix
  
  constructor() {}
}

/**
 * Trie data structure for efficient prefix-based searching
 */
export class Trie {
  private root: TrieNode;
  
  constructor() {
    this.root = new TrieNode();
  }
  
  /**
   * Insert a word and associated station ID into the Trie
   */
  insert(word: string, stationId: string): void {
    const normalizedWord = normalizeText(word);
    let current = this.root;
    
    // Insert the full word
    for (const char of normalizedWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      current.stationIds.add(stationId);
    }
    
    current.isEndOfWord = true;
    
    // Also insert individual tokens for partial matching
    const tokens = tokenizeText(word);
    for (const token of tokens) {
      if (token !== normalizedWord) {
        this.insertToken(token, stationId);
      }
    }
  }
  
  /**
   * Insert a single token into the Trie
   */
  private insertToken(token: string, stationId: string): void {
    let current = this.root;
    
    for (const char of token) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
      current.stationIds.add(stationId);
    }
    
    current.isEndOfWord = true;
  }
  
  /**
   * Search for stations matching a prefix
   * Returns set of station IDs that match the prefix
   */
  search(prefix: string): Set<string> {
    const normalizedPrefix = normalizeText(prefix);
    const node = this.findNode(normalizedPrefix);
    
    if (!node) {
      return new Set();
    }
    
    return node.stationIds;
  }
  
  /**
   * Find all stations that start with the given prefix
   */
  findByPrefix(prefix: string): Set<string> {
    const normalizedPrefix = normalizeText(prefix);
    const node = this.findNode(normalizedPrefix);
    
    if (!node) {
      return new Set();
    }
    
    // Collect all station IDs from current node and its descendants
    const results = new Set<string>();
    this.collectAllStationIds(node, results);
    
    return results;
  }
  
  /**
   * Find a node for the given prefix
   */
  private findNode(prefix: string): TrieNode | null {
    let current = this.root;
    
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return null;
      }
      current = current.children.get(char)!;
    }
    
    return current;
  }
  
  /**
   * Recursively collect all station IDs from a node and its descendants
   */
  private collectAllStationIds(node: TrieNode, results: Set<string>): void {
    // Add station IDs from current node
    for (const stationId of node.stationIds) {
      results.add(stationId);
    }
    
    // Recursively collect from children
    for (const child of node.children.values()) {
      this.collectAllStationIds(child, results);
    }
  }
  
  /**
   * Check if a word exists in the Trie
   */
  contains(word: string): boolean {
    const normalizedWord = normalizeText(word);
    const node = this.findNode(normalizedWord);
    return node !== null && node.isEndOfWord;
  }
  
  /**
   * Get all possible completions for a prefix
   */
  getCompletions(prefix: string, maxResults: number = 10): string[] {
    const normalizedPrefix = normalizeText(prefix);
    const node = this.findNode(normalizedPrefix);
    
    if (!node) {
      return [];
    }
    
    const completions: string[] = [];
    this.findCompletions(node, normalizedPrefix, completions, maxResults);
    
    return completions;
  }
  
  /**
   * Recursively find completions starting from a node
   */
  private findCompletions(
    node: TrieNode, 
    currentPrefix: string, 
    completions: string[], 
    maxResults: number
  ): void {
    if (completions.length >= maxResults) {
      return;
    }
    
    if (node.isEndOfWord) {
      completions.push(currentPrefix);
    }
    
    // Sort children for consistent ordering
    const sortedChildren = Array.from(node.children.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    for (const [char, childNode] of sortedChildren) {
      if (completions.length >= maxResults) {
        break;
      }
      this.findCompletions(childNode, currentPrefix + char, completions, maxResults);
    }
  }
  
  /**
   * Clear all data from the Trie
   */
  clear(): void {
    this.root = new TrieNode();
  }
  
  /**
   * Get statistics about the Trie
   */
  getStats(): { nodes: number; words: number; maxDepth: number } {
    let nodes = 0;
    let words = 0;
    let maxDepth = 0;
    
    const traverse = (node: TrieNode, depth: number) => {
      nodes++;
      maxDepth = Math.max(maxDepth, depth);
      
      if (node.isEndOfWord) {
        words++;
      }
      
      for (const child of node.children.values()) {
        traverse(child, depth + 1);
      }
    };
    
    traverse(this.root, 0);
    
    return { nodes, words, maxDepth };
  }
}