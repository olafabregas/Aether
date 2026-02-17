// ============================================================================
// WEATHER INTERPRETATION RULES
// Rule-based weather condition interpretation
// Most specific rules first, fallback rule last
// ============================================================================

import type { InterpretationRule, WeatherSnapshot } from '../types/interpretation.types';

// ============================================================================
// TEMPERATURE RULES
// ============================================================================

export const temperatureRules: InterpretationRule[] = [
  {
    condition: (s) => s.temperature < -20,
    message: 'Extreme cold',
    details: 'Dangerous conditions. Frostbite risk in minutes.',
    advice: 'Avoid outdoor exposure. Multiple insulated layers essential.'
  },
  {
    condition: (s) => s.temperature < -10,
    message: 'Severe cold',
    details: 'Heavy winter gear required for any outdoor activity.',
    advice: 'Limit time outdoors. Cover all exposed skin.'
  },
  {
    condition: (s) => s.temperature < 0,
    message: 'Freezing',
    details: 'Ice formation likely. Roads may be hazardous.',
    advice: 'Wear insulated jacket, gloves, and hat. Exercise caution.'
  },
  {
    condition: (s) => s.temperature < 10 && s.windSpeed > 20,
    message: 'Cold with wind chill',
    details: 'Feels colder than actual temperature due to wind.',
    advice: 'Layer clothing and protect from wind exposure.'
  },
  {
    condition: (s) => s.temperature < 10,
    message: 'Cold',
    details: 'Cool conditions suitable for warm clothing.',
    advice: 'Wear a jacket or sweater. Comfortable for brisk activity.'
  },
  {
    condition: (s) => s.temperature >= 10 && s.temperature < 18,
    message: 'Cool',
    details: 'Mild conditions, light jacket recommended.',
    advice: 'Layer clothing for flexibility. Good for outdoor activity.'
  },
  {
    condition: (s) => s.temperature >= 18 && s.temperature < 25,
    message: 'Comfortable',
    details: 'Pleasant conditions for most activities.',
    advice: 'Ideal weather. Light clothing sufficient.'
  },
  {
    condition: (s) => s.temperature >= 25 && s.temperature < 30,
    message: 'Warm',
    details: 'Comfortable warmth. Stay hydrated outdoors.',
    advice: 'Wear light, breathable clothing. Sunscreen recommended.'
  },
  {
    condition: (s) => s.temperature >= 30 && s.temperature < 35,
    message: 'Hot',
    details: 'Elevated heat. Hydration becomes important.',
    advice: 'Seek shade during peak hours. Drink water regularly.'
  },
  {
    condition: (s) => s.temperature >= 35 && s.temperature < 40,
    message: 'Very hot',
    details: 'Excessive heat. Limit strenuous outdoor activity.',
    advice: 'Stay indoors during midday. Hydrate frequently.'
  },
  {
    condition: (s) => s.temperature >= 40,
    message: 'Extreme heat',
    details: 'Dangerous heat levels. Heat exhaustion risk.',
    advice: 'Avoid outdoor activity. Stay in air-conditioned spaces.'
  },
  {
    condition: () => true,
    message: 'Temperature data available',
    details: 'Current atmospheric conditions recorded.',
    advice: 'Dress appropriately for current conditions.'
  }
];

// ============================================================================
// WIND RULES
// ============================================================================

export const windRules: InterpretationRule[] = [
  {
    condition: (s) => s.windSpeed > 60,
    message: 'Dangerous wind',
    details: 'Severe wind conditions. Structural damage possible.',
    advice: 'Stay indoors. Avoid windows. Secure loose objects.'
  },
  {
    condition: (s) => s.windSpeed > 40,
    message: 'Very strong wind',
    details: 'Difficult to walk. Tree branches may break.',
    advice: 'Avoid outdoor activity. Secure outdoor items.'
  },
  {
    condition: (s) => s.windSpeed > 25,
    message: 'Strong wind',
    details: 'Noticeable resistance when walking. Umbrellas difficult to use.',
    advice: 'Secure loose items. Walking may be challenging.'
  },
  {
    condition: (s) => s.windSpeed > 15,
    message: 'Moderate breeze',
    details: 'Steady wind movement. Leaves and small branches sway.',
    advice: 'Comfortable for most activities. Light items may blow around.'
  },
  {
    condition: (s) => s.windSpeed > 5,
    message: 'Light breeze',
    details: 'Gentle wind. Pleasant for outdoor activity.',
    advice: 'Ideal conditions for walks and outdoor recreation.'
  },
  {
    condition: (s) => s.windSpeed <= 5,
    message: 'Calm',
    details: 'Minimal air movement. Still conditions.',
    advice: 'Perfect for outdoor dining and stationary activities.'
  },
  {
    condition: () => true,
    message: 'Wind conditions monitored',
    details: 'Current wind speed recorded.',
    advice: 'Check conditions before outdoor activities.'
  }
];

// ============================================================================
// HUMIDITY RULES
// ============================================================================

