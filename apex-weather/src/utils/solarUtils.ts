// ============================================================================
// SOLAR UTILITIES
// Calculate sun position and format solar times
// ============================================================================

/**
 * Format Unix timestamp to 12-hour time string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted time string (e.g., "06:12 AM")
 */
export function formatSolarTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Calculate current sun position on arc (0-100)
 * Returns position of sun between sunrise and sunset
 * @param sunrise - Unix timestamp in seconds
 * @param sunset - Unix timestamp in seconds
 * @param currentTime - Current time in milliseconds (Date.now())
 * @returns Position percentage (0-100) where 0 is sunrise and 100 is sunset
 */
export function calculateSunPosition(
  sunrise: number,
  sunset: number,
  currentTime: number = Date.now()
): number {
  const now = currentTime / 1000; // Convert to seconds
  
  // Before sunrise - position at 0
  if (now < sunrise) {
    return 0;
  }
  
  // After sunset - position at 100
  if (now > sunset) {
    return 100;
  }
  
  // During daylight - calculate position
  const dayLength = sunset - sunrise;
  const elapsed = now - sunrise;
  const position = (elapsed / dayLength) * 100;
  
  return Math.round(position);
}

/**
 * Check if it's currently daytime
 * @param sunrise - Unix timestamp in seconds
 * @param sunset - Unix timestamp in seconds
 * @param currentTime - Current time in milliseconds (Date.now())
 * @returns true if current time is between sunrise and sunset
 */
export function isDaytime(
  sunrise: number,
  sunset: number,
  currentTime: number = Date.now()
): boolean {
  const now = currentTime / 1000;
  return now >= sunrise && now <= sunset;
}
