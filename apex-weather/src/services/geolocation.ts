// ============================================================================
// SMART GEOLOCATION SERVICE
// Multi-layer fallback: Browser → Last Search → IP → Force Search
// ============================================================================

import type { GeolocationCoords, IPLocationResponse } from '../types/interpretation.types';

const LAST_LOCATION_KEY = 'last_location';

interface StoredLocation {
  lat: number;
  lng: number;
  city: string;
  timestamp: number;
}

/**
 * Get user location using smart fallback chain
 * @returns coordinates or null if all methods fail
 */
export async function getSmartLocation(): Promise<GeolocationCoords | null> {
  // Layer 1: Browser Geolocation API
  try {
    const coords = await getBrowserGeolocation();
    if (coords) {
      saveLastLocation(coords.latitude, coords.longitude, 'Current Location');
      return coords;
    }
  } catch (error) {
    console.log('Browser geolocation denied or unavailable');
  }
  
  // Layer 2: Last searched city
  const lastLocation = getLastLocation();
  if (lastLocation) {
    console.log('Using last searched location:', lastLocation.city);
    return {
      latitude: lastLocation.lat,
      longitude: lastLocation.lng
    };
  }
  
  // Layer 3: IP-based geolocation
  try {
    const ipLocation = await getIPLocation();
    if (ipLocation) {
      saveLastLocation(ipLocation.latitude, ipLocation.longitude, ipLocation.city);
      return {
        latitude: ipLocation.latitude,
        longitude: ipLocation.longitude
      };
    }
  } catch (error) {
    console.log('IP geolocation failed');
  }
  
  // Layer 4: All failed - return null, caller should show search modal
  return null;
}

/**
 * Get browser geolocation
 */
function getBrowserGeolocation(): Promise<GeolocationCoords | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    const timeout = setTimeout(() => {
      resolve(null);
    }, 5000); // 5 second timeout
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        clearTimeout(timeout);
        console.log('Geolocation error:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Get location from IP address using ipapi.co
 */
async function getIPLocation(): Promise<IPLocationResponse | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || 'Unknown',
        country: data.country_name || 'Unknown'
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Save last successful location to localStorage
 */
export function saveLastLocation(lat: number, lng: number, city: string, country?: string): void {
  const location: StoredLocation = {
    lat,
    lng,
    city,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save last location:', error);
  }
}

/**
 * Get last searched location from localStorage
 */
function getLastLocation(): StoredLocation | null {
  try {
    const stored = localStorage.getItem(LAST_LOCATION_KEY);
    if (!stored) {
      return null;
    }
    
    const location: StoredLocation = JSON.parse(stored);
    
    // Use last location if less than 24 hours old
    const age = Date.now() - location.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (age > maxAge) {
      return null;
    }
    
    return location;
  } catch {
    return null;
  }
}

/**
 * Get last searched city name (for UI display)
 */
export function getLastLocationCity(): string | null {
  const location = getLastLocation();
  return location?.city || null;
}
