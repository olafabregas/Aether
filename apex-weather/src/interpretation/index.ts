// ============================================================================
// PUBLIC INTERPRETATION API
// Main entry point for weather interpretation
// ============================================================================

import type { WeatherSnapshot, WeatherInterpretation } from '../types/interpretation.types';
import { evaluateRules } from './engine';
import {
  temperatureRules,
  windRules,
  humidityRules,
  airQualityRules,
  precipitationRules,
  visibilityRules
} from './rules';

/**
 * Interpret complete weather snapshot
 * @param snapshot - Normalized weather data
 * @returns Structured interpretation for all categories
 */
export function interpretWeather(snapshot: WeatherSnapshot): WeatherInterpretation {
  return {
    temperature: evaluateRules(snapshot, temperatureRules),
    wind: evaluateRules(snapshot, windRules),
    humidity: evaluateRules(snapshot, humidityRules),
    airQuality: evaluateRules(snapshot, airQualityRules),
    precipitation: evaluateRules(snapshot, precipitationRules),
    visibility: evaluateRules(snapshot, visibilityRules)
  };
}

// Re-export normalizer for convenience
export { normalizeWeatherData } from './normalizer';
