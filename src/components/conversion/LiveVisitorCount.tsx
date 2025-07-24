
import React, { useState, useEffect } from 'react';
import { analytics } from '@/services/analytics';

interface LiveVisitorCountProps {
  productId?: string;
}

export const LiveVisitorCount: React.FC<LiveVisitorCountProps> = ({ productId }) => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const updateCount = async () => {
      const count = await analytics.getLiveVisitors(productId);
      setVisitorCount(count);
    };

    updateCount();
    const interval = setInterval(updateCount, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [productId]);

  if (visitorCount === 0) return null;

  return (
    <div className="text-sm text-orange-600 font-medium mb-2 animate-pulse">
      {visitorCount} {visitorCount === 1 ? 'person is' : 'people are'} viewing this now
    </div>
  );
};
