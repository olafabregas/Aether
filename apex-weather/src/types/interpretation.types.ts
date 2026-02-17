// ============================================================================
// INTERPRETATION ENGINE TYPE DEFINITIONS
// Production-grade weather interpretation contracts
// ============================================================================

// Raw API response structure from OpenWeatherMap
export interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
  }>;
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  dt: number;
  name: string;
}

export interface UVIndexResponse {
  value: number;
}

// Air Pollution API response
export interface AirPollutionResponse {
  list: Array<{
    main: {
      aqi: number; // 1-5 scale
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

// Forecast API response (5 days, 3-hour intervals)
export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    pop: number; // Probability of precipitation (0-1)
    dt_txt: string;
  }>;
}

// Hourly forecast item (for UI)
export interface HourlyForecastItem {
  time: string;
  icon: string;
  temp: number;
  isPrimary: boolean;
}

// Daily forecast item (for UI)
export interface DailyForecastItem {
  day: string;
  icon: string;
  high: number;
  low: number;
  tempRange: {
    left: number;
    right: number;
  };
}

// Normalized weather snapshot (single source of truth)
export interface WeatherSnapshot {
  temperature: number;        // Celsius
  feelsLike: number;          // Celsius
  windSpeed: number;          // km/h
  windGust: number;           // km/h
  windDirection: number;      // degrees 0-360
  humidity: number;           // percentage 0-100
  dewPoint: number;           // Celsius
  uvIndex: number;            // 0-11+
  airQualityIndex: number;    // 0-500
  precipitationProbability: number; // percentage 0-100
  visibility: number;         // kilometers
  condition: WeatherCondition;
  cloudCoverage: number;      // percentage 0-100
  pressure: number;           // hPa
  timestamp: number;          // Unix timestamp
  sunrise: number;            // Unix timestamp
  sunset: number;             // Unix timestamp
  location: {
    city: string;
    country: string;
    state?: string;
    lat: number;
    lng: number;
  };
  hourlyForecast: HourlyForecastItem[];
  dailyForecast: DailyForecastItem[];
}

export type WeatherCondition = 
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'haze'
  | 'dust'
  | 'sand'
  | 'smoke';

// Interpretation rule structure
export interface InterpretationRule<T = WeatherSnapshot> {
  condition: (snapshot: T) => boolean;
  message: string;
  details: string;
  advice: string;
}

// Single interpretation result
export interface Interpretation {
  message: string;
  details: string;
  advice: string;
}

// Complete weather interpretation output
export interface WeatherInterpretation {
  temperature: Interpretation;
  wind: Interpretation;
  humidity: Interpretation;
  airQuality: Interpretation;
  precipitation: Interpretation;
  visibility: Interpretation;
}

// Cache entry structure
export interface CachedWeatherEntry {
  snapshot: WeatherSnapshot;
  timestamp: number;
}

// Rate limiter entry
export interface RateLimitEntry {
  timestamps: number[];
}

// Error types
export type WeatherErrorType =
  | 'RATE_LIMIT_EXCEEDED'
  | 'API_FAILURE'
  | 'LOCATION_DENIED'
  | 'NO_CACHE_AVAILABLE'
  | 'NETWORK_ERROR'
  | 'INVALID_RESPONSE';

export interface WeatherError {
  type: WeatherErrorType;
  message: string;
  retryAfter?: number; // seconds
  canUseCachedData?: boolean;
}

// Search/location types
export interface CitySearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export interface IPLocationResponse {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}
