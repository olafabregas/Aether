import React, { useState } from 'react';
import type { WeatherInterpretation } from '../types/interpretation.types';

interface WeatherSummaryCardProps {
  interpretation: WeatherInterpretation;
}

const WeatherSummaryCard: React.FC<WeatherSummaryCardProps> = ({ interpretation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Collect all unique advice from interpretations
  const allAdvice = [
    { category: 'Temperature', advice: interpretation.temperature.advice, icon: 'thermostat' },
    { category: 'Wind', advice: interpretation.wind.advice, icon: 'air' },
    { category: 'Humidity', advice: interpretation.humidity.advice, icon: 'opacity' },
    { category: 'Air Quality', advice: interpretation.airQuality.advice, icon: 'aq' },
    { category: 'Precipitation', advice: interpretation.precipitation.advice, icon: 'rainy' },
    { category: 'Visibility', advice: interpretation.visibility.advice, icon: 'visibility' }
  ].filter(item => item.advice && item.advice.trim().length > 0);

  // Show first 3 recommendations
  const visibleAdvice = isExpanded ? allAdvice : allAdvice.slice(0, 3);

  return (
    <section className="mb-6 sm:mb-8 md:mb-10 animate-fade-in-up">
      <div className="glass rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 lg:p-6 hover-lift">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-base sm:text-lg md:text-xl">lightbulb</span>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight">Recommendations</h2>
          </div>
          {allAdvice.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] md:text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span className="hidden xs:inline">{isExpanded ? 'Show Less' : 'View All'}</span>
              <span className="xs:hidden text-cyan-400">{isExpanded ? 'Less' : 'All'}</span>
              <span className={`material-symbols-outlined text-xs sm:text-sm transition-transform text-cyan-400 hover:text-primary/80 ${isExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
          )}
        </div>

        {/* Recommendations List */}
        <div className="space-y-2.5 sm:space-y-3">
          {visibleAdvice.map((item, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
              <span className="material-symbols-outlined text-cyan-400 text-sm sm:text-base md:text-lg mt-0.5 flex-shrink-0">
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] sm:text-[10px] md:text-xs text-white/50 mb-0.5">{item.category}</div>
                <div className="text-[11px] sm:text-xs md:text-sm text-white/80 leading-relaxed">{item.advice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeatherSummaryCard;
