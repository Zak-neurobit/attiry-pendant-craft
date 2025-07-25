import { Loader2, MapPin, DollarSign } from 'lucide-react';
import { useCurrency } from '@/stores/currency';

interface CurrencyIndicatorProps {
  variant?: 'full' | 'minimal' | 'compact';
  showLocation?: boolean;
  className?: string;
}

export const CurrencyIndicator = ({ 
  variant = 'full', 
  showLocation = false, 
  className = '' 
}: CurrencyIndicatorProps) => {
  const { 
    getCurrencyInfo, 
    userLocation, 
    isDetectionInProgress,
    error 
  } = useCurrency();

  const currencyInfo = getCurrencyInfo();
  const isLoading = isDetectionInProgress();

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
        {isLoading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Detecting...</span>
          </>
        ) : (
          <>
            <span>{currencyInfo.flagEmoji}</span>
            <span>{currencyInfo.code}</span>
          </>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {isLoading ? (
          <div className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-muted-foreground">Detecting currency...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>USD (Default)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-base">{currencyInfo.flagEmoji}</span>
            <span className="font-medium">{currencyInfo.code}</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex items-center gap-2 p-2 bg-muted/50 rounded-lg ${className}`}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium">Detecting your location...</p>
            <p className="text-xs text-muted-foreground">Setting up currency</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Prices in USD</p>
            <p className="text-xs text-muted-foreground">Default currency</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-lg">{currencyInfo.flagEmoji}</span>
            {showLocation && userLocation && (
              <MapPin className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              Prices in {currencyInfo.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {showLocation && userLocation ? (
                `Detected: ${userLocation.country}`
              ) : (
                `${currencyInfo.symbol} ${currencyInfo.code}`
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};