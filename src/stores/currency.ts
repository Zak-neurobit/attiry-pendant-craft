import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupportedCurrency, currencyService, CurrencyInfo } from '@/services/currencyService';
import { geoLocationService, LocationInfo } from '@/services/geoLocationService';

interface CurrencyState {
  // Current state
  currentCurrency: SupportedCurrency;
  userLocation: LocationInfo | null;
  exchangeRates: Map<string, number>;
  lastRateUpdate: Date | null;
  isLoading: boolean;
  error: string | null;

  // Actions (automatic only - no manual currency setting for UI)
  detectUserLocation: () => Promise<void>;
  convertPrice: (amount: number, fromCurrency?: SupportedCurrency) => Promise<number>;
  formatPrice: (amount: number, currency?: SupportedCurrency) => string;
  refreshExchangeRates: () => Promise<void>;
  initialize: () => Promise<void>;
  
  // Internal actions (not for UI use)
  _setCurrency: (currency: SupportedCurrency) => void;
  _setUserLocation: (location: LocationInfo) => void;
  
  // Getters
  getCurrencyInfo: () => CurrencyInfo;
  getSupportedCurrencies: () => CurrencyInfo[];
  isDetectionInProgress: () => boolean;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCurrency: 'USD',
      userLocation: null,
      exchangeRates: new Map(),
      lastRateUpdate: null,
      isLoading: false,
      error: null,

      // Internal currency setter (automatic only)
      _setCurrency: (currency: SupportedCurrency) => {
        set({
          currentCurrency: currency,
          error: null
        });
        
        // Refresh exchange rates for new currency
        get().refreshExchangeRates();
      },

      // Internal location setter (automatic only)
      _setUserLocation: (location: LocationInfo) => {
        set({
          userLocation: location,
          currentCurrency: location.currency,
          error: null
        });
      },

      // Detect user's location and set currency accordingly
      detectUserLocation: async () => {
        console.log('💰 Starting currency detection...');
        set({ isLoading: true, error: null });
        
        try {
          const location = await geoLocationService.getUserLocation();
          console.log('💱 Setting currency based on location:', location);
          
          get()._setUserLocation(location);
          set({
            isLoading: false,
            error: null
          });

          console.log(`✅ Currency set to ${location.currency} for ${location.country}`);

          // Refresh exchange rates for detected currency
          await get().refreshExchangeRates();
        } catch (error) {
          console.error('❌ Failed to detect user location:', error);
          set({
            isLoading: false,
            error: 'Failed to detect location. Using default currency.'
          });
        }
      },

      // Convert price from base currency (USD) to current currency
      convertPrice: async (amount: number, fromCurrency: SupportedCurrency = 'USD'): Promise<number> => {
        const { currentCurrency } = get();
        
        if (fromCurrency === currentCurrency) {
          return amount;
        }
        
        console.log(`💸 Converting ${amount} ${fromCurrency} → ${currentCurrency}`);
        
        try {
          const convertedAmount = await currencyService.convertCurrency(
            amount,
            fromCurrency,
            currentCurrency
          );
          console.log(`✅ Conversion result: ${amount} ${fromCurrency} = ${convertedAmount} ${currentCurrency}`);
          return convertedAmount;
        } catch (error) {
          console.error('❌ Currency conversion failed:', error);
          console.warn(`🔄 Using original amount: ${amount} ${fromCurrency}`);
          return amount; // Return original amount if conversion fails
        }
      },

      // Format price with current currency
      formatPrice: (amount: number, currency?: SupportedCurrency): string => {
        const targetCurrency = currency || get().currentCurrency;
        return currencyService.formatCurrency(amount, targetCurrency);
      },

      // Refresh exchange rates
      refreshExchangeRates: async () => {
        const { currentCurrency } = get();
        
        try {
          set({ error: null });
          
          const rates = await currencyService.getExchangeRates(currentCurrency);
          const rateMap = new Map<string, number>();
          
          // Convert Map<string, ExchangeRate> to Map<string, number> for easier storage
          rates.forEach((exchangeRate, key) => {
            rateMap.set(key, exchangeRate.rate);
          });
          
          set({
            exchangeRates: rateMap,
            lastRateUpdate: new Date()
          });
        } catch (error) {
          console.error('Failed to refresh exchange rates:', error);
          set({
            error: 'Failed to update exchange rates. Using cached rates.'
          });
        }
      },

      // Initialize currency system
      initialize: async () => {
        set({ isLoading: true });
        
        try {
          // Check if user has a saved location preference
          const state = get();
          if (!state.userLocation) {
            // Detect user location if not set
            await get().detectUserLocation();
          } else {
            // Use saved location but refresh rates
            await get().refreshExchangeRates();
          }
        } catch (error) {
          console.error('Currency initialization failed:', error);
          set({
            error: 'Failed to initialize currency system.',
            isLoading: false
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Get current currency info
      getCurrencyInfo: (): CurrencyInfo => {
        const { currentCurrency } = get();
        return currencyService.getCurrencyInfo(currentCurrency);
      },

      // Get all supported currencies
      getSupportedCurrencies: (): CurrencyInfo[] => {
        return currencyService.getSupportedCurrencies();
      },

      // Check if detection is in progress
      isDetectionInProgress: (): boolean => {
        return get().isLoading;
      }
    }),
    {
      name: 'attiry-currency-storage',
      // Only persist essential user preferences
      partialize: (state) => ({
        currentCurrency: state.currentCurrency,
        userLocation: state.userLocation,
        lastRateUpdate: state.lastRateUpdate
      }),
      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize exchange rates on app start
          state.refreshExchangeRates();
        }
      }
    }
  )
);

// Helper hook for easier price formatting
export const usePrice = () => {
  const { formatPrice, convertPrice, currentCurrency } = useCurrency();
  
  return {
    formatPrice,
    convertPrice,
    currentCurrency,
    
    // Format and convert in one step
    formatConvertedPrice: async (amount: number, fromCurrency: SupportedCurrency = 'USD'): Promise<string> => {
      const convertedAmount = await convertPrice(amount, fromCurrency);
      return formatPrice(convertedAmount);
    }
  };
};