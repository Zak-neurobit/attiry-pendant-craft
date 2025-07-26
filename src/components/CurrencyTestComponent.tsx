import React, { useEffect, useState } from 'react';
import { useCurrency } from '@/stores/currency';
import { usePrice } from '@/hooks/usePrice';
import { geoLocationService } from '@/services/geoLocationService';
import { Button } from '@/components/ui/button';

export const CurrencyTestComponent: React.FC = () => {
  const { 
    currentCurrency, 
    userLocation, 
    initialize, 
    detectUserLocation,
    isDetectionInProgress,
    error 
  } = useCurrency();
  const [isLoaded, setIsLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Test price conversion for a $55 product
  const testPrice = usePrice(55, { fromCurrency: 'USD' });
  const comparePrice = usePrice(74, { fromCurrency: 'USD' });

  useEffect(() => {
    const initTest = async () => {
      try {
        console.log('🧪 CurrencyTestComponent: Starting initialization...');
        await initialize();
        await detectUserLocation();
        setIsLoaded(true);
        console.log('🧪 CurrencyTestComponent: Initialization complete');
      } catch (error) {
        console.error('Currency test initialization failed:', error);
        setIsLoaded(true);
      }
    };
    
    initTest();
  }, [initialize, detectUserLocation]);

  const handleForceDetection = async () => {
    console.log('🔄 Manual force detection triggered');
    setDebugInfo('Forcing location detection...');
    try {
      await geoLocationService.forceLocationDetection();
      await detectUserLocation();
      setDebugInfo('Force detection completed!');
      setTimeout(() => setDebugInfo(''), 3000);
    } catch (error) {
      setDebugInfo(`Force detection failed: ${error}`);
    }
  };

  const handleClearCache = () => {
    geoLocationService.clearLocationCache();
    setDebugInfo('Cache cleared! Refresh page to re-detect.');
    setTimeout(() => setDebugInfo(''), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p>🔄 Initializing currency system...</p>
        <p className="text-xs text-blue-600 mt-2">Check browser console for detailed logs</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">🌍 Currency Debug Panel</h3>
        <div className="text-xs">
          <span className={`px-2 py-1 rounded ${isDetectionInProgress() ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {isDetectionInProgress() ? 'DETECTING' : 'READY'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="p-3 bg-green-50 rounded">
          <p className="font-semibold text-green-800">📍 Detected Location:</p>
          <p className="text-sm font-mono">
            {userLocation ? 
              `${userLocation.city}, ${userLocation.country} (${userLocation.countryCode})` 
              : 'Not detected'
            }
          </p>
          {userLocation?.ip && (
            <p className="text-xs text-gray-600">IP: {userLocation.ip}</p>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded">
          <p className="font-semibold text-blue-800">💰 Current Currency:</p>
          <p className="text-lg font-mono">{currentCurrency}</p>
          {error && (
            <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>
          )}
        </div>

        <div className="p-3 bg-yellow-50 rounded">
          <p className="font-semibold text-yellow-800">🧮 Price Conversion Test:</p>
          <div className="space-y-1">
            <p className="text-sm">Original: $55.00 USD</p>
            <p className="text-lg font-bold text-green-600">
              Converted: {testPrice.isLoading ? '⏳ Loading...' : testPrice.formattedPrice}
            </p>
            {testPrice.error && (
              <p className="text-red-500 text-xs">❌ Error: {testPrice.error}</p>
            )}
          </div>
        </div>

        <div className="p-3 bg-purple-50 rounded">
          <p className="font-semibold text-purple-800">🏷️ Compare Price Test:</p>
          <div className="space-y-1">
            <p className="text-sm">Original: $74.00 USD</p>
            <p className="text-lg">
              <span className="line-through text-gray-500">
                {comparePrice.isLoading ? '⏳ Loading...' : comparePrice.formattedPrice}
              </span>
              {' → '}
              <span className="font-bold text-green-600">
                {testPrice.isLoading ? '⏳ Loading...' : testPrice.formattedPrice}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleForceDetection}
            disabled={isDetectionInProgress()}
          >
            🔄 Force Detect
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleClearCache}
          >
            🗑️ Clear Cache
          </Button>
        </div>

        {debugInfo && (
          <div className="p-2 bg-gray-100 rounded text-xs font-mono">
            {debugInfo}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 border-t pt-2">
        <p>💡 Check browser console (F12) for detailed debugging info</p>
        <p>🔧 Use buttons above to manually test location detection</p>
      </div>
    </div>
  );
};