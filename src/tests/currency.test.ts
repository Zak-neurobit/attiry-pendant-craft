import { describe, it, expect } from 'vitest';
import { currencyService } from '@/services/currencyService';

describe('currencyService', () => {
  it('should format price correctly for USD', () => {
    const formattedPrice = currencyService.formatCurrency(100, 'USD');
    expect(formattedPrice).toBe('$100.00');
  });

  it('should format price correctly for INR', () => {
    const formattedPrice = currencyService.formatCurrency(8300, 'INR');
    expect(formattedPrice).toMatch(/₹(8,300|8,300.00)/);
  });

  it('should format price correctly for AED', () => {
    const formattedPrice = currencyService.formatCurrency(367, 'AED');
    // Use regex to accommodate different symbol positions and invisible characters
    expect(formattedPrice).toMatch(/367.00/);
    expect(formattedPrice).toMatch(/د\.إ/);
  });

  it('should convert price correctly from USD to INR using mock rates', async () => {
    // Set mock rates for this test
    currencyService.setExchangeRatesForTesting({ USD: 1, INR: 83.5 });

    // Use the special testing flag to ensure mock rates are used
    const convertedPrice = await currencyService.convertCurrency(55, 'USD', 'INR', true);
    
    expect(convertedPrice).toBeCloseTo(4592.5);
  });
});
