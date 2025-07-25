import { SupportedCurrency, COUNTRY_CURRENCY_MAP, currencyService } from './currencyService';

export interface LocationInfo {
  country: string;
  countryCode: string;
  currency: SupportedCurrency;
  city?: string;
  region?: string;
  ip?: string;
  timezone?: string;
}

export interface IPApiResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  timezone: string;
  query: string;
}

export interface IPInfoResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  timezone: string;
}

class GeoLocationService {
  private locationCache: LocationInfo | null = null;
  private readonly CACHE_KEY = 'attiry_user_location';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly IP_API_URL = 'http://ip-api.com/json';
  private readonly FALLBACK_API_URL = 'https://ipapi.co/json';

  /**
   * Get user's location and currency preference
   */
  async getUserLocation(): Promise<LocationInfo> {
    // Check cache first
    const cached = this.getCachedLocation();
    if (cached && this.isCacheValid(cached)) {
      this.locationCache = cached;
      return cached;
    }

    // Try to detect location
    try {
      const location = await this.detectLocation();
      this.cacheLocation(location);
      this.locationCache = location;
      return location;
    } catch (error) {
      console.warn('Location detection failed, using default:', error);
      const defaultLocation = this.getDefaultLocation();
      this.locationCache = defaultLocation;
      return defaultLocation;
    }
  }

  /**
   * Get currency based on user's location
   */
  async getUserCurrency(): Promise<SupportedCurrency> {
    const location = await this.getUserLocation();
    return location.currency;
  }

  /**
   * Manually set user location (for user preference override)
   */
  setUserLocation(countryCode: string, currency?: SupportedCurrency): LocationInfo {
    const detectedCurrency = currency || currencyService.getCurrencyByCountry(countryCode);
    const location: LocationInfo = {
      country: this.getCountryName(countryCode),
      countryCode: countryCode.toUpperCase(),
      currency: detectedCurrency,
      city: 'Unknown',
      region: 'Unknown'
    };

    this.cacheLocation(location);
    this.locationCache = location;
    return location;
  }

  /**
   * Clear cached location (force re-detection)
   */
  clearLocationCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(`${this.CACHE_KEY}_timestamp`);
    this.locationCache = null;
  }

  /**
   * Get supported countries
   */
  getSupportedCountries(): Array<{ code: string; name: string; currency: SupportedCurrency }> {
    return [
      { code: 'US', name: 'United States', currency: 'USD' },
      { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
      { code: 'AE', name: 'United Arab Emirates', currency: 'AED' }
    ];
  }

  /**
   * Check if country is supported
   */
  isCountrySupported(countryCode: string): boolean {
    return countryCode.toUpperCase() in COUNTRY_CURRENCY_MAP;
  }

  /**
   * Detect user location using IP geolocation
   */
  private async detectLocation(): Promise<LocationInfo> {
    // Try browser geolocation first (if available and user permits)
    try {
      const browserLocation = await this.tryBrowserGeolocation();
      if (browserLocation) {
        return browserLocation;
      }
    } catch (error) {
      console.log('Browser geolocation not available or denied');
    }

    // Fall back to IP-based detection
    return await this.detectLocationByIP();
  }

  /**
   * Try to use browser's geolocation API
   */
  private async tryBrowserGeolocation(): Promise<LocationInfo | null> {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding to get country from coordinates
            const location = await this.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve(location);
          } catch (error) {
            resolve(null);
          }
        },
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }

  /**
   * Reverse geocode coordinates to get country
   */
  private async reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const countryCode = data.countryCode || 'US';
    const currency = currencyService.getCurrencyByCountry(countryCode);
    
    return {
      country: data.countryName || 'United States',
      countryCode,
      currency,
      city: data.city || 'Unknown',
      region: data.principalSubdivision || 'Unknown'
    };
  }

  /**
   * Detect location using IP geolocation APIs
   */
  private async detectLocationByIP(): Promise<LocationInfo> {
    try {
      // Try primary API
      return await this.fetchFromIPAPI();
    } catch (error) {
      console.warn('Primary IP API failed, trying fallback:', error);
      try {
        // Try fallback API
        return await this.fetchFromFallbackAPI();
      } catch (fallbackError) {
        console.warn('Fallback IP API failed:', fallbackError);
        throw new Error('All IP geolocation APIs failed');
      }
    }
  }

  /**
   * Fetch location from primary IP API
   */
  private async fetchFromIPAPI(): Promise<LocationInfo> {
    const response = await fetch(`${this.IP_API_URL}?fields=status,country,countryCode,region,regionName,city,timezone,query`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: IPApiResponse = await response.json();
    
    if (data.status !== 'success') {
      throw new Error('IP API returned error status');
    }

    const currency = currencyService.getCurrencyByCountry(data.countryCode);
    
    return {
      country: data.country,
      countryCode: data.countryCode,
      currency,
      city: data.city,
      region: data.regionName,
      ip: data.query,
      timezone: data.timezone
    };
  }

  /**
   * Fetch location from fallback API
   */
  private async fetchFromFallbackAPI(): Promise<LocationInfo> {
    const response = await fetch(this.FALLBACK_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: IPInfoResponse = await response.json();
    
    const currency = currencyService.getCurrencyByCountry(data.country);
    
    return {
      country: this.getCountryName(data.country),
      countryCode: data.country,
      currency,
      city: data.city,
      region: data.region,
      ip: data.ip,
      timezone: data.timezone
    };
  }

  /**
   * Cache location information
   */
  private cacheLocation(location: LocationInfo): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(location));
      localStorage.setItem(`${this.CACHE_KEY}_timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache location:', error);
    }
  }

  /**
   * Get cached location information
   */
  private getCachedLocation(): LocationInfo | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      const timestamp = localStorage.getItem(`${this.CACHE_KEY}_timestamp`);
      
      if (!cached || !timestamp) {
        return null;
      }

      const cacheTime = parseInt(timestamp);
      if (Date.now() - cacheTime > this.CACHE_DURATION) {
        return null;
      }

      return JSON.parse(cached);
    } catch (error) {
      console.warn('Failed to read cached location:', error);
      return null;
    }
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(location: LocationInfo): boolean {
    try {
      const timestamp = localStorage.getItem(`${this.CACHE_KEY}_timestamp`);
      if (!timestamp) return false;
      
      const cacheTime = parseInt(timestamp);
      return Date.now() - cacheTime < this.CACHE_DURATION;
    } catch {
      return false;
    }
  }

  /**
   * Get default location when detection fails
   */
  private getDefaultLocation(): LocationInfo {
    return {
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      city: 'Unknown',
      region: 'Unknown'
    };
  }

  /**
   * Get full country name from country code
   */
  private getCountryName(countryCode: string): string {
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'USA': 'United States',
      'SA': 'Saudi Arabia',
      'SAU': 'Saudi Arabia',
      'AE': 'United Arab Emirates',
      'ARE': 'United Arab Emirates',
      'UAE': 'United Arab Emirates'
    };
    
    return countryNames[countryCode.toUpperCase()] || countryCode;
  }
}

// Export singleton instance
export const geoLocationService = new GeoLocationService();