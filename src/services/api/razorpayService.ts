
import { supabase } from '@/integrations/supabase/client';

// Types for Razorpay API responses
export interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  method: 'card' | 'netbanking' | 'wallet' | 'emi' | 'upi';
  order_id?: string;
  created_at: number;
  email?: string;
  contact?: string;
  fee?: number;
  tax?: number;
}

export interface RazorpayRefund {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  status: 'pending' | 'processed' | 'failed';
  created_at: number;
  speed_processed: string;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid';
  created_at: number;
}

export interface RazorpaySettlement {
  id: string;
  entity: string;
  amount: number;
  status: 'created' | 'processed' | 'settled';
  fees: number;
  tax: number;
  utr?: string;
  created_at: number;
}

class RazorpayService {
  private async getAuthHeader(): Promise<string> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'razorpay_credentials')
      .single();

    if (error || !data) {
      throw new Error('Razorpay credentials not configured');
    }

    const credentials = data.value as { key_id: string; key_secret: string };
    const auth = btoa(`${credentials.key_id}:${credentials.key_secret}`);
    return `Basic ${auth}`;
  }

  async fetchPayments(params?: {
    count?: number;
    skip?: number;
    from?: number;
    to?: number;
  }): Promise<{ items: RazorpayPayment[]; count: number }> {
    const authHeader = await this.getAuthHeader();
    const queryParams = new URLSearchParams();
    
    if (params?.count) queryParams.append('count', params.count.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.from) queryParams.append('from', params.from.toString());
    if (params?.to) queryParams.append('to', params.to.toString());

    const response = await fetch(`https://api.razorpay.com/v1/payments?${queryParams}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchPayment(paymentId: string): Promise<RazorpayPayment> {
    const authHeader = await this.getAuthHeader();

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment: ${response.statusText}`);
    }

    return response.json();
  }

  async capturePayment(paymentId: string, amount: number): Promise<RazorpayPayment> {
    const authHeader = await this.getAuthHeader();

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to capture payment: ${response.statusText}`);
    }

    return response.json();
  }

  async createRefund(paymentId: string, amount?: number): Promise<RazorpayRefund> {
    const authHeader = await this.getAuthHeader();

    const body: any = {
      speed: 'optimum',
    };

    if (amount) {
      body.amount = amount * 100; // Convert to paise
    }

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create refund: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchRefunds(params?: {
    count?: number;
    skip?: number;
    payment_id?: string;
  }): Promise<{ items: RazorpayRefund[]; count: number }> {
    const authHeader = await this.getAuthHeader();
    const queryParams = new URLSearchParams();
    
    if (params?.count) queryParams.append('count', params.count.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.payment_id) queryParams.append('payment_id', params.payment_id);

    const response = await fetch(`https://api.razorpay.com/v1/refunds?${queryParams}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch refunds: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchSettlements(params?: {
    count?: number;
    skip?: number;
  }): Promise<{ items: RazorpaySettlement[]; count: number }> {
    const authHeader = await this.getAuthHeader();
    const queryParams = new URLSearchParams();
    
    if (params?.count) queryParams.append('count', params.count.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const response = await fetch(`https://api.razorpay.com/v1/settlements?${queryParams}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch settlements: ${response.statusText}`);
    }

    return response.json();
  }
}

export const razorpayService = new RazorpayService();
