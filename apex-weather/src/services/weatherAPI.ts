// ============================================================================
// OPENWEATHERMAP API SERVICE
// Rate-limited, error-normalized weather data fetching
// ============================================================================

import { checkRateLimit } from '../utils/rateLimiter';
import type {
  OpenWeatherResponse,
  UVIndexResponse,
  AirPollutionResponse,
  ForecastResponse,
  WeatherError
} from '../types/interpretation.types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather data with rate limiting
 */
export async function fetchWeatherData(
  lat: number,
  lon: number
): Promise<OpenWeatherResponse> {
  // Enforce rate limit
  if (!checkRateLimit()) {
    const error: WeatherError = {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait before trying again.',
      canUseCachedData: true
    };
    throw error;
  }
  
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        const error: WeatherError = {
          type: 'API_FAILURE',
          message: 'Invalid API key. Please check your configuration.',
          canUseCachedData: true
        };
        throw error;
      }
      
      if (response.status === 429) {
        const error: WeatherError = {
          type: 'RATE_LIMIT_EXCEEDED',
          message: 'API rate limit exceeded',
          canUseCachedData: true
        };
        throw error;
      }
      
      const error: WeatherError = {
        type: 'API_FAILURE',
        message: `Weather API error: ${response.status}`,
        canUseCachedData: true
      };
      throw error;
    }
    
    const data: OpenWeatherResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as WeatherError).type) {
      throw error;
    }
    
    const networkError: WeatherError = {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      canUseCachedData: true
    };
    throw networkError;
  }
}

/**
 * Fetch UV index data with rate limiting
 */
export async function fetchUVIndex(
  lat: number,
  lon: number
): Promise<UVIndexResponse> {
  // Enforce rate limit
  if (!checkRateLimit()) {
    const error: WeatherError = {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait before trying again.',
      canUseCachedData: true
    };
    throw error;
  }
  
  const url = `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // UV index is optional - don't fail hard
      console.warn(`UV Index API error: ${response.status}`);
      return { value: 0 };
    }
    
    const data: UVIndexResponse = await response.json();
    return data;
  } catch (error) {
    // UV index is optional - return safe default
    console.warn('Failed to fetch UV index:', error);
    return { value: 0 };
  }
}

/**
 * Fetch air pollution data
 */
export async function fetchAirPollution(
  lat: number,
  lon: number
): Promise<AirPollutionResponse> {
  // Enforce rate limit
  if (!checkRateLimit()) {
    const error: WeatherError = {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait before trying again.',
      canUseCachedData: true
    };
    throw error;
  }
  
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Air pollution is optional - return safe default
      console.warn(`Air Pollution API error: ${response.status}`);
      return {
        list: [{
          main: { aqi: 1 }, // 1 = Good
          components: {
            co: 0, no: 0, no2: 0, o3: 0, so2: 0, pm2_5: 0, pm10: 0, nh3: 0
          }
        }]
      };
    }
    
    const data: AirPollutionResponse = await response.json();
    return data;
  } catch (error) {
    // Air pollution is optional - return safe default
    console.warn('Failed to fetch air pollution:', error);
    return {
      list: [{
        main: { aqi: 1 },
        components: {
          co: 0, no: 0, no2: 0, o3: 0, so2: 0, pm2_5: 0, pm10: 0, nh3: 0
        }
      }]
    };
  }
}

/**
 * Fetch 5-day forecast (3-hour intervals)
 */
export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  // Enforce rate limit
  if (!checkRateLimit()) {
    const error: WeatherError = {
      type: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait before trying again.',
      canUseCachedData: true
    };
    throw error;
  }
  
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error: WeatherError = {
        type: 'API_FAILURE',
        message: `Forecast API error: ${response.status}`,
        canUseCachedData: true
      };
      throw error;
    }
    
    const data: ForecastResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as WeatherError).type) {
      throw error;
    }
    
    const networkError: WeatherError = {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      canUseCachedData: true
    };
    throw networkError;
  }
}

/**
 * Fetch all weather data in parallel
 */
export async function fetchCompleteWeatherData(
  lat: number,
  lon: number
): Promise<{ 
  weather: OpenWeatherResponse; 
  uv: UVIndexResponse;
  airPollution: AirPollutionResponse;
  forecast: ForecastResponse;
}> {
  const [weather, uv, airPollution, forecast] = await Promise.all([
    fetchWeatherData(lat, lon),
    fetchUVIndex(lat, lon),
    fetchAirPollution(lat, lon),
    fetchForecast(lat, lon)
  ]);
  
  return { weather, uv, airPollution, forecast };
}
