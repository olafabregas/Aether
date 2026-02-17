import React from 'react';
import type { WeatherData } from '../types/weather.types';
import type { WeatherInterpretation, WeatherSnapshot } from '../types/interpretation.types';
import WindCard from './cards/WindCard';
import AirQualityCard from './cards/AirQualityCard';
import PrecipitationCard from './cards/PrecipitationCard';
import SolarCycleCard from './cards/SolarCycleCard';
import HumidityCard from './cards/HumidityCard';
import VisibilityCard from './cards/VisibilityCard';

interface MetricsGridProps {
  weatherData: WeatherData | WeatherSnapshot;
  interpretation?: WeatherInterpretation | null;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ weatherData, interpretation }) => {
  // Handle both WeatherData (mock) and WeatherSnapshot (real) formats
  const isSnapshot = 'temperature' in weatherData;
  
  return (
    <section className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
      <div className="col-span-2 animate-fade-in-up delay-75">
        <WindCard 
          wind={isSnapshot ? {
            speed: weatherData.windSpeed,
            gusts: weatherData.windGust,
            direction: weatherData.windDirection,
            directionLabel: getCardinalDirection(weatherData.windDirection),
            explanation: interpretation?.wind.details || ''
          } : weatherData.wind}
          interpretation={interpretation?.wind}
        />
      </div>
      <div className="animate-fade-in-up delay-150">
        <AirQualityCard 
          airQuality={isSnapshot ? {
            index: weatherData.airQualityIndex,
            max: 500,
            percentage: (weatherData.airQualityIndex / 500) * 100,
            explanation: interpretation?.airQuality.details || ''
          } : weatherData.airQuality}
          interpretation={interpretation?.airQuality}
        />
      </div>
      <div className="animate-fade-in-up delay-225">
        <PrecipitationCard 
          precipitation={isSnapshot ? {
            probability: weatherData.precipitationProbability,
            explanation: interpretation?.precipitation.details || ''
          } : weatherData.precipitation}
          interpretation={interpretation?.precipitation}
        />
      </div>
      <div className="col-span-2 animate-fade-in-up delay-300">
        <SolarCycleCard 
          solar={'solar' in weatherData ? weatherData.solar : {
            sunrise: '06:12 AM',
            sunset: '08:44 PM',
            currentPosition: 35
          }}
          sunrise={isSnapshot ? weatherData.sunrise : undefined}
          sunset={isSnapshot ? weatherData.sunset : undefined}
        />
      </div>
      <div className="animate-fade-in-up delay-375">
        <HumidityCard 
          humidity={isSnapshot ? {
            percentage: weatherData.humidity,
            explanation: interpretation?.humidity.details || ''
          } : weatherData.humidity}
          interpretation={interpretation?.humidity}
        />
      </div>
      <div className="animate-fade-in-up delay-450">
        <VisibilityCard 
          visibility={isSnapshot ? {
            distance: weatherData.visibility,
            unit: 'km',
            explanation: interpretation?.visibility.details || ''
          } : weatherData.visibility}
          interpretation={interpretation?.visibility}
        />
      </div>
    </section>
  );
};

// Helper to convert degrees to cardinal direction
function getCardinalDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export default MetricsGrid;
