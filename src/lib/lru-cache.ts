/**
 * LRU (Least Recently Used) Cache implementation for search result caching
 * Provides O(1) get and set operations
 */

/**
 * Node in the doubly linked list used by LRU cache
 */
class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;
  
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * LRU Cache with configurable capacity and TTL (Time To Live)
 */
export class LRUCache<K, V> {
  private capacity: number;
  private ttl: number; // Time to live in milliseconds
  private cache: Map<K, LRUNode<K, V>> = new Map();
  private timestamps: Map<K, number> = new Map();
  private head: LRUNode<K, V>;
  private tail: LRUNode<K, V>;
  
  constructor(capacity: number = 100, ttl: number = 5 * 60 * 1000) { // Default 5 minutes TTL
    this.capacity = capacity;
    this.ttl = ttl;
    
    // Create dummy head and tail nodes
    this.head = new LRUNode(null as any, null as any);
    this.tail = new LRUNode(null as any, null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  /**
   * Get value from cache
   * Returns undefined if key doesn't exist or has expired
   */
  get(key: K): V | undefined {
    const node = this.cache.get(key);
    
    if (!node) {
      return undefined;
    }
    
    // Check if the entry has expired
    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() - timestamp > this.ttl) {
      this.delete(key);
      return undefined;
    }
    
    // Move to head (mark as recently used)
    this.moveToHead(node);
    this.timestamps.set(key, Date.now());
    
    return node.value;
  }
  
  /**
   * Set value in cache
   * If cache is at capacity, removes least recently used item
   */
  set(key: K, value: V): void {
    const existingNode = this.cache.get(key);
    
    if (existingNode) {
      // Update existing node
      existingNode.value = value;
      this.moveToHead(existingNode);
      this.timestamps.set(key, Date.now());
      return;
    }
    
    // Create new node
    const newNode = new LRUNode(key, value);
    
    // Check capacity
    if (this.cache.size >= this.capacity) {
      // Remove least recently used (tail)
      const tail = this.removeTail();
      if (tail) {
        this.cache.delete(tail.key);
        this.timestamps.delete(tail.key);
      }
    }
    
    // Add new node
    this.cache.set(key, newNode);
    this.timestamps.set(key, Date.now());
    this.addToHead(newNode);
  }
  
  /**
   * Check if key exists in cache (and is not expired)
   */
  has(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;
    
    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() - timestamp > this.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete key from cache
   */
  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;
    
    this.cache.delete(key);
    this.timestamps.delete(key);
    this.removeNode(node);
    
    return true;
  }
  
  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    capacity: number;
    hitRate: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const timestamps = Array.from(this.timestamps.values());
    const now = Date.now();
    
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: 0, // Would need to track hits/misses to calculate
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null
    };
  }
  
  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now();
    const expiredKeys: K[] = [];
    
    for (const [key, timestamp] of this.timestamps) {
      if (now - timestamp > this.ttl) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      this.delete(key);
    }
    
    return expiredKeys.length;
  }
  
  /**
   * Get all keys in order of most recent to least recent
   */
  keys(): K[] {
    const keys: K[] = [];
    let current = this.head.next;
    
    while (current && current !== this.tail) {
      keys.push(current.key);
      current = current.next;
    }
    
    return keys;
  }
  
  /**
   * Get all values in order of most recent to least recent
   */
  values(): V[] {
    const values: V[] = [];
    let current = this.head.next;
    
    while (current && current !== this.tail) {
      values.push(current.value);
      current = current.next;
    }
    
    return values;
  }
  
  /**
   * Move node to head of linked list
   */
  private moveToHead(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToHead(node);
  }
  
  /**
   * Remove node from linked list
   */
  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }
  
  /**
   * Add node to head of linked list
   */
  private addToHead(node: LRUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    
    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }
  
  /**
   * Remove and return tail node
   */
  private removeTail(): LRUNode<K, V> | null {
    const lastNode = this.tail.prev;
    if (!lastNode || lastNode === this.head) {
      return null;
    }
    
    this.removeNode(lastNode);
    return lastNode;
  }
}

/**
 * Search result cache specifically for station search
 */
export class SearchCache {
  private cache: LRUCache<string, any>;
  private hitCount: number = 0;
  private missCount: number = 0;
  
  constructor(capacity: number = 100, ttl: number = 5 * 60 * 1000) {
    this.cache = new LRUCache(capacity, ttl);
  }
  
  /**
   * Get cached search results
   */
  get(query: string): any | undefined {
    const cacheKey = this.normalizeQuery(query);
    const result = this.cache.get(cacheKey);
    
    if (result !== undefined) {
      this.hitCount++;
      return result;
    }
    
    this.missCount++;
    return undefined;
  }
  
  /**
   * Cache search results
   */
  set(query: string, results: any): void {
    const cacheKey = this.normalizeQuery(query);
    this.cache.set(cacheKey, results);
  }
  
  /**
   * Check if query results are cached
   */
  has(query: string): boolean {
    const cacheKey = this.normalizeQuery(query);
    return this.cache.has(cacheKey);
  }
  
  /**
   * Clear all cached results
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }
  
  /**
   * Get cache statistics including hit rate
   */
  getStats() {
    const baseStats = this.cache.getStats();
    const totalRequests = this.hitCount + this.missCount;
    
    return {
      ...baseStats,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: totalRequests > 0 ? this.hitCount / totalRequests : 0,
    };
  }
  
  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    return this.cache.cleanExpired();
  }
  
  /**
   * Normalize query for consistent caching
   */
  private normalizeQuery(query: string): string {
    return query.toLowerCase().trim();
  }
}