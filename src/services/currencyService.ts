export type SupportedCurrency = 'USD' | 'SAR' | 'AED';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  country: string;
  flagEmoji: string;
}

export interface ExchangeRate {
  baseCurrency: SupportedCurrency;
  targetCurrency: SupportedCurrency;
  rate: number;
  lastUpdated: Date;
}

export interface ExchangeRateResponse {
  success: boolean;
  rates: {
    [key: string]: number;
  };
  base: string;
  date: string;
}

// Supported currencies with their information
export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    flagEmoji: '🇺🇸'
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    name: 'Saudi Riyal',
    country: 'Saudi Arabia',
    flagEmoji: '🇸🇦'
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    flagEmoji: '🇦🇪'
  }
};

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  'US': 'USD',
  'USA': 'USD',
  'United States': 'USD',
  'SA': 'SAR',
  'SAU': 'SAR',
  'Saudi Arabia': 'SAR',
  'AE': 'AED',
  'ARE': 'AED',
  'UAE': 'AED',
  'United Arab Emirates': 'AED'
};

class CurrencyService {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly API_URL = 'https://api.exchangerate-api.io/v4/latest';
  private readonly FALLBACK_API_URL = 'https://api.fixer.io/latest';

  /**
   * Get current exchange rates from cache or fetch new ones
   */
  async getExchangeRates(baseCurrency: SupportedCurrency = 'USD'): Promise<Map<string, ExchangeRate>> {
    const cacheKey = `rates_${baseCurrency}`;
    const cached = this.exchangeRates.get(cacheKey);

    // Check if cache is still valid
    if (cached && this.isCacheValid(cached.lastUpdated)) {
      return this.exchangeRates;
    }

    // Fetch new rates
    try {
      await this.fetchExchangeRates(baseCurrency);
    } catch (error) {
      console.warn('Failed to fetch exchange rates, using cached or fallback rates');
      // If we have any cached rates, use them even if expired
      if (cached) {
        return this.exchangeRates;
      }
      // Use fallback static rates
      this.setFallbackRates(baseCurrency);
    }

    return this.exchangeRates;
  }

  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(
    amount: number,
    fromCurrency: SupportedCurrency,
    toCurrency: SupportedCurrency
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    await this.getExchangeRates(fromCurrency);
    
    const rateKey = `${fromCurrency}_${toCurrency}`;
    const rate = this.exchangeRates.get(rateKey);
    
    if (!rate) {
      console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}, using fallback`);
      return amount * this.getFallbackRate(fromCurrency, toCurrency);
    }

    return amount * rate.rate;
  }

  /**
   * Format currency amount with proper symbol and locale
   */
  formatCurrency(
    amount: number,
    currency: SupportedCurrency,
    locale?: string
  ): string {
    const currencyInfo = SUPPORTED_CURRENCIES[currency];
    
    // Determine locale based on currency if not provided
    const formatLocale = locale || this.getLocaleForCurrency(currency);
    
    try {
      return new Intl.NumberFormat(formatLocale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback to manual formatting if Intl fails
      return `${currencyInfo.symbol}${amount.toFixed(2)}`;
    }
  }

  /**
   * Get currency info by currency code
   */
  getCurrencyInfo(currency: SupportedCurrency): CurrencyInfo {
    return SUPPORTED_CURRENCIES[currency];
  }

  /**
   * Get currency by country code
   */
  getCurrencyByCountry(countryCode: string): SupportedCurrency {
    const upperCountryCode = countryCode.toUpperCase();
    return COUNTRY_CURRENCY_MAP[upperCountryCode] || 'USD';
  }

  /**
   * Get all supported currencies
   */
  getSupportedCurrencies(): CurrencyInfo[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }

  /**
   * Fetch exchange rates from API
   */
  private async fetchExchangeRates(baseCurrency: SupportedCurrency): Promise<void> {
    const url = `${this.API_URL}/${baseCurrency}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ExchangeRateResponse = await response.json();
      
      if (!data.success && !data.rates) {
        throw new Error('Invalid response format');
      }

      this.updateExchangeRates(baseCurrency, data.rates);
    } catch (error) {
      console.error('Primary API failed, trying fallback:', error);
      await this.fetchFromFallbackAPI(baseCurrency);
    }
  }

  /**
   * Fetch from fallback API
   */
  private async fetchFromFallbackAPI(baseCurrency: SupportedCurrency): Promise<void> {
    const url = `${this.FALLBACK_API_URL}?base=${baseCurrency}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fallback API error! status: ${response.status}`);
    }
    
    const data = await response.json();
    this.updateExchangeRates(baseCurrency, data.rates);
  }

  /**
   * Update exchange rates in cache
   */
  private updateExchangeRates(baseCurrency: SupportedCurrency, rates: Record<string, number>): void {
    const now = new Date();
    
    Object.entries(rates).forEach(([targetCurrency, rate]) => {
      if (this.isSupportedCurrency(targetCurrency as SupportedCurrency)) {
        const rateKey = `${baseCurrency}_${targetCurrency}`;
        this.exchangeRates.set(rateKey, {
          baseCurrency,
          targetCurrency: targetCurrency as SupportedCurrency,
          rate,
          lastUpdated: now
        });
      }
    });
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(lastUpdated: Date): boolean {
    return Date.now() - lastUpdated.getTime() < this.CACHE_DURATION;
  }

  /**
   * Set fallback static rates when API fails
   */
  private setFallbackRates(baseCurrency: SupportedCurrency): void {
    const fallbackRates = this.getFallbackRatesTable();
    const now = new Date();

    Object.entries(fallbackRates[baseCurrency] || {}).forEach(([targetCurrency, rate]) => {
      const rateKey = `${baseCurrency}_${targetCurrency}`;
      this.exchangeRates.set(rateKey, {
        baseCurrency,
        targetCurrency: targetCurrency as SupportedCurrency,
        rate,
        lastUpdated: now
      });
    });
  }

  /**
   * Get fallback exchange rates (static)
   */
  private getFallbackRatesTable(): Record<SupportedCurrency, Record<string, number>> {
    return {
      USD: {
        SAR: 3.75,  // USD to SAR (fixed rate)
        AED: 3.67,  // USD to AED (fixed rate)
        USD: 1.0
      },
      SAR: {
        USD: 0.27,  // SAR to USD
        AED: 0.98,  // SAR to AED
        SAR: 1.0
      },
      AED: {
        USD: 0.27,  // AED to USD
        SAR: 1.02,  // AED to SAR
        AED: 1.0
      }
    };
  }

  /**
   * Get fallback rate between two currencies
   */
  private getFallbackRate(fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number {
    const fallbackRates = this.getFallbackRatesTable();
    return fallbackRates[fromCurrency]?.[toCurrency] || 1.0;
  }

  /**
   * Get appropriate locale for currency formatting
   */
  private getLocaleForCurrency(currency: SupportedCurrency): string {
    const localeMap: Record<SupportedCurrency, string> = {
      USD: 'en-US',
      SAR: 'ar-SA',
      AED: 'ar-AE'
    };
    return localeMap[currency] || 'en-US';
  }

  /**
   * Check if currency is supported
   */
  private isSupportedCurrency(currency: string): currency is SupportedCurrency {
    return currency in SUPPORTED_CURRENCIES;
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();