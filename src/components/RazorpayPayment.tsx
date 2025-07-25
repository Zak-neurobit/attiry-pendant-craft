
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createOrder, type OrderData } from '@/lib/orderService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    name?: string;
    font?: string;
    color?: string;
    chain?: string;
  };
}

interface RazorpayPaymentProps {
  orderData: OrderData;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

// Razorpay test credentials
const RAZORPAY_KEY_ID = 'rzp_test_NoJrDnqHGEHUyP';

export const RazorpayPayment = ({ orderData, onSuccess, onError }: RazorpayPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Create order in Supabase first using our order service
      const orderResult = await createOrder({
        ...orderData,
        subtotal: orderData.total - (orderData.shippingCost || 0)
      });

      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      const orderId = orderResult.orderId!;

      // For Razorpay integration, we'll use the existing create-order function as fallback
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          orderId: orderId, // Pass our Supabase order ID
          items: orderData.items.map(item => ({
            ...item,
            customText: item.customization?.name || item.customText,
            color: item.color,
            font: item.font,
            chain: item.chain,
          })),
          customerInfo: orderData.customerInfo,
          total: orderData.total,
          shippingCost: orderData.shippingCost,
        },
      });

      if (error) throw error;

      const razorpayOrderId = data?.razorpayOrderId || `order_${orderId}`;

      // Convert USD to INR for Razorpay (approximate rate: 1 USD = 83 INR)
      const usdToInrRate = 83;
      const amountInInr = Math.round((orderData.total + orderData.shippingCost) * usdToInrRate * 100); // Convert to paise

      // Initialize Razorpay payment
      const options = {
        key: RAZORPAY_KEY_ID,
        order_id: razorpayOrderId,
        amount: amountInInr,
        currency: 'INR',
        name: 'Attiry',
        description: 'Custom Pendant Order',
        prefill: {
          name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
          email: orderData.customerInfo.email,
        },
        theme: {
          color: '#C4A07A',
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

            if (verifyError) throw verifyError;

            toast({
              title: 'Payment Successful!',
              description: 'Your order has been placed successfully.',
            });

            onSuccess(orderId);
          } catch (error) {
            console.error('Payment verification error:', error);
            onError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
              variant: 'destructive',
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError(errorMessage);
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full"
      size="lg"
    >
      {isProcessing ? 'Processing...' : `Pay $${(orderData.total + orderData.shippingCost).toFixed(2)}`}
    </Button>
  );
};

// Add Razorpay types to window object
interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
