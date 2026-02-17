import React from 'react';
import type { Precipitation } from '../../types/weather.types';
import type { Interpretation } from '../../types/interpretation.types';

interface PrecipitationCardProps {
  precipitation: Precipitation;
  interpretation?: Interpretation;
}

const PrecipitationCard: React.FC<PrecipitationCardProps> = ({ precipitation, interpretation }) => {
  return (
    <div className="glass p-3 sm:p-3.5 md:p-4 lg:p-5 rounded-xl sm:rounded-2xl flex flex-col gap-2.5 sm:gap-3 md:gap-4 hover-lift">
      <div className="flex items-center gap-1.5 sm:gap-2 text-primary">
        <span className="material-symbols-outlined text-base sm:text-lg md:text-xl text-cyan-400">rainy</span>
        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em]">
          Precipitation
        </span>
      </div>
      <div>
        <span className="text-xl sm:text-2xl md:text-3xl font-bold">{precipitation.probability}%</span>
      </div>
      <p className="text-[10px] sm:text-[11px] md:text-xs leading-relaxed text-white/60">
        {interpretation?.details || precipitation.explanation}
      </p>
    </div>
  );
};

export default PrecipitationCard;
