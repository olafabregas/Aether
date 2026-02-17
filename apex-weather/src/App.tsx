import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroWeather from './components/HeroWeather';
import WeatherSummaryCard from './components/WeatherSummaryCard';
import HourlyTimeline from './components/HourlyTimeline';
import MetricsGrid from './components/MetricsGrid';
import ForecastCard from './components/ForecastCard';
import ErrorBanner from './components/ErrorBanner';
import SearchModal from './components/SearchModal';
import AboutModal from './components/AboutModal';
import { useWeather } from './hooks/useWeather';
import { mockWeatherData } from './data/mockWeatherData';

function App() {
  const { interpretation, snapshot, loading, error, retry, searchCity } = useWeather();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [dismissedError, setDismissedError] = useState(false);

  // Handle loading state
  if (loading && !snapshot) {
    return (
      <div className="font-display text-white antialiased min-h-screen flex items-center justify-center px-3 sm:px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base md:text-lg text-white/70">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // If we have no data and critical error, show search-only UI
  if (!snapshot && error?.type === 'LOCATION_DENIED') {
    return (
      <div className="font-display text-white antialiased min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="glass-glow rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-w-md text-center">
          <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-primary mb-3 sm:mb-4 block">
            location_searching
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Location Required</h2>
          <p className="text-xs sm:text-sm md:text-base text-white/70 mb-4 sm:mb-5 md:mb-6">
            Please search for a city to view weather data
          </p>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-primary text-black font-bold rounded-lg sm:rounded-xl hover:bg-primary/90 transition-all text-xs sm:text-sm md:text-base"
          >
            Search City
          </button>
        </div>
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectCity={searchCity}
        />
      </div>
    );
  }

  // Use snapshot data if available, otherwise fall back to mock for UI structure
  const displayLocation = snapshot?.location || mockWeatherData.location;
  const displayCurrent = snapshot
    ? {
        temp: snapshot.temperature,
        feelsLike: snapshot.feelsLike,
        condition: interpretation?.temperature.message || snapshot.condition,
        description: interpretation?.humidity.message || 'Loading...',
        timestamp: new Date(snapshot.timestamp).toISOString()
      }
    : mockWeatherData.current;

  return (
    <div className="font-display text-white antialiased">
      <Navbar
        location={displayLocation}
        onRefresh={retry}
        onSearchClick={() => setSearchModalOpen(true)}
        onAboutClick={() => setAboutModalOpen(true)}
      />

      {/* Error Banner */}
      {error && !dismissedError && (
        <ErrorBanner
          error={error}
          onRetry={retry}
          onDismiss={() => setDismissedError(true)}
          onSearch={() => setSearchModalOpen(true)}
        />
      )}

      <main className="px-3 sm:px-5 md:px-6 pb-10 sm:pb-12 max-w-full sm:max-w-md md:max-w-lg mx-auto">
        {/* Key triggers re-animation when location changes */}
        <div key={`${displayLocation.lat}-${displayLocation.lng}`}>
          <HeroWeather
            current={displayCurrent}
            interpretation={interpretation}
          />
          
          {/* Weather Summary Card - Overview of all interpretations */}
          {interpretation && (
            <WeatherSummaryCard interpretation={interpretation} />
          )}
          
          {/* Use real forecast data from snapshot */}
          <HourlyTimeline 
            hourly={snapshot?.hourlyForecast || mockWeatherData.hourly} 
          />
          
          <MetricsGrid
            weatherData={snapshot || mockWeatherData}
            interpretation={interpretation}
          />
          
          <ForecastCard 
            forecast={snapshot?.dailyForecast || mockWeatherData.forecast} 
          />
        </div>
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCity={searchCity}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}

export default App;
