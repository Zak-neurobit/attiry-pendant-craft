
import { useEffect } from 'react';
import { analytics } from '@/services/analytics';

export const useAnalytics = () => {
  const trackEvent = (event: Parameters<typeof analytics.track>[0]) => {
    analytics.track(event);
  };

  const trackPageView = (page: string) => {
    trackEvent({
      event: 'page_view',
      page,
    });
  };

  const trackProductView = (productId: string) => {
    trackEvent({
      event: 'product_view',
      product_id: productId,
    });
  };

  const trackAddToCart = (productId: string, amount: number) => {
    trackEvent({
      event: 'add_to_cart',
      product_id: productId,
      amount,
    });
  };

  const trackPurchase = (amount: number, productIds: string[]) => {
    trackEvent({
      event: 'purchase',
      amount,
      extras: { product_ids: productIds },
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackPurchase,
  };
};

export const usePageTracking = () => {
  useEffect(() => {
    analytics.track({
      event: 'page_view',
      page: window.location.pathname,
    });
  }, []);
};
