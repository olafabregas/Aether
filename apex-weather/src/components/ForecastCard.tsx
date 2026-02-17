import React from 'react';
import type { DailyForecast } from '../types/weather.types';

interface ForecastCardProps {
  forecast: DailyForecast[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <section className="animate-fade-in-up delay-150">
      <div className="glass p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl hover-lift">
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          <h3 className="font-bold text-sm sm:text-base md:text-lg tracking-tight">5-Day Forecast</h3>
        </div>
        <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 transition-all hover:translate-x-1">
              <span className="w-7 sm:w-8 md:w-10 text-[10px] sm:text-[11px] md:text-xs font-bold text-white/60 uppercase flex-shrink-0">
                {day.day}
              </span>
              <span className="material-symbols-outlined text-primary text-base sm:text-lg md:text-xl flex-shrink-0">
                {day.icon}
              </span>
              <div className="flex-1 h-1 sm:h-1.5 md:h-2 glass rounded-full relative min-w-0">
                <div 
                  className="absolute h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4] transition-all"
                  style={{
                    left: `${day.tempRange.left}%`,
                    right: `${day.tempRange.right}%`
                  }}
                ></div>
              </div>
              <div className="w-12 sm:w-13 md:w-14 lg:w-16 text-right flex-shrink-0">
                <span className="text-[11px] sm:text-xs md:text-sm font-bold">{day.high}°</span>
                <span className="text-[11px] sm:text-xs md:text-sm text-white/40 ml-0.5 sm:ml-1">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForecastCard;
