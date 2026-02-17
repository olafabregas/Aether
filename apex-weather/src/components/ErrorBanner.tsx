import React from 'react';
import type { WeatherError } from '../types/interpretation.types';

interface ErrorBannerProps {
  error: WeatherError;
  onRetry?: () => void;
  onDismiss?: () => void;
  onSearch?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry, onDismiss, onSearch }) => {
  const getBorderColor = (): string => {
    switch (error.type) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'border-l-yellow-500';
      case 'API_FAILURE':
      case 'NETWORK_ERROR':
      case 'INVALID_RESPONSE':
        return 'border-l-red-500';
      case 'LOCATION_DENIED':
      case 'NO_CACHE_AVAILABLE':
        return 'border-l-blue-500';
      default:
        return 'border-l-white/30';
    }
  };

  const getIcon = (): string => {
    switch (error.type) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'schedule';
      case 'LOCATION_DENIED':
        return 'location_off';
      case 'NETWORK_ERROR':
        return 'wifi_off';
      default:
        return 'error_outline';
    }
  };

  return (
    <div className={`glass mx-3 sm:mx-4 md:mx-5 lg:mx-6 mt-3 sm:mt-3.5 md:mt-4 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border-l-4 ${getBorderColor()}`}>
      <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
          <span className="material-symbols-outlined text-white/70 text-base sm:text-lg md:text-xl flex-shrink-0">
            {getIcon()}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs md:text-sm font-medium text-white mb-0.5 sm:mb-1">{error.message}</p>
            {error.retryAfter && error.retryAfter > 0 && (
              <p className="text-[10px] sm:text-[11px] md:text-xs text-white/60">
                Retry available in {error.retryAfter} seconds
              </p>
            )}
            {error.canUseCachedData && (
              <p className="text-[10px] sm:text-[11px] md:text-xs text-white/60 mt-0.5 sm:mt-1">
                Showing cached data
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
          {error.type === 'LOCATION_DENIED' && onSearch && (
            <button
              onClick={onSearch}
              className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] md:text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-all whitespace-nowrap"
            >
              Search City
            </button>
          )}
          
          {onRetry && error.type !== 'LOCATION_DENIED' && (
            <button
              onClick={onRetry}
              disabled={error.retryAfter ? error.retryAfter > 0 : false}
              className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] md:text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retry
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-xs sm:text-sm text-white/70">
                close
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;
