// Location types
export interface Location {
  city: string;
  country?: string;
  state?: string;
  lat: number;
  lng: number;
}

// Current weather types
export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  timestamp: string;
}

// Hourly forecast types
export interface HourlyForecast {
  time: string;
  icon: string;
  temp: number;
  isPrimary: boolean;
}

// Wind data types
export interface WindData {
  speed: number;
  gusts: number;
  direction: number;
  directionLabel: string;
  explanation: string;
}

// Air quality types
export interface AirQuality {
  index: number;
  max: number;
  percentage: number;
  explanation: string;
}

// Precipitation types
export interface Precipitation {
  probability: number;
  explanation: string;
}

// Solar cycle types
export interface SolarCycle {
  sunrise: string;
  sunset: string;
  currentPosition: number;
}

// Humidity types
export interface Humidity {
  percentage: number;
  explanation: string;
}

// Visibility types
export interface Visibility {
  distance: number;
  unit: string;
  explanation: string;
}

// Daily forecast types
export interface DailyForecast {
  day: string;
  icon: string;
  high: number;
  low: number;
  tempRange: {
    left: number;
    right: number;
  };
}

// Complete weather data structure
export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  wind: WindData;
  airQuality: AirQuality;
  precipitation: Precipitation;
  solar: SolarCycle;
  humidity: Humidity;
  visibility: Visibility;
  forecast: DailyForecast[];
}
