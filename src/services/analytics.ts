
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  session_id: string;
  user_id?: string;
  event: 'page_view' | 'product_view' | 'image_view' | 'image_click' | 'add_to_cart' | 'begin_checkout' | 'purchase';
  page?: string;
  product_id?: string;
  image_id?: string;
  amount?: number;
  extras?: Record<string, any>;
}

class AnalyticsService {
  private sessionId: string;
  private eventQueue: AnalyticsEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupBeforeUnload();
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  track(event: Omit<AnalyticsEvent, 'session_id'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      session_id: this.sessionId,
    };

    this.eventQueue.push(fullEvent);
    this.scheduleBatch();
  }

  private scheduleBatch() {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.flush();
    }, 5000);
  }

  private async flush() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert(events);

      if (error) {
        console.error('Failed to track events:', error);
        // Re-queue events on failure
        this.eventQueue.unshift(...events);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
      this.eventQueue.unshift(...events);
    }
  }

  // Get live visitor count for a product
  async getLiveVisitors(productId?: string): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    let query = supabase
      .from('events')
      .select('session_id', { count: 'exact' })
      .eq('event', 'product_view')
      .gte('created_at', fiveMinutesAgo);

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { count } = await query;
    return count || 0;
  }

  // Get recent orders for live sales notifications
  async getRecentOrders(): Promise<any[]> {
    const { data } = await supabase
      .from('orders')
      .select(`
        id,
        customer_name,
        shipping_address,
        created_at,
        order_items (
          products (
            title
          )
        )
      `)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false })
      .limit(50);

    return data || [];
  }
}

export const analytics = new AnalyticsService();

// Hook for tracking page views
export const usePageTracking = () => {
  React.useEffect(() => {
    analytics.track({
      event: 'page_view',
      page: window.location.pathname,
    });
  }, []);
};
