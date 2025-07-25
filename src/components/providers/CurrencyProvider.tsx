import { useEffect } from 'react';
import { useCurrency } from '@/stores/currency';

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const { initialize, detectUserLocation } = useCurrency();

  useEffect(() => {
    // Initialize currency system and auto-detect location on app start
    const initializeCurrency = async () => {
      try {
        await initialize();
        // Force location detection to automatically set currency
        await detectUserLocation();
      } catch (error) {
        console.warn('Currency initialization failed:', error);
      }
    };

    initializeCurrency();
  }, [initialize, detectUserLocation]);

  return <>{children}</>;
};