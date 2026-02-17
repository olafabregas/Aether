// ============================================================================
// WEATHER CACHE SERVICE
// 15-minute TTL, localStorage-based, coordinate-rounded caching
// ============================================================================

import type { WeatherSnapshot, CachedWeatherEntry } from '../types/interpretation.types';

const CACHE_PREFIX = 'weather';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Generate cache key from coordinates (rounded to 1 decimal)
 */
function generateCacheKey(lat: number, lng: number): string {
  const latRounded = Math.round(lat * 10) / 10;
  const lngRounded = Math.round(lng * 10) / 10;
  return `${CACHE_PREFIX}:${latRounded}:${lngRounded}`;
}

/**
 * Get cached weather snapshot if valid
 * @returns WeatherSnapshot if cached and fresh, null otherwise
 */
export function getCachedWeather(
  lat: number,
  lng: number
): WeatherSnapshot | null {
  const key = generateCacheKey(lat, lng);
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null;
    }
    
    const entry: CachedWeatherEntry = JSON.parse(stored);
    const now = Date.now();
    
    // Check if expired
    if (now - entry.timestamp > CACHE_TTL_MS) {
      // Clean up expired entry
      localStorage.removeItem(key);
      return null;
    }
    
    return entry.snapshot;
  } catch (error) {
    console.error('Failed to read cache:', error);
    return null;
  }
}

/**
 * Cache weather snapshot with current timestamp
 */
export function setCachedWeather(
  lat: number,
  lng: number,
  snapshot: WeatherSnapshot
): void {
  const key = generateCacheKey(lat, lng);
  
  const entry: CachedWeatherEntry = {
    snapshot,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('Failed to write cache:', error);
    // If quota exceeded, try to clean old entries
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      cleanOldCacheEntries();
      // Retry once
      try {
        localStorage.setItem(key, JSON.stringify(entry));
      } catch {
        // Silent fail - caching is not critical
      }
    }
  }
}

/**
 * Get age of cached data in minutes
 * @returns age in minutes, or null if no cache
 */
export function getCacheAge(lat: number, lng: number): number | null {
  const key = generateCacheKey(lat, lng);
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null;
    }
    
    const entry: CachedWeatherEntry = JSON.parse(stored);
    const ageMs = Date.now() - entry.timestamp;
    return Math.floor(ageMs / (60 * 1000));
  } catch {
    return null;
  }
}

/**
 * Check if cache exists for coordinates (even if expired)
 * Useful for fallback when API fails
 */
export function hasStaleCache(lat: number, lng: number): boolean {
  const key = generateCacheKey(lat, lng);
  return localStorage.getItem(key) !== null;
}

/**
 * Get stale cache (even if expired) for emergency fallback
 */
export function getStaleCache(lat: number, lng: number): WeatherSnapshot | null {
  const key = generateCacheKey(lat, lng);
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null;
    }
    
    const entry: CachedWeatherEntry = JSON.parse(stored);
    return entry.snapshot;
  } catch {
    return null;
  }
}

/**
 * Clear all weather caches
 */
export function clearAllCaches(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Clean expired cache entries to free up space
 */
function cleanOldCacheEntries(): void {
  const now = Date.now();
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (!key.startsWith(CACHE_PREFIX)) {
      return;
    }
    
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return;
      
      const entry: CachedWeatherEntry = JSON.parse(stored);
      
      // Remove if expired
      if (now - entry.timestamp > CACHE_TTL_MS) {
        localStorage.removeItem(key);
      }
    } catch {
      // If corrupted, remove it
      localStorage.removeItem(key);
    }
  });
}
