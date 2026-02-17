// ============================================================================
// WEATHER ORCHESTRATION HOOK
// Single hook to manage all weather data fetching and interpretation
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type {
  WeatherSnapshot,
  WeatherInterpretation,
  WeatherError
} from '../types/interpretation.types';
import { getSmartLocation, saveLastLocation } from '../services/geolocation';
import { getCachedWeather, setCachedWeather, getStaleCache } from '../services/cacheService';
import { fetchCompleteWeatherData } from '../services/weatherAPI';
import { normalizeWeatherData, interpretWeather } from '../interpretation';
import { getRetryAfter } from '../utils/rateLimiter';

interface UseWeatherReturn {
  interpretation: WeatherInterpretation | null;
  snapshot: WeatherSnapshot | null;
  loading: boolean;
  error: WeatherError | null;
  retry: () => void;
  searchCity: (lat: number, lng: number, cityName: string) => Promise<void>;
}

/**
 * Main weather hook - orchestrates location, caching, API, and interpretation
 */
export function useWeather(): UseWeatherReturn {
  const [interpretation, setInterpretation] = useState<WeatherInterpretation | null>(null);
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  /**
   * Fetch and interpret weather for given coordinates
   */
  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Check cache
      const cachedSnapshot = getCachedWeather(lat, lng);
      if (cachedSnapshot) {
        console.log('Using cached weather data');
        const interp = interpretWeather(cachedSnapshot);
        setSnapshot(cachedSnapshot);
        setInterpretation(interp);
        setLoading(false);
        return;
      }

      // Step 2: Fetch from API (rate limit checked inside)
      console.log('Fetching fresh weather data');
      const { weather, uv, airPollution, forecast } = await fetchCompleteWeatherData(lat, lng);
      
      // Step 3: Normalize
      const normalizedSnapshot = normalizeWeatherData(weather, uv, airPollution, forecast, lat, lng);
      
      // Step 4: Cache snapshot (NOT interpretation)
      setCachedWeather(lat, lng, normalizedSnapshot);
      
      // Step 5: Interpret
      const interp = interpretWeather(normalizedSnapshot);
      
      setSnapshot(normalizedSnapshot);
      setInterpretation(interp);
      setLoading(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      
      const weatherError = err as WeatherError;
      
      // Try to use stale cache as fallback
      if (weatherError.canUseCachedData) {
        const staleSnapshot = getStaleCache(lat, lng);
        if (staleSnapshot) {
          console.log('Using stale cache as fallback');
          const interp = interpretWeather(staleSnapshot);
          setSnapshot(staleSnapshot);
          setInterpretation(interp);
          
          // Set error but show data
          if (weatherError.type === 'RATE_LIMIT_EXCEEDED') {
            const retryAfter = getRetryAfter();
            setError({
              ...weatherError,
              retryAfter,
              message: `Rate limit reached. Retry in ${retryAfter} seconds.`
            });
          } else {
            setError(weatherError);
          }
          
          setLoading(false);
          return;
        }
      }
      
      // No fallback available
      setError(weatherError);
      setLoading(false);
    }
  }, []);

  /**
   * Search for city by coordinates
   */
  const searchCity = useCallback(async (lat: number, lng: number, cityName: string) => {
    saveLastLocation(lat, lng, cityName);
    setCoords({ lat, lng });
    await fetchWeather(lat, lng);
  }, [fetchWeather]);

  /**
   * Retry last failed request
   */
  const retry = useCallback(() => {
    if (coords) {
      fetchWeather(coords.lat, coords.lng);
    } else {
      // Restart location resolution
      setLoading(true);
      setError(null);
    }
  }, [coords, fetchWeather]);

  /**
   * Initial load - resolve location and fetch weather
   */
  useEffect(() => {
    const init = async () => {
      try {
        // Resolve location using smart fallback
        const location = await getSmartLocation();
        
        if (!location) {
          // All fallbacks failed - need user input
          setError({
            type: 'LOCATION_DENIED',
            message: 'Unable to determine location. Please search for a city.',
            canUseCachedData: false
          });
          setLoading(false);
          return;
        }
        
        setCoords({ lat: location.latitude, lng: location.longitude });
        await fetchWeather(location.latitude, location.longitude);
      } catch (err) {
        console.error('Initialization error:', err);
        setError({
          type: 'LOCATION_DENIED',
          message: 'Failed to initialize. Please search for a city.',
          canUseCachedData: false
        });
        setLoading(false);
      }
    };

    init();
  }, []); // Run once on mount

  return {
    interpretation,
    snapshot,
    loading,
    error,
    retry,
    searchCity
  };
}
