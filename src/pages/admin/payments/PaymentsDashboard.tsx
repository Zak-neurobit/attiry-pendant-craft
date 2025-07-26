
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, CreditCard, Clock, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { razorpayService, type RazorpayPayment } from '@/services/api/razorpayService';
import { supabase } from '@/integrations/supabase/client';

interface PaymentMetrics {
  todayRevenue: number;
  totalTransactions: number;
  successRate: number;
  pendingSettlements: number;
  previousRevenue: number;
  previousTransactions: number;
}

interface PaymentData {
  date: string;
  revenue: number;
  transactions: number;
}

interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

export const PaymentsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<PaymentData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);

      // Get date ranges
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch payments from Razorpay for the last 7 days
      const fromTimestamp = Math.floor(weekAgo.getTime() / 1000);
      const toTimestamp = Math.floor(today.getTime() / 1000);

      const paymentsResponse = await razorpayService.fetchPayments({
        from: fromTimestamp,
        to: toTimestamp,
        count: 1000,
      });

      const payments = paymentsResponse.items;

      // Calculate today's metrics
      const todayPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.created_at * 1000);
        return paymentDate >= todayStart && payment.status === 'captured';
      });

      const yesterdayPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.created_at * 1000);
        return paymentDate >= yesterdayStart && paymentDate < todayStart && payment.status === 'captured';
      });

      const todayRevenue = todayPayments.reduce((sum, p) => sum + (p.amount / 100), 0);
      const previousRevenue = yesterdayPayments.reduce((sum, p) => sum + (p.amount / 100), 0);
      const totalTransactions = todayPayments.length;
      const previousTransactions = yesterdayPayments.length;

      // Calculate success rate
      const allTodayPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.created_at * 1000);
        return paymentDate >= todayStart;
      });
      
      const successfulPayments = allTodayPayments.filter(p => p.status === 'captured').length;
      const successRate = allTodayPayments.length > 0 ? (successfulPayments / allTodayPayments.length) * 100 : 0;

      // Fetch settlements for pending amount
      let pendingSettlements = 0;
      try {
        const settlementsResponse = await razorpayService.fetchSettlements({ count: 50 });
        pendingSettlements = settlementsResponse.items
          .filter(s => s.status === 'created' || s.status === 'processed')
          .reduce((sum, s) => sum + (s.amount / 100), 0);
      } catch (error) {
        console.warn('Could not fetch settlements:', error);
      }

      // Prepare revenue data for chart (last 7 days)
      const revenueByDay: PaymentData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
        const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        
        const dayPayments = payments.filter(payment => {
          const paymentDate = new Date(payment.created_at * 1000);
          return paymentDate >= date && paymentDate < nextDate && payment.status === 'captured';
        });

        revenueByDay.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayPayments.reduce((sum, p) => sum + (p.amount / 100), 0),
          transactions: dayPayments.length,
        });
      }

      // Calculate payment method distribution
      const methodCounts = new Map();
      const capturedPayments = payments.filter(p => p.status === 'captured');
      
      capturedPayments.forEach(payment => {
        const method = payment.method || 'unknown';
        methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
      });

      const methodColors = {
        upi: '#0088FE',
        card: '#00C49F',
        netbanking: '#FFBB28',
        wallet: '#FF8042',
        emi: '#8884d8',
        unknown: '#888888',
      };

      const paymentMethods: PaymentMethodData[] = Array.from(methodCounts.entries()).map(([method, count]) => ({
        name: method.charAt(0).toUpperCase() + method.slice(1),
        value: count,
        color: methodColors[method as keyof typeof methodColors] || '#888888',
      }));

      setMetrics({
        todayRevenue,
        totalTransactions,
        successRate,
        pendingSettlements,
        previousRevenue,
        previousTransactions,
      });

      setRevenueData(revenueByDay);
      setPaymentMethodData(paymentMethods);

    } catch (error: any) {
      console.error('Payment data fetch error:', error);
      
      // If Razorpay credentials are not configured, show a helpful message
      if (error.message?.includes('credentials not configured')) {
        toast({
          title: "Razorpay Not Configured",
          description: "Please configure your Razorpay credentials in Settings > Payments",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch payment data",
          variant: "destructive",
        });
      }

      // Set fallback data
      setMetrics({
        todayRevenue: 0,
        totalTransactions: 0,
        successRate: 0,
        pendingSettlements: 0,
        previousRevenue: 0,
        previousTransactions: 0,
      });
      setRevenueData([]);
      setPaymentMethodData([]);
      
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchPaymentData();
    toast({
      title: "Data Refreshed",
      description: "Payment data has been updated.",
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+∞%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your payment transactions and revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatPrice(metrics?.todayRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics && metrics.todayRevenue >= metrics.previousRevenue ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : calculateChange(metrics?.todayRevenue || 0, metrics?.previousRevenue || 0)}
              </span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : (metrics?.totalTransactions || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics && metrics.totalTransactions >= metrics.previousTransactions ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : calculateChange(metrics?.totalTransactions || 0, metrics?.previousTransactions || 0)}
              </span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : `${(metrics?.successRate || 0).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatPrice(metrics?.pendingSettlements || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting settlement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
            <CardDescription>Daily revenue from Razorpay payments</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div>Loading chart data...</div>
              </div>
            ) : revenueData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No payment data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatPrice(value as number) : value,
                      name === 'revenue' ? 'Revenue' : 'Transactions'
                    ]}
                  />
                  <Bar yAxisId="right" dataKey="transactions" fill="#8884d8" opacity={0.3} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Distribution</CardTitle>
            <CardDescription>Payment methods used by customers</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div>Loading chart data...</div>
              </div>
            ) : paymentMethodData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No payment method data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common payment management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Process Refund
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export Payments
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
