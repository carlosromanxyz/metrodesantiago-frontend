/**
 * Metro State Persistence Utilities
 * 
 * Handles localStorage persistence for Metro state with error handling,
 * data validation, and versioning support.
 */

import { z } from 'zod';
import type { MetroState } from '@/types/metro-context';
import { PERSISTENCE_CONFIG } from '@/types/metro-context';
import { STORAGE_KEYS } from '@/lib/constants';

/**
 * Storage version schema for data migration
 */
const StorageVersionSchema = z.object({
  version: z.string(),
  timestamp: z.string(),
});

/**
 * Persistable fields schema for validation
 */
const PersistableStateSchema = z.object({
  favorites: z.array(z.object({
    id: z.string(),
    station: z.object({
      id: z.string(),
      name: z.string(),
      line: z.string(),
      lineNumber: z.number(),
      lineColor: z.string(),
      isTransfer: z.boolean().optional(),
      transferLines: z.array(z.number()).optional(),
    }),
    addedAt: z.string(),
    nickname: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })).optional(),
  
  searchHistory: z.array(z.object({
    id: z.string(),
    query: z.string(),
    timestamp: z.string(),
    resultCount: z.number(),
    executionTime: z.number().optional(),
  })).optional(),
  
  savedTrips: z.array(z.object({
    fromStation: z.string(),
    toStation: z.string(),
    departureTime: z.string().optional(),
    arrivalTime: z.string().optional(),
  })).optional(),
  
  preferences: z.object({
    defaultTransportMode: z.enum(['metro', 'bus', 'mixed']).optional(),
    preferredTransferStations: z.array(z.string()).optional(),
    accessibilityNeeds: z.array(z.string()).optional(),
    notificationSettings: z.object({
      serviceDisruptions: z.boolean().optional(),
      routeUpdates: z.boolean().optional(),
      favoriteStationAlerts: z.boolean().optional(),
    }).optional(),
    searchSettings: z.object({
      maxResults: z.number().optional(),
      enableFuzzySearch: z.boolean().optional(),
      enableSuggestions: z.boolean().optional(),
      rememberSearches: z.boolean().optional(),
    }).optional(),
  }).optional(),
  
  selectedStation: z.object({
    id: z.string(),
    name: z.string(),
    line: z.string(),
    lineNumber: z.number(),
    lineColor: z.string(),
    isTransfer: z.boolean().optional(),
    transferLines: z.array(z.number()).optional(),
  }).nullable().optional(),
  
  selectedLine: z.number().nullable().optional(),
});

type PersistableState = z.infer<typeof PersistableStateSchema>;

/**
 * Error types for persistence operations
 */
