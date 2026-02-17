import React, { useState, useEffect } from 'react';
import type { SolarCycle } from '../../types/weather.types';
import { formatSolarTime, calculateSunPosition } from '../../utils/solarUtils';

interface SolarCycleCardProps {
  solar: SolarCycle;
  sunrise?: number;  // Unix timestamp (seconds)
  sunset?: number;   // Unix timestamp (seconds)
}

const SolarCycleCard: React.FC<SolarCycleCardProps> = ({ solar, sunrise, sunset }) => {
  // Calculate sun position in real-time
  const [currentPosition, setCurrentPosition] = useState(() => {
    if (sunrise && sunset) {
      return calculateSunPosition(sunrise, sunset);
    }
    return solar.currentPosition;
  });

  // Update position every minute for real-time accuracy
  useEffect(() => {
    if (!sunrise || !sunset) return;

    const updatePosition = () => {
      setCurrentPosition(calculateSunPosition(sunrise, sunset));
    };

    // Update immediately
    updatePosition();

    // Then update every minute
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [sunrise, sunset]);

  // Format times - use props if available, otherwise use solar values
  const sunriseTime = sunrise ? formatSolarTime(sunrise) : solar.sunrise;
  const sunsetTime = sunset ? formatSolarTime(sunset) : solar.sunset;

  return (
    <div className="glass p-3 sm:p-3.5 md:p-4 lg:p-5 rounded-xl sm:rounded-2xl flex flex-col gap-2.5 sm:gap-3 md:gap-4 hover-lift">
      <div className="flex items-center gap-1.5 sm:gap-2 text-primary">
        <span className="material-symbols-outlined text-base sm:text-lg md:text-xl text-cyan-400">wb_twilight</span>
        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em]">
          Solar Cycle
        </span>
      </div>
      <div className="flex justify-between items-end gap-2 sm:gap-3 md:gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[9px] md:text-xs text-white/40 uppercase font-bold tracking-widest">
            Sunrise
          </span>
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">{sunriseTime}</span>
        </div>
        <div className="flex-1 h-8 sm:h-10 md:h-12 relative overflow-hidden min-w-0">
          <svg className="w-full h-full" viewBox="0 0 100 40">
            <path 
              className="solar-path" 
              d="M 0 40 Q 50 -10 100 40" 
              fill="none" 
              strokeWidth="1.5"
            />
            <circle 
              className="shadow-[0_0_8px_#06b6d4]"
              cx={currentPosition} 
              cy="12" 
              fill="#06b6d4"
              r="3"
            />
          </svg>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] sm:text-[9px] md:text-xs text-white/40 uppercase font-bold tracking-widest">
            Sunset
          </span>
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">{sunsetTime}</span>
        </div>
      </div>
    </div>
  );
};

export default SolarCycleCard;
