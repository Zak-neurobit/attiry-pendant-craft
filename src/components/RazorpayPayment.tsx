
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RazorpayPaymentProps {
  orderData: {
    items: any[];
    customerInfo: {
      firstName: string;
      lastName: string;
      email: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    total: number;
    shippingCost: number;
  };
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

      // Create order in Supabase first
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          items: orderData.items.map(item => ({
            ...item,
            customText: item.customText,
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

      const { orderId, razorpayOrderId } = data;

      // Initialize Razorpay payment
      const options = {
        key: RAZORPAY_KEY_ID,
        order_id: razorpayOrderId,
        amount: Math.round((orderData.total + orderData.shippingCost) * 100), // Convert to paise
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
        handler: async function (response: any) {
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
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed');
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to process payment',
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
      {isProcessing ? 'Processing...' : `Pay $${orderData.total.toFixed(2)}`}
    </Button>
  );
};

// Add Razorpay types to window object
declare global {
  interface Window {
    Razorpay: any;
  }
}
