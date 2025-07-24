
import { useState, useEffect } from 'react';
import { razorpayService, RazorpayPayment } from '@/services/api/razorpayService';
import { useToast } from '@/hooks/use-toast';

export const usePayments = () => {
  const [payments, setPayments] = useState<RazorpayPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPayments = async (params?: {
    count?: number;
    skip?: number;
    from?: number;
    to?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await razorpayService.fetchPayments(params);
      setPayments(response.items);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRefund = async (paymentId: string, amount?: number) => {
    try {
      await razorpayService.createRefund(paymentId, amount);
      toast({
        title: "Success",
        description: "Refund initiated successfully",
      });
      // Refresh payments after refund
      fetchPayments();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create refund",
        variant: "destructive",
      });
    }
  };

  const capturePayment = async (paymentId: string, amount: number) => {
    try {
      await razorpayService.capturePayment(paymentId, amount);
      toast({
        title: "Success",
        description: "Payment captured successfully",
      });
      // Refresh payments after capture
      fetchPayments();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to capture payment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createRefund,
    capturePayment,
  };
};
