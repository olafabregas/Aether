import type { WeatherData } from '../types/weather.types';

export const mockWeatherData: WeatherData = {
  location: {
    city: "San Francisco",
    country: "US",
    state: "CA",
    lat: 37.7749,
    lng: -122.4194
  },
  current: {
    temp: 24,
    feelsLike: 21,
    condition: "Scattered Clouds",
    description: "Humid",
    timestamp: new Date().toISOString()
  },
  hourly: [
    { time: "Now", icon: "cloud", temp: 24, isPrimary: true },
    { time: "14:00", icon: "wb_sunny", temp: 26, isPrimary: false },
    { time: "15:00", icon: "wb_sunny", temp: 27, isPrimary: false },
    { time: "16:00", icon: "cloudy", temp: 25, isPrimary: false },
    { time: "17:00", icon: "water_drop", temp: 23, isPrimary: false },
  ],
  wind: {
    speed: 12,
    gusts: 20,
    direction: 315,
    directionLabel: "North-West",
    explanation: "A steady breeze is flowing from the mountains. Ideal for paragliding or a light evening stroll."
  },
  airQuality: {
    index: 24,
    max: 500,
    percentage: 12,
    explanation: "Air is clean, great for outdoor activities."
  },
  precipitation: {
    probability: 15,
    explanation: "Low chance of rain today. You probably won't need an umbrella."
  },
  solar: {
    sunrise: "06:12 AM",
    sunset: "08:44 PM",
    currentPosition: 35
  },
  humidity: {
    percentage: 82,
    explanation: "The air feels heavy and damp; perfect for staying in."
  },
  visibility: {
    distance: 14,
    unit: "km",
    explanation: "Slight haze on the horizon. Views are decent."
  },
  forecast: [
    { day: "Mon", icon: "wb_sunny", high: 26, low: 18, tempRange: { left: 50, right: 25 } },
    { day: "Tue", icon: "cloud", high: 24, low: 16, tempRange: { left: 30, right: 40 } },
    { day: "Wed", icon: "water_drop", high: 19, low: 14, tempRange: { left: 10, right: 60 } },
    { day: "Thu", icon: "thunderstorm", high: 17, low: 12, tempRange: { left: 5, right: 70 } },
    { day: "Fri", icon: "partly_cloudy_day", high: 23, low: 15, tempRange: { left: 40, right: 35 } },
  ]
};
