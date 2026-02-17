import React from 'react';
import type { CurrentWeather } from '../types/weather.types';
import type { WeatherInterpretation } from '../types/interpretation.types';

interface HeroWeatherProps {
  current: CurrentWeather;
  interpretation?: WeatherInterpretation | null;
}

const HeroWeather: React.FC<HeroWeatherProps> = ({ current, interpretation }) => {
  const tempMessage = interpretation?.temperature.message || current.condition;
  const humidityMessage = interpretation?.humidity.message || current.description;
  
  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12 flex flex-col items-center text-center animate-fade-in">
      <h1 className="text-[72px] sm:text-[90px] md:text-[110px] lg:text-[120px] leading-none font-bold text-cyan-400 tracking-tighter text-glow">
        {current.temp}°
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/70 mt-2 sm:mt-3 md:mt-4">
        Feels like {current.feelsLike}°C
      </p>
      <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 glass rounded-full flex items-center gap-2 sm:gap-2.5 md:gap-3 max-w-[92vw] sm:max-w-[85vw]">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] flex-shrink-0"></span>
        <p className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase truncate">
          {tempMessage} · {humidityMessage}
        </p>
      </div>
    </section>
  );
};

export default HeroWeather;
