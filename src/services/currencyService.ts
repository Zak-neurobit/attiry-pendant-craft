export type SupportedCurrency = 'USD' | 'SAR' | 'AED' | 'INR' | 'QAR' | 'KWD' | 'CAD' | 'AUD' | 'OMR' | 'MYR' | 'MXN' | 'EGP' | 'TRY' | 'JPY';

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
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    country: 'India',
    flagEmoji: '🇮🇳'
  },
  QAR: {
    code: 'QAR',
    symbol: 'ر.ق',
    name: 'Qatari Riyal',
    country: 'Qatar',
    flagEmoji: '🇶🇦'
  },
  KWD: {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    country: 'Kuwait',
    flagEmoji: '🇰🇼'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    country: 'Canada',
    flagEmoji: '🇨🇦'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    flagEmoji: '🇦🇺'
  },
  OMR: {
    code: 'OMR',
    symbol: 'ر.ع.',
    name: 'Omani Rial',
    country: 'Oman',
    flagEmoji: '🇴🇲'
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    country: 'Malaysia',
    flagEmoji: '🇲🇾'
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    country: 'Mexico',
    flagEmoji: '🇲🇽'
  },
  EGP: {
    code: 'EGP',
    symbol: 'ج.م',
    name: 'Egyptian Pound',
    country: 'Egypt',
    flagEmoji: '🇪🇬'
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    country: 'Turkey',
    flagEmoji: '🇹🇷'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    country: 'Japan',
    flagEmoji: '🇯🇵'
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
  'United Arab Emirates': 'AED',
  'IN': 'INR',
  'IND': 'INR',
  'India': 'INR',
  'QA': 'QAR',
  'QAT': 'QAR',
  'Qatar': 'QAR',
  'KW': 'KWD',
  'KWT': 'KWD',
  'Kuwait': 'KWD',
  'CA': 'CAD',
  'CAN': 'CAD',
  'Canada': 'CAD',
  'AU': 'AUD',
  'AUS': 'AUD',
  'Australia': 'AUD',
  'OM': 'OMR',
  'OMN': 'OMR',
  'Oman': 'OMR',
  'MY': 'MYR',
  'MYS': 'MYR',
  'Malaysia': 'MYR',
  'MX': 'MXN',
  'MEX': 'MXN',
  'Mexico': 'MXN',
  'EG': 'EGP',
  'EGY': 'EGP',
  'Egypt': 'EGP',
  'TR': 'TRY',
  'TUR': 'TRY',
  'Turkey': 'TRY',
  'JP': 'JPY',
  'JPN': 'JPY',
  'Japan': 'JPY'
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
    toCurrency: SupportedCurrency,
    _forTesting_useCachedRates = false // This flag is ONLY for tests
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // In production, this flag is false, so we always get latest rates.
    // In tests, we'll set it to true to use our mock rates.
    if (!_forTesting_useCachedRates) {
      await this.getExchangeRates(fromCurrency);
    }
    
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
   * (For Testing Only) Manually set exchange rates to bypass API calls in tests.
   */
  setExchangeRatesForTesting(rates: Record<string, number>, baseCurrency: SupportedCurrency = 'USD'): void {
    this.updateExchangeRates(baseCurrency, rates);
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
   * Get fallback exchange rates (static) - Updated January 2025
   */
  private getFallbackRatesTable(): Record<SupportedCurrency, Record<string, number>> {
    return {
      USD: {
        SAR: 3.75,   // USD to SAR (fixed rate)
        AED: 3.67,   // USD to AED (fixed rate) 
        INR: 84.50,  // USD to INR
        QAR: 3.64,   // USD to QAR (fixed rate)
        KWD: 0.31,   // USD to KWD
        CAD: 1.44,   // USD to CAD
        AUD: 1.62,   // USD to AUD
        OMR: 0.38,   // USD to OMR (fixed rate)
        MYR: 4.48,   // USD to MYR
        MXN: 20.25,  // USD to MXN
        EGP: 50.80,  // USD to EGP
        TRY: 35.20,  // USD to TRY
        JPY: 156.50, // USD to JPY
        USD: 1.0
      },
      SAR: {
        USD: 0.27,   // SAR to USD
        AED: 0.98,   // SAR to AED
        INR: 22.53,  // SAR to INR
        QAR: 0.97,   // SAR to QAR
        KWD: 0.082,  // SAR to KWD
        CAD: 0.38,   // SAR to CAD
        AUD: 0.43,   // SAR to AUD
        OMR: 0.10,   // SAR to OMR
        MYR: 1.19,   // SAR to MYR
        MXN: 5.40,   // SAR to MXN
        EGP: 13.55,  // SAR to EGP
        TRY: 9.39,   // SAR to TRY
        JPY: 41.73,  // SAR to JPY
        SAR: 1.0
      },
      AED: {
        USD: 0.27,   // AED to USD
        SAR: 1.02,   // AED to SAR
        INR: 23.03,  // AED to INR
        QAR: 0.99,   // AED to QAR
        KWD: 0.084,  // AED to KWD
        CAD: 0.39,   // AED to CAD
        AUD: 0.44,   // AED to AUD
        OMR: 0.10,   // AED to OMR
        MYR: 1.22,   // AED to MYR
        MXN: 5.52,   // AED to MXN
        EGP: 13.84,  // AED to EGP
        TRY: 9.59,   // AED to TRY
        JPY: 42.66,  // AED to JPY
        AED: 1.0
      },
      INR: {
        USD: 0.012,  // INR to USD
        SAR: 0.044,  // INR to SAR
        AED: 0.043,  // INR to AED
        QAR: 0.043,  // INR to QAR
        KWD: 0.0037, // INR to KWD
        CAD: 0.017,  // INR to CAD
        AUD: 0.019,  // INR to AUD
        OMR: 0.0045, // INR to OMR
        MYR: 0.053,  // INR to MYR
        MXN: 0.24,   // INR to MXN
        EGP: 0.60,   // INR to EGP
        TRY: 0.42,   // INR to TRY
        JPY: 1.85,   // INR to JPY
        INR: 1.0
      },
      QAR: {
        USD: 0.27,   // QAR to USD
        SAR: 1.03,   // QAR to SAR
        AED: 1.01,   // QAR to AED
        INR: 23.21,  // QAR to INR
        KWD: 0.085,  // QAR to KWD
        CAD: 0.40,   // QAR to CAD
        AUD: 0.45,   // QAR to AUD
        OMR: 0.10,   // QAR to OMR
        MYR: 1.23,   // QAR to MYR
        MXN: 5.56,   // QAR to MXN
        EGP: 13.96,  // QAR to EGP
        TRY: 9.67,   // QAR to TRY
        JPY: 43.01,  // QAR to JPY
        QAR: 1.0
      },
      KWD: {
        USD: 3.23,   // KWD to USD
        SAR: 12.10,  // KWD to SAR
        AED: 11.85,  // KWD to AED
        INR: 272.74, // KWD to INR
        QAR: 11.76,  // KWD to QAR
        CAD: 4.65,   // KWD to CAD
        AUD: 5.23,   // KWD to AUD
        OMR: 1.24,   // KWD to OMR
        MYR: 14.47,  // KWD to MYR
        MXN: 65.41,  // KWD to MXN
        EGP: 164.08, // KWD to EGP
        TRY: 113.70, // KWD to TRY
        JPY: 505.50, // KWD to JPY
        KWD: 1.0
      },
      CAD: {
        USD: 0.69,   // CAD to USD
        SAR: 2.61,   // CAD to SAR
        AED: 2.55,   // CAD to AED
        INR: 58.68,  // CAD to INR
        QAR: 2.53,   // CAD to QAR
        KWD: 0.22,   // CAD to KWD
        AUD: 1.13,   // CAD to AUD
        OMR: 0.27,   // CAD to OMR
        MYR: 3.11,   // CAD to MYR
        MXN: 14.06,  // CAD to MXN
        EGP: 35.28,  // CAD to EGP
        TRY: 24.44,  // CAD to TRY
        JPY: 108.68, // CAD to JPY
        CAD: 1.0
      },
      AUD: {
        USD: 0.62,   // AUD to USD
        SAR: 2.31,   // AUD to SAR
        AED: 2.27,   // AUD to AED
        INR: 52.16,  // AUD to INR
        QAR: 2.25,   // AUD to QAR
        KWD: 0.19,   // AUD to KWD
        CAD: 0.89,   // AUD to CAD
        OMR: 0.24,   // AUD to OMR
        MYR: 2.77,   // AUD to MYR
        MXN: 12.50,  // AUD to MXN
        EGP: 31.36,  // AUD to EGP
        TRY: 21.73,  // AUD to TRY
        JPY: 96.60,  // AUD to JPY
        AUD: 1.0
      },
      OMR: {
        USD: 2.60,   // OMR to USD
        SAR: 9.75,   // OMR to SAR
        AED: 9.54,   // OMR to AED
        INR: 219.70, // OMR to INR
        QAR: 9.46,   // OMR to QAR
        KWD: 0.81,   // OMR to KWD
        CAD: 3.74,   // OMR to CAD
        AUD: 4.21,   // OMR to AUD
        MYR: 11.65,  // OMR to MYR
        MXN: 52.65,  // OMR to MXN
        EGP: 132.08, // OMR to EGP
        TRY: 91.52,  // OMR to TRY
        JPY: 406.90, // OMR to JPY
        OMR: 1.0
      },
      MYR: {
        USD: 0.22,   // MYR to USD
        SAR: 0.84,   // MYR to SAR
        AED: 0.82,   // MYR to AED
        INR: 18.86,  // MYR to INR
        QAR: 0.81,   // MYR to QAR
        KWD: 0.069,  // MYR to KWD
        CAD: 0.32,   // MYR to CAD
        AUD: 0.36,   // MYR to AUD
        OMR: 0.086,  // MYR to OMR
        MXN: 4.52,   // MYR to MXN
        EGP: 11.34,  // MYR to EGP
        TRY: 7.86,   // MYR to TRY
        JPY: 34.93,  // MYR to JPY
        MYR: 1.0
      },
      MXN: {
        USD: 0.049,  // MXN to USD
        SAR: 0.19,   // MXN to SAR
        AED: 0.18,   // MXN to AED
        INR: 4.17,   // MXN to INR
        QAR: 0.18,   // MXN to QAR
        KWD: 0.015,  // MXN to KWD
        CAD: 0.071,  // MXN to CAD
        AUD: 0.080,  // MXN to AUD
        OMR: 0.019,  // MXN to OMR
        MYR: 0.22,   // MXN to MYR
        EGP: 2.51,   // MXN to EGP
        TRY: 1.74,   // MXN to TRY
        JPY: 7.73,   // MXN to JPY
        MXN: 1.0
      },
      EGP: {
        USD: 0.020,  // EGP to USD
        SAR: 0.074,  // EGP to SAR
        AED: 0.072,  // EGP to AED
        INR: 1.66,   // EGP to INR
        QAR: 0.072,  // EGP to QAR
        KWD: 0.0061, // EGP to KWD
        CAD: 0.028,  // EGP to CAD
        AUD: 0.032,  // EGP to AUD
        OMR: 0.0076, // EGP to OMR
        MYR: 0.088,  // EGP to MYR
        MXN: 0.40,   // EGP to MXN
        TRY: 0.69,   // EGP to TRY
        JPY: 3.08,   // EGP to JPY
        EGP: 1.0
      },
      TRY: {
        USD: 0.028,  // TRY to USD
        SAR: 0.11,   // TRY to SAR
        AED: 0.10,   // TRY to AED
        INR: 2.40,   // TRY to INR
        QAR: 0.10,   // TRY to QAR
        KWD: 0.0088, // TRY to KWD
        CAD: 0.041,  // TRY to CAD
        AUD: 0.046,  // TRY to AUD
        OMR: 0.011,  // TRY to OMR
        MYR: 0.13,   // TRY to MYR
        MXN: 0.58,   // TRY to MXN
        EGP: 1.44,   // TRY to EGP
        JPY: 4.45,   // TRY to JPY
        TRY: 1.0
      },
      JPY: {
        USD: 0.0064, // JPY to USD
        SAR: 0.024,  // JPY to SAR
        AED: 0.023,  // JPY to AED
        INR: 0.54,   // JPY to INR
        QAR: 0.023,  // JPY to QAR
        KWD: 0.0020, // JPY to KWD
        CAD: 0.0092, // JPY to CAD
        AUD: 0.010,  // JPY to AUD
        OMR: 0.0025, // JPY to OMR
        MYR: 0.029,  // JPY to MYR
        MXN: 0.13,   // JPY to MXN
        EGP: 0.32,   // JPY to EGP
        TRY: 0.22,   // JPY to TRY
        JPY: 1.0
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
      AED: 'ar-AE',
      INR: 'en-IN',
      QAR: 'ar-QA',
      KWD: 'ar-KW',
      CAD: 'en-CA',
      AUD: 'en-AU',
      OMR: 'ar-OM',
      MYR: 'ms-MY',
      MXN: 'es-MX',
      EGP: 'ar-EG',
      TRY: 'tr-TR',
      JPY: 'ja-JP'
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