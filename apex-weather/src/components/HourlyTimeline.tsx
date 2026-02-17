import React from 'react';
import type { HourlyForecast } from '../types/weather.types';

interface HourlyTimelineProps {
  hourly: HourlyForecast[];
}

const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ hourly }) => {
  return (
    <section className="mb-6 sm:mb-8 md:mb-10 animate-fade-in-up delay-75">
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 px-0.5 sm:px-1">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight">Today's Timeline</h2>
        <span className="text-[11px] sm:text-xs md:text-sm font-medium text-primary">View Full</span>
      </div>
      <div className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto pb-3 sm:pb-4 no-scrollbar -mx-1 px-1">
        {hourly.map((hour, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-[68px] sm:w-[72px] md:w-20 py-3 sm:py-3.5 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 hover-lift transition-all ${
              hour.isPrimary 
                ? 'glass-dark border-primary/30' 
                : 'glass'
            }`}
          >
            <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/50 uppercase tracking-wider">
              {hour.time}
            </span>
            <span className={`material-symbols-outlined text-lg sm:text-xl md:text-2xl ${hour.isPrimary ? 'text-primary' : 'text-white/70'}`}>
              {hour.icon}
            </span>
            <span className="font-bold text-sm sm:text-base md:text-lg">{hour.temp}°</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourlyTimeline;
