import React from 'react';
import type { WindData } from '../../types/weather.types';
import type { Interpretation } from '../../types/interpretation.types';

interface WindCardProps {
  wind: WindData;
  interpretation?: Interpretation;
}

const WindCard: React.FC<WindCardProps> = ({ wind, interpretation }) => {
  return (
    <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 relative overflow-hidden hover-lift">
      <div className="flex justify-between items-start mb-3 sm:mb-3.5 md:mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-50 mb-0.5 sm:mb-1 text-cyan-400">
            Wind &amp; Direction
          </h4>
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold">{wind.speed}</span>
            <span className="text-[11px] sm:text-xs md:text-sm opacity-60">km/h</span>
          </div>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow "></div>
          <span 
            className="material-icons-round text-cyan-400 text-xl sm:text-2xl md:text-3xl"
            style={{ transform: `rotate(${wind.direction}deg)` }}
          >
            navigation
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 border-t border-primary/10 pt-2.5 sm:pt-3 md:pt-4">
        <div>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase opacity-40">Gusts</p>
          <p className="text-[11px] sm:text-xs md:text-sm font-medium text-primary">{wind.gusts} km/h</p>
        </div>
        <div>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase opacity-40">Direction</p>
          <p className="text-[11px] sm:text-xs md:text-sm font-medium text-primary">{wind.direction}° {wind.directionLabel}</p>
        </div>
      </div>
      <p className="mt-2.5 sm:mt-3 md:mt-4 text-[11px] sm:text-xs md:text-sm text-white/80 leading-relaxed italic border-l-2 border-primary/30 pl-2 sm:pl-2.5 md:pl-3">
        {interpretation?.details || wind.explanation}
      </p>
    </div>
  );
};

export default WindCard;
