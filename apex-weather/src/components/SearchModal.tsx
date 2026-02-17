import React, { useState, useEffect, useRef } from 'react';
import type { CitySearchResult } from '../types/interpretation.types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (lat: number, lng: number, cityName: string) => void;
}

const RECENT_SEARCHES_KEY = 'recent_weather_searches';
const MAX_RECENT = 5;

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<number | undefined>(undefined);

  // Load recent searches
  useEffect(() => {
    if (isOpen) {
      loadRecentSearches();
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced autocomplete
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchCities(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      setRecentSearches([]);
    }
  };

  const saveRecentSearch = (city: CitySearchResult) => {
    try {
      const recent = recentSearches.filter(
        c => !(c.lat === city.lat && c.lon === city.lon)
      );
      recent.unshift(city);
      const updated = recent.slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const searchCities = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        const cities: CitySearchResult[] = data.map((item: any) => ({
          name: item.name,
          country: item.country,
          state: item.state,
          lat: item.lat,
          lon: item.lon
        }));
        setResults(cities);
        setSelectedIndex(0);
      }
    } catch (error) {
      console.error('City search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (city: CitySearchResult) => {
    saveRecentSearch(city);
    const cityName = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    onSelectCity(city.lat, city.lon, cityName);
    setQuery('');
    setResults([]);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = results.length > 0 ? results : recentSearches;
    
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && list.length > 0) {
      e.preventDefault();
      handleSelectCity(list[selectedIndex]);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      onSelectCity(
        position.coords.latitude,
        position.coords.longitude,
        'Current Location'
      );
      onClose();
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  };

  if (!isOpen) return null;

  const displayList = results.length > 0 ? results : recentSearches;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="glass-glow rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 w-full max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative mb-3 sm:mb-4">
          <span className="material-symbols-outlined absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-white/50 text-base sm:text-lg md:text-xl">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {loading && (
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin">
              progress_activity
            </span>
          )}
        </div>

        {/* Results / Recent Searches */}
        {displayList.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/40 mb-1.5 sm:mb-2 px-1 sm:px-2">
              {results.length > 0 ? 'Results' : 'Recent Searches'}
            </p>
            <div className="space-y-1 sm:space-y-1.5">
              {displayList.map((city, index) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  onClick={() => handleSelectCity(city)}
                  className={`w-full text-left px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-all flex items-center gap-2 sm:gap-2.5 md:gap-3 ${
                    index === selectedIndex
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl flex-shrink-0">
                    {results.length > 0 ? 'location_city' : 'history'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm sm:text-base truncate">{city.name}</div>
                    <div className="text-[11px] sm:text-xs text-white/50 truncate">
                      {city.state ? `${city.state}, ${city.country}` : city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Use Current Location */}
        <button
          onClick={handleUseCurrentLocation}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 glass rounded-lg sm:rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-white/90"
        >
          <span className="material-symbols-outlined text-primary text-lg sm:text-xl">my_location</span>
          <span className="font-medium text-sm sm:text-base">Use Current Location</span>
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