export const humidityRules: InterpretationRule[] = [
  {
    condition: (s) => s.humidity > 85 && s.temperature > 25,
    message: 'Oppressively humid',
    details: 'Heavy, muggy air. Sweat evaporation inhibited.',
    advice: 'Stay in air-conditioned spaces. Limit physical exertion.'
  },
  {
    condition: (s) => s.humidity > 70 && s.temperature > 25,
    message: 'Very humid',
    details: 'Noticeably damp air. Feels warmer than actual temperature.',
    advice: 'Stay hydrated. Seek climate-controlled environments.'
  },
  {
    condition: (s) => s.humidity > 60,
    message: 'Humid',
    details: 'Moisture present in air. Mild discomfort possible.',
    advice: 'Comfortable for most. Light clothing recommended.'
  },
  {
    condition: (s) => s.humidity >= 40 && s.humidity <= 60,
    message: 'Comfortable humidity',
    details: 'Ideal moisture levels for comfort.',
    advice: 'Pleasant conditions for all activities.'
  },
  {
    condition: (s) => s.humidity < 30,
    message: 'Dry air',
    details: 'Low moisture. May cause dry skin and static.',
    advice: 'Use moisturizer. Stay hydrated. Humidifiers beneficial.'
  },
  {
    condition: () => true,
    message: 'Humidity level stable',
    details: 'Current atmospheric moisture recorded.',
    advice: 'Monitor comfort levels and adjust accordingly.'
  }
];

// ============================================================================
// AIR QUALITY RULES (AQI Scale)
// ============================================================================

export const airQualityRules: InterpretationRule[] = [
  {
    condition: (s) => s.airQualityIndex > 300,
    message: 'Hazardous air quality',
    details: 'Health warnings in effect. Everyone at risk.',
    advice: 'Stay indoors. Avoid all outdoor exertion. Use air purifiers.'
  },
  {
    condition: (s) => s.airQualityIndex > 200,
    message: 'Very unhealthy air',
    details: 'Serious health effects for all populations.',
    advice: 'Limit outdoor activity. Wear N95 mask if outside.'
  },
  {
    condition: (s) => s.airQualityIndex > 150,
    message: 'Unhealthy air',
    details: 'Sensitive groups should avoid outdoor activity.',
    advice: 'Reduce prolonged exertion. Monitor symptoms.'
  },
  {
    condition: (s) => s.airQualityIndex > 50,
    message: 'Moderate air quality',
    details: 'Acceptable for most. Sensitive individuals take caution.',
    advice: 'Generally safe. Monitor if you have respiratory conditions.'
  },
  {
    condition: (s) => s.airQualityIndex <= 50,
    message: 'Good air quality',
    details: 'Clean air. No health concerns.',
    advice: 'Excellent conditions for outdoor activities.'
  },
  {
    condition: () => true,
    message: 'Air quality monitored',
    details: 'Current air quality index available.',
    advice: 'Check regularly if you have respiratory sensitivities.'
  }
];

// ============================================================================
// PRECIPITATION RULES
// ============================================================================

export const precipitationRules: InterpretationRule[] = [
  {
    condition: (s) => s.precipitationProbability > 80,
    message: 'Heavy rain occurring',
    details: 'Active precipitation is falling. Wet conditions present.',
    advice: 'Stay dry with rain gear. Roads may be slippery.'
  },
  {
    condition: (s) => s.precipitationProbability > 60,
    message: 'Rain is falling',
    details: 'Moderate rainfall is currently happening.',
    advice: 'Use umbrella or rain jacket. Take precautions outdoors.'
  },
  {
    condition: (s) => s.precipitationProbability > 30,
    message: 'Light rain present',
    details: 'Some precipitation is currently occurring.',
    advice: 'Light rain gear recommended for outdoor activities.'
  },
  {
    condition: (s) => s.precipitationProbability > 10,
    message: 'Drizzle or mist',
    details: 'Minimal moisture in the air. Light precipitation possible.',
    advice: 'Light jacket or hoodie should be sufficient.'
  },
  {
    condition: (s) => s.precipitationProbability <= 10,
    message: 'Dry conditions',
    details: 'No precipitation is currently falling.',
    advice: 'Perfect for outdoor activities. No rain gear needed.'
  },
  {
    condition: () => true,
    message: 'Conditions monitored',
    details: 'Current precipitation levels are being tracked.',
    advice: 'Monitor conditions if planning outdoor activities.'
  }
];

// ============================================================================
// VISIBILITY RULES
// ============================================================================

export const visibilityRules: InterpretationRule[] = [
  {
    condition: (s) => s.visibility < 1,
    message: 'Very poor visibility',
    details: 'Dense fog or severe weather. Hazardous driving.',
    advice: 'Avoid travel if possible. Use fog lights and reduce speed.'
  },
  {
    condition: (s) => s.visibility < 5,
    message: 'Poor visibility',
    details: 'Limited sight distance. Reduced vision conditions.',
    advice: 'Drive carefully. Increase following distance.'
  },
  {
    condition: (s) => s.visibility < 10,
    message: 'Moderate visibility',
    details: 'Some haze or light fog present.',
    advice: 'Visibility adequate but not optimal. Take standard precautions.'
  },
  {
    condition: (s) => s.visibility >= 10,
    message: 'Good visibility',
    details: 'Clear atmospheric conditions. Excellent sight distance.',
    advice: 'Ideal for all outdoor activities and travel.'
  },
  {
    condition: () => true,
    message: 'Visibility conditions stable',
    details: 'Current visibility range recorded.',
    advice: 'Monitor conditions if traveling.'
  }
];
