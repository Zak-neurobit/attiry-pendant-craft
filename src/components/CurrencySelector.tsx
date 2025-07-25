import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign, Check, Loader2 } from 'lucide-react';
import { useCurrency } from '@/stores/currency';
import { SupportedCurrency, SUPPORTED_CURRENCIES } from '@/services/currencyService';

interface CurrencySelectorProps {
  variant?: 'button' | 'minimal' | 'dropdown';
  showFlag?: boolean;
  className?: string;
}

export const CurrencySelector = ({ 
  variant = 'dropdown', 
  showFlag = true, 
  className = '' 
}: CurrencySelectorProps) => {
  const { 
    currentCurrency, 
    setCurrency, 
    getCurrencyInfo, 
    getSupportedCurrencies,
    isDetectionInProgress 
  } = useCurrency();
  
  const [isChanging, setIsChanging] = useState(false);
  const currentCurrencyInfo = getCurrencyInfo();
  const supportedCurrencies = getSupportedCurrencies();

  const handleCurrencyChange = async (currency: SupportedCurrency) => {
    if (currency === currentCurrency) return;
    
    setIsChanging(true);
    try {
      setCurrency(currency);
      
      // Store currency preference
      localStorage.setItem('attiry_currency', currency);
    } catch (error) {
      console.error('Failed to change currency:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const isLoading = isDetectionInProgress() || isChanging;

  if (variant === 'button') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {supportedCurrencies.map((currency) => (
          <Button
            key={currency.code}
            variant={currentCurrency === currency.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCurrencyChange(currency.code)}
            disabled={isLoading}
            className="min-w-[70px]"
          >
            {showFlag && (
              <span className="mr-1 text-sm">{currency.flagEmoji}</span>
            )}
            {currency.code}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">Currency:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Cycle through currencies
            const currentIndex = supportedCurrencies.findIndex(c => c.code === currentCurrency);
            const nextIndex = (currentIndex + 1) % supportedCurrencies.length;
            handleCurrencyChange(supportedCurrencies[nextIndex].code);
          }}
          disabled={isLoading}
          className="h-auto p-1 text-sm"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <>
              {showFlag && (
                <span className="mr-1">{currentCurrencyInfo.flagEmoji}</span>
              )}
              {currentCurrencyInfo.symbol} {currentCurrencyInfo.code}
            </>
          )}
        </Button>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${className}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <DollarSign className="h-4 w-4 mr-2" />
          )}
          {showFlag && !isLoading && (
            <span className="mr-1">{currentCurrencyInfo.flagEmoji}</span>
          )}
          {isLoading ? 'Detecting...' : `${currentCurrencyInfo.symbol} ${currentCurrencyInfo.code}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {supportedCurrencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              {showFlag && (
                <span className="mr-2 text-lg">{currency.flagEmoji}</span>
              )}
              <div>
                <div className="font-medium">
                  {currency.symbol} {currency.code}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currency.name} • {currency.country}
                </div>
              </div>
            </div>
            {currentCurrency === currency.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};