// ============================================================================
// WEATHER DATA NORMALIZER
// Converts raw API data into standardized WeatherSnapshot
// ============================================================================

import type {
  OpenWeatherResponse,
  UVIndexResponse,
  AirPollutionResponse,
  ForecastResponse,
  WeatherSnapshot,
  WeatherCondition
} from '../types/interpretation.types';
import {
  processHourlyForecast,
  processDailyForecast,
  getForecastPrecipitation
} from '../utils/forecastProcessor';

/**
 * Normalize OpenWeatherMap API response into WeatherSnapshot
 */
export function normalizeWeatherData(
  apiData: OpenWeatherResponse,
  uvData: UVIndexResponse,
  airPollutionData: AirPollutionResponse,
  forecastData: ForecastResponse,
  lat: number,
  lng: number
): WeatherSnapshot {
  const temperature = Math.round(apiData.main.temp);
  const humidity = apiData.main.humidity;
  
  return {
    temperature,
    feelsLike: Math.round(apiData.main.feels_like),
    windSpeed: convertMsToKmh(apiData.wind.speed),
    windGust: apiData.wind.gust ? convertMsToKmh(apiData.wind.gust) : convertMsToKmh(apiData.wind.speed),
    windDirection: apiData.wind.deg,
    humidity,
    dewPoint: calculateDewPoint(temperature, humidity),
    uvIndex: uvData.value,
    airQualityIndex: convertAQItoUSScale(airPollutionData),
    precipitationProbability: getForecastPrecipitation(forecastData),
    visibility: convertMetersToKm(apiData.visibility),
    condition: mapWeatherCondition(apiData.weather[0].main),
    cloudCoverage: apiData.clouds.all,
    pressure: apiData.main.pressure,
    timestamp: Date.now(),
    sunrise: apiData.sys.sunrise,
    sunset: apiData.sys.sunset,
    location: {
      city: apiData.name,
      country: apiData.sys.country,
      state: undefined, // OpenWeather doesn't provide state in weather endpoint
      lat,
      lng
    },
    hourlyForecast: processHourlyForecast(forecastData),
    dailyForecast: processDailyForecast(forecastData)
  };
}

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert wind speed from m/s to km/h
 */
function convertMsToKmh(speedMs: number): number {
  return Math.round(speedMs * 3.6);
}

/**
 * Convert visibility from meters to kilometers
 */
function convertMetersToKm(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate dew point using Magnus formula
 */
function calculateDewPoint(tempC: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  
  return Math.round(dewPoint * 10) / 10; // Round to 1 decimal
}

/**
 * Map OpenWeatherMap condition to our enum
 */
function mapWeatherCondition(condition: string): WeatherCondition {
  const normalized = condition.toLowerCase();
  
  if (normalized === 'clear') return 'clear';
  if (normalized === 'clouds') return 'clouds';
  if (normalized === 'rain') return 'rain';
  if (normalized === 'drizzle') return 'drizzle';
  if (normalized === 'thunderstorm') return 'thunderstorm';
  if (normalized === 'snow') return 'snow';
  if (normalized === 'mist') return 'mist';
  if (normalized === 'fog') return 'fog';
  if (normalized === 'haze') return 'haze';
  if (normalized === 'dust') return 'dust';
  if (normalized === 'sand') return 'sand';
  if (normalized === 'smoke') return 'smoke';
  
  return 'clouds'; // Default fallback
}

/**
 * Convert OpenWeatherMap AQI (1-5 scale) to US EPA AQI (0-500 scale)
 * OpenWeatherMap scale:
 * 1 = Good
 * 2 = Fair
 * 3 = Moderate
 * 4 = Poor
 * 5 = Very Poor
 */
function convertAQItoUSScale(airPollutionData: AirPollutionResponse): number {
  const aqiValue = airPollutionData.list[0]?.main.aqi || 1;
  
  // Map OpenWeather 1-5 scale to approximate US EPA 0-500 scale
  const aqiMapping: Record<number, number> = {
    1: 25,   // Good (0-50)
    2: 75,   // Fair (51-100)
    3: 125,  // Moderate (101-150)
    4: 175,  // Poor (151-200)
    5: 250   // Very Poor (201-300)
  };
  
  return aqiMapping[aqiValue] || 50;
}

