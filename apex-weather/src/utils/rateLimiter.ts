// ============================================================================
// CLIENT-SIDE RATE LIMITER
// Enforces 10 requests per rolling 60-second window
// ============================================================================

const RATE_LIMIT_KEY = 'weather_rate_limit';
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 60 seconds

interface RateLimitData {
  timestamps: number[];
}

/**
 * Check if a request can be made within rate limit
 * @returns true if request allowed, false if rate limited
 */
export function checkRateLimit(): boolean {
  const now = Date.now();
  
  // Get existing timestamps
  const data = getRateLimitData();
  
  // Clean old timestamps (older than 60 seconds)
  const validTimestamps = data.timestamps.filter(
    timestamp => now - timestamp < WINDOW_MS
  );
  
  // Check if limit exceeded
  if (validTimestamps.length >= MAX_REQUESTS) {
    // Save cleaned timestamps even when blocked
    saveRateLimitData({ timestamps: validTimestamps });
    return false;
  }
  
  // Add current timestamp
  validTimestamps.push(now);
  
  // Save updated timestamps
  saveRateLimitData({ timestamps: validTimestamps });
  
  return true;
}

/**
 * Get time until rate limit resets (in seconds)
 * @returns seconds until next request allowed, or 0 if allowed now
 */
export function getRetryAfter(): number {
  const now = Date.now();
  const data = getRateLimitData();
  
  // Clean old timestamps
  const validTimestamps = data.timestamps.filter(
    timestamp => now - timestamp < WINDOW_MS
  );
  
  if (validTimestamps.length < MAX_REQUESTS) {
    return 0;
  }
  
  // Find oldest timestamp
  const oldestTimestamp = Math.min(...validTimestamps);
  const resetTime = oldestTimestamp + WINDOW_MS;
  const secondsUntilReset = Math.ceil((resetTime - now) / 1000);
  
  return Math.max(0, secondsUntilReset);
}

/**
 * Reset rate limit (for testing/debugging)
 */
export function resetRateLimit(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}

// ============================================================================
// PRIVATE HELPERS
// ============================================================================

function getRateLimitData(): RateLimitData {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) {
      return { timestamps: [] };
    }
    
    const parsed = JSON.parse(stored);
    return {
      timestamps: Array.isArray(parsed.timestamps) ? parsed.timestamps : []
    };
  } catch {
    return { timestamps: [] };
  }
}

function saveRateLimitData(data: RateLimitData): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
}
