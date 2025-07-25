import { useState, useEffect, useCallback } from 'react';
import { useCurrency } from '@/stores/currency';
import { SupportedCurrency } from '@/services/currencyService';

interface UsePriceOptions {
  fromCurrency?: SupportedCurrency;
  showOriginalPrice?: boolean;
  precision?: number;
}

interface PriceResult {
  formattedPrice: string;
  convertedAmount: number;
  originalAmount: number;
  currency: SupportedCurrency;
  isLoading: boolean;
  error: string | null;
}

/**
 * Enhanced price formatting hook with currency conversion
 * This replaces all individual formatPrice functions across components
 */
export const usePrice = (amount: number, options: UsePriceOptions = {}) => {
  const {
    fromCurrency = 'USD',
    showOriginalPrice = false,
    precision = 2
  } = options;

  const {
    formatPrice,
    convertPrice,
    currentCurrency,
    isDetectionInProgress
  } = useCurrency();

  const [priceResult, setPriceResult] = useState<PriceResult>({
    formattedPrice: '',
    convertedAmount: amount,
    originalAmount: amount,
    currency: currentCurrency,
    isLoading: true,
    error: null
  });

  const calculatePrice = useCallback(async () => {
    try {
      setPriceResult(prev => ({ ...prev, isLoading: true, error: null }));

      let convertedAmount = amount;
      
      // Convert currency if needed
      if (fromCurrency !== currentCurrency) {
        convertedAmount = await convertPrice(amount, fromCurrency);
      }

      // Round to specified precision
      convertedAmount = Math.round(convertedAmount * Math.pow(10, precision)) / Math.pow(10, precision);

      // Format the price
      const formattedPrice = formatPrice(convertedAmount, currentCurrency);

      setPriceResult({
        formattedPrice,
        convertedAmount,
        originalAmount: amount,
        currency: currentCurrency,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Price calculation failed:', error);
      
      // Fallback to original amount with current currency formatting
      const fallbackPrice = formatPrice(amount, currentCurrency);
      
      setPriceResult({
        formattedPrice: fallbackPrice,
        convertedAmount: amount,
        originalAmount: amount,
        currency: currentCurrency,
        isLoading: false,
        error: 'Price conversion failed'
      });
    }
  }, [amount, fromCurrency, currentCurrency, convertPrice, formatPrice, precision]);

  useEffect(() => {
    if (!isDetectionInProgress()) {
      calculatePrice();
    }
  }, [calculatePrice, isDetectionInProgress]);

  return priceResult;
};

/**
 * Simple price formatter hook for components that don't need conversion
 */
export const useSimplePrice = (amount: number, currency?: SupportedCurrency) => {
  const { formatPrice, currentCurrency } = useCurrency();
  
  const targetCurrency = currency || currentCurrency;
  
  return {
    formattedPrice: formatPrice(amount, targetCurrency),
    currency: targetCurrency
  };
};

/**
 * Hook for displaying price ranges (min - max)
 */
export const usePriceRange = (
  minAmount: number,
  maxAmount: number,
  options: UsePriceOptions = {}
) => {
  const minPrice = usePrice(minAmount, options);
  const maxPrice = usePrice(maxAmount, options);

  const formatRange = useCallback(() => {
    if (minPrice.isLoading || maxPrice.isLoading) {
      return 'Loading...';
    }

    if (minPrice.error || maxPrice.error) {
      return 'Price unavailable';
    }

    if (minAmount === maxAmount) {
      return minPrice.formattedPrice;
    }

    return `${minPrice.formattedPrice} - ${maxPrice.formattedPrice}`;
  }, [minPrice, maxPrice, minAmount, maxAmount]);

  return {
    formattedRange: formatRange(),
    minPrice: minPrice.formattedPrice,
    maxPrice: maxPrice.formattedPrice,
    isLoading: minPrice.isLoading || maxPrice.isLoading,
    error: minPrice.error || maxPrice.error
  };
};

/**
 * Hook for comparing prices (original vs sale price)
 */
export const useComparePrice = (
  originalAmount: number,
  saleAmount: number,
  options: UsePriceOptions = {}
) => {
  const originalPrice = usePrice(originalAmount, options);
  const salePrice = usePrice(saleAmount, options);

  const savings = originalAmount - saleAmount;
  const savingsPercentage = originalAmount > 0 ? Math.round((savings / originalAmount) * 100) : 0;

  return {
    originalPrice: originalPrice.formattedPrice,
    salePrice: salePrice.formattedPrice,
    savings: usePrice(savings, options).formattedPrice,
    savingsPercentage,
    isOnSale: saleAmount < originalAmount,
    isLoading: originalPrice.isLoading || salePrice.isLoading,
    error: originalPrice.error || salePrice.error
  };
};

/**
 * Hook for cart/order totals with tax and shipping
 */
export const useOrderTotal = (
  subtotal: number,
  tax: number = 0,
  shipping: number = 0,
  discount: number = 0,
  options: UsePriceOptions = {}
) => {
  const subtotalPrice = usePrice(subtotal, options);
  const taxPrice = usePrice(tax, options);
  const shippingPrice = usePrice(shipping, options);
  const discountPrice = usePrice(discount, options);
  
  const total = subtotal + tax + shipping - discount;
  const totalPrice = usePrice(total, options);

  return {
    subtotal: subtotalPrice.formattedPrice,
    tax: taxPrice.formattedPrice,
    shipping: shippingPrice.formattedPrice,
    discount: discountPrice.formattedPrice,
    total: totalPrice.formattedPrice,
    totalAmount: total,
    isLoading: totalPrice.isLoading,
    error: totalPrice.error
  };
};