export class PersistenceError extends Error {
  constructor(
    message: string,
    public readonly operation: 'load' | 'save' | 'clear',
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'PersistenceError';
  }
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely parse JSON with error handling
 */
function safeParseJSON<T = unknown>(json: string): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Safely stringify JSON with error handling
 */
function safeStringifyJSON(data: unknown): string | null {
  try {
    return JSON.stringify(data);
  } catch {
    return null;
  }
}

/**
 * Extract persistable fields from Metro state
 */
function extractPersistableState(state: MetroState): PersistableState {
  return {
    favorites: state.favorites.map(fav => ({
      ...fav,
      addedAt: fav.addedAt.toISOString(),
    })),
    searchHistory: state.searchHistory.map(item => ({
      ...item,
      timestamp: item.timestamp.toISOString(),
    })),
    savedTrips: state.savedTrips.map(trip => ({
      ...trip,
      departureTime: trip.departureTime?.toISOString(),
      arrivalTime: trip.arrivalTime?.toISOString(),
    })),
    preferences: state.preferences,
    selectedStation: state.selectedStation,
    selectedLine: state.selectedLine,
  };
}

/**
 * Transform persistable state back to Metro state format
 */
function transformPersistableState(persistable: PersistableState): Partial<MetroState> {
  const transformed: Partial<MetroState> = {};
  
  if (persistable.favorites) {
    transformed.favorites = persistable.favorites.map(fav => ({
      ...fav,
      addedAt: new Date(fav.addedAt),
    }));
  }
  
  if (persistable.searchHistory) {
    transformed.searchHistory = persistable.searchHistory.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  }
  
  if (persistable.savedTrips) {
    transformed.savedTrips = persistable.savedTrips.map(trip => ({
      ...trip,
      departureTime: trip.departureTime ? new Date(trip.departureTime) : undefined,
      arrivalTime: trip.arrivalTime ? new Date(trip.arrivalTime) : undefined,
    }));
  }
  
  if (persistable.preferences) {
    transformed.preferences = persistable.preferences as MetroState['preferences'];
  }
  
  if (persistable.selectedStation !== undefined) {
    transformed.selectedStation = persistable.selectedStation;
  }
  
  if (persistable.selectedLine !== undefined) {
    transformed.selectedLine = persistable.selectedLine;
  }
  
  return transformed;
}

/**
 * Save Metro state to localStorage
 */
export async function saveMetroState(
  state: MetroState,
  key: string = PERSISTENCE_CONFIG.DEFAULT_KEY
): Promise<void> {
  if (!isLocalStorageAvailable()) {
    throw new PersistenceError(
      'localStorage is not available',
      'save'
    );
  }
  
  try {
    // Extract only persistable fields
    const persistableState = extractPersistableState(state);
    
    // Create storage object with version and timestamp
    const storageData = {
      version: PERSISTENCE_CONFIG.VERSION,
      timestamp: new Date().toISOString(),
      data: persistableState,
    };
    
    // Stringify and save
    const serialized = safeStringifyJSON(storageData);
    if (!serialized) {
      throw new PersistenceError('Failed to serialize state', 'save');
    }
    
    localStorage.setItem(key, serialized);
    
    // Also save version info separately for quick access
    const versionData = {
      version: PERSISTENCE_CONFIG.VERSION,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`${key}_version`, JSON.stringify(versionData));
    
  } catch (error) {
    if (error instanceof PersistenceError) {
      throw error;
    }
    
    throw new PersistenceError(
      `Failed to save Metro state: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'save',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Load Metro state from localStorage
 */
export async function loadMetroState(
  key: string = PERSISTENCE_CONFIG.DEFAULT_KEY
): Promise<Partial<MetroState> | null> {
  if (!isLocalStorageAvailable()) {
    throw new PersistenceError(
      'localStorage is not available',
      'load'
    );
  }
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null; // No stored state
    }
    
    // Parse stored data
    const storageData = safeParseJSON(stored);
    if (!storageData || typeof storageData !== 'object') {
      throw new PersistenceError('Invalid stored data format', 'load');
    }
    
    // Check version compatibility
    if (storageData.version !== PERSISTENCE_CONFIG.VERSION) {
      // Handle version migration here if needed
      console.warn(
        `Metro state version mismatch. Expected: ${PERSISTENCE_CONFIG.VERSION}, Found: ${storageData.version}`
      );
      
      // For now, clear incompatible data
      await clearMetroState(key);
      return null;
    }
    
    // Validate data structure
    const validatedData = PersistableStateSchema.safeParse(storageData.data);
    if (!validatedData.success) {
      throw new PersistenceError(
        `Invalid data structure: ${validatedData.error.message}`,
        'load'
      );
    }
    
    // Transform and return
    return transformPersistableState(validatedData.data);
    
  } catch (error) {
    if (error instanceof PersistenceError) {
      throw error;
    }
    
    throw new PersistenceError(
      `Failed to load Metro state: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'load',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Clear Metro state from localStorage
 */
export async function clearMetroState(
  key: string = PERSISTENCE_CONFIG.DEFAULT_KEY
): Promise<void> {
  if (!isLocalStorageAvailable()) {
    throw new PersistenceError(
      'localStorage is not available',
      'clear'
    );
  }
  
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_version`);
  } catch (error) {
    throw new PersistenceError(
      `Failed to clear Metro state: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'clear',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Check if stored state exists
 */
export function hasStoredMetroState(
  key: string = PERSISTENCE_CONFIG.DEFAULT_KEY
): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Get storage info (version, timestamp, size)
 */
export function getStorageInfo(
  key: string = PERSISTENCE_CONFIG.DEFAULT_KEY
): {
  exists: boolean;
  version?: string;
  timestamp?: Date;
  size?: number;
} | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return { exists: false };
    }
    
    const versionStored = localStorage.getItem(`${key}_version`);
    let versionInfo = null;
    
    if (versionStored) {
      const parsed = safeParseJSON<{ version: string; timestamp: string }>(versionStored);
      if (parsed && StorageVersionSchema.safeParse(parsed).success) {
        versionInfo = parsed;
      }
    }
    
    return {
      exists: true,
      version: versionInfo?.version,
      timestamp: versionInfo?.timestamp ? new Date(versionInfo.timestamp) : undefined,
      size: stored.length,
    };
    
  } catch {
    return { exists: false };
  }
}

/**
 * Utility to safely perform persistence operations with error logging
 */
export function withPersistenceErrorHandling<T>(
  operation: () => Promise<T>,
  onError?: (error: PersistenceError) => void
): Promise<T | null> {
  return operation().catch((error) => {
    const persistenceError = error instanceof PersistenceError 
      ? error 
      : new PersistenceError('Unexpected persistence error', 'save', error);
    
    if (onError) {
      onError(persistenceError);
    } else if (process.env.NODE_ENV === 'development') {
      console.error('Metro persistence error:', persistenceError);
    }
    
    return null;
  });
}

/**
 * Debounced save function to prevent excessive localStorage writes
 */
export function createDebouncedSave(
  delay: number = 1000
): (state: MetroState, key?: string) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (state: MetroState, key?: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      withPersistenceErrorHandling(
        () => saveMetroState(state, key)
      );
    }, delay);
  };
}

/**
 * Migration utilities for future version updates
 */
export const migrations = {
  // Placeholder for future migrations
  '1.0.0': (data: unknown) => data, // No migration needed for initial version
  
  // Example future migration:
  // '1.1.0': (data: unknown) => {
  //   // Transform data from 1.0.0 to 1.1.0 format
  //   return data;
  // },
};

/**
 * Apply data migrations if needed
 */
export function migrateStoredData(
  data: unknown,
  fromVersion: string,
  toVersion: string
): unknown {
  if (fromVersion === toVersion) {
    return data;
  }
  
  // Apply migrations in sequence
  // This would be implemented when we have actual migrations
  console.log(`Migrating Metro state from ${fromVersion} to ${toVersion}`);
  
  return data;
}