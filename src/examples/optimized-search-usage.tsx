/**
 * Usage examples for the optimized station search system
 * This file demonstrates how to use the new search functionality
 */

import React, { useState } from 'react';
import { 
  useStationSearch, 
  useSimpleStationSearch, 
  useStationSearchWithSuggestions 
} from '@/hooks/use-station-search';
import { 
  searchStationsAdvanced, 
  getSearchSuggestions,
  getSearchStats,
  clearSearchCache
} from '@/lib/optimized-station-search';
import type { SearchOptions, OptimizedSearchResult } from '@/types/search';

/**
 * Example 1: Basic optimized search (backward compatible)
 */
export function BasicSearchExample() {
  const { 
    query, 
    stations, 
    isLoading, 
    setQuery 
  } = useSimpleStationSearch('', 300);

  return (
    <div>
      <h3>Basic Search Example</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stations..."
        className="border p-2 rounded"
      />
      
      {isLoading && <p>Searching...</p>}
      
      <ul>
        {stations.map((station) => (
          <li key={station.id}>
            {station.name} - Line {station.lineNumber}
            {station.isTransfer && <span> (Transfer)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 2: Advanced search with full features
 */
export function AdvancedSearchExample() {
  const searchOptions: Partial<SearchOptions> = {
    maxResults: 15,
    enableFuzzy: true,
    enableCache: true,
    fuzzyThreshold: 0.8,
    sortByRelevance: true,
    highlightMatches: true
  };

  const {
    query,
    results,
    suggestions,
    isLoading,
    isDebouncing,
    error,
    metrics,
    setQuery,
    clear,
    clearCache,
    retry
  } = useStationSearch('', searchOptions);

  return (
    <div>
      <h3>Advanced Search Example</h3>
      
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stations with fuzzy matching..."
          className="border p-2 rounded w-full"
        />
        
        <div className="flex gap-2 mt-2">
          <button onClick={clear} className="px-3 py-1 bg-gray-200 rounded">
            Clear
          </button>
          <button onClick={clearCache} className="px-3 py-1 bg-blue-200 rounded">
            Clear Cache
          </button>
          {error && (
            <button onClick={retry} className="px-3 py-1 bg-red-200 rounded">
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="mb-2">
        {isLoading && <span className="text-blue-600">🔍 Searching...</span>}
        {isDebouncing && <span className="text-yellow-600">⏱️ Debouncing...</span>}
        {error && <span className="text-red-600">❌ {error.message}</span>}
      </div>

      {/* Search metrics */}
      {metrics && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
          <p>Search time: {metrics.searchTime.toFixed(2)}ms</p>
          <p>Results: {metrics.resultsFound}/{metrics.totalStations}</p>
          <p>Cache hit: {metrics.cacheHit ? 'Yes' : 'No'}</p>
          <p>Algorithm: {metrics.algorithmUsed}</p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold">Suggestions:</h4>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="px-2 py-1 bg-blue-100 rounded text-sm hover:bg-blue-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <h4 className="font-semibold">Results ({results.length}):</h4>
        <ul className="space-y-2">
          {results.map((result) => (
            <li key={result.station.id} className="border p-2 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{result.station.name}</h5>
                  <p className="text-sm text-gray-600">
                    Line {result.station.lineNumber} ({result.station.lineColor})
                    {result.station.isTransfer && ' • Transfer Station'}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>Score: {result.score.toFixed(1)}</p>
                  <p>Match: {result.matchType}</p>
                  {result.highlights && (
                    <p>Highlights: {result.highlights.length}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Example 3: Search with suggestions
 */
export function SearchWithSuggestionsExample() {
  const {
    query,
    stations,
    suggestions,
    selectedSuggestion,
    isLoading,
    setQuery,
    selectSuggestion,
    clearSuggestion
  } = useStationSearchWithSuggestions('');

  return (
    <div>
      <h3>Search with Suggestions Example</h3>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to see suggestions..."
        className="border p-2 rounded w-full mb-2"
      />

      {suggestions.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {selectedSuggestion && (
        <div className="mb-2 p-2 bg-green-100 rounded">
          Selected: {selectedSuggestion}
          <button 
            onClick={clearSuggestion}
            className="ml-2 text-sm text-red-600 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      <ul>
        {stations.map((station) => (
          <li key={station.id}>
            {station.name} - Line {station.lineNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 4: Programmatic search usage
 */
export function ProgrammaticSearchExample() {
  const [searchResults, setSearchResults] = useState<OptimizedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState<{
    executionTime: number;
    resultsCount: number;
    algorithm: string;
  } | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Advanced search with custom options
      const { results, metrics } = await searchStationsAdvanced(query, {
        maxResults: 20,
        enableFuzzy: true,
        fuzzyThreshold: 0.6,
        sortByRelevance: true,
        highlightMatches: true
      });

      setSearchResults(results);
      console.log('Search metrics:', metrics);

      // Get suggestions
      const suggestions = getSearchSuggestions(query, 3);
      console.log('Suggestions:', suggestions);

      // Get engine stats
      const stats = getSearchStats();
      setSearchStats(stats);

    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearCache = () => {
    clearSearchCache();
    alert('Search cache cleared');
  };

  return (
    <div>
      <h3>Programmatic Search Example</h3>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter search query"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              performSearch((e.target as HTMLInputElement).value);
            }
          }}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={() => {
            const input = document.querySelector('input') as HTMLInputElement;
            performSearch(input.value);
          }}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        <button
          onClick={handleClearCache}
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Cache
        </button>
      </div>

      {/* Search engine statistics */}
      {searchStats && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">Search Engine Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>Trie nodes: {searchStats.trie.nodes}</p>
              <p>Trie words: {searchStats.trie.words}</p>
              <p>Max depth: {searchStats.trie.maxDepth}</p>
            </div>
            <div>
              <p>Cache size: {searchStats.cache.size}</p>
              <p>Cache hit rate: {(searchStats.cache.hitRate * 100).toFixed(1)}%</p>
              <p>Fuzzy index size: {searchStats.fuzzy.size}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <h4 className="font-semibold">Results ({searchResults.length}):</h4>
        {searchResults.map((result) => (
          <div key={result.station.id} className="border p-3 rounded mb-2">
            <h5 className="font-medium">{result.station.name}</h5>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Line {result.station.lineNumber}</span>
              <span>Score: {result.score.toFixed(2)} | Type: {result.matchType}</span>
            </div>
            {result.highlights && result.highlights.length > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Highlights: {result.highlights.map(h => `${h.start}-${h.end}`).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main component showcasing all examples
 */
export function OptimizedSearchExamples() {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    { name: 'Basic Search', component: BasicSearchExample },
    { name: 'Advanced Search', component: AdvancedSearchExample },
    { name: 'With Suggestions', component: SearchWithSuggestionsExample },
    { name: 'Programmatic', component: ProgrammaticSearchExample }
  ];

  const ActiveComponent = examples[activeExample].component;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Optimized Station Search Examples</h1>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveExample(index)}
              className={`px-4 py-2 rounded ${
                activeExample === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {example.name}
            </button>
          ))}
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <ActiveComponent />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Performance Improvements:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>🚀 <strong>O(log n)</strong> search complexity with Trie data structure</li>
          <li>🧠 <strong>Smart caching</strong> with LRU eviction for frequent searches</li>
          <li>🔍 <strong>Fuzzy matching</strong> tolerates typos and misspellings</li>
          <li>📊 <strong>Relevance ranking</strong> shows most relevant results first</li>
          <li>🌍 <strong>Text normalization</strong> handles accents and case sensitivity</li>
          <li>⏱️ <strong>Debounced input</strong> reduces unnecessary API calls</li>
          <li>📈 <strong>Performance metrics</strong> for monitoring and optimization</li>
        </ul>
      </div>
    </div>
  );
}

export default OptimizedSearchExamples;