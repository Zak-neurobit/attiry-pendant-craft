import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { DashboardDateFilter } from '@/components/admin/DashboardDateFilter';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DashboardStats {
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
  previousRevenue: number;
  previousOrderCount: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get date range for filtering
      const fromDate = dateRange.from ? dateRange.from.toISOString().split('T')[0] : null;
      const toDate = dateRange.to ? new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
      
      // Fetch orders for the selected date range
      let query = supabase
        .from('orders')
        .select('*');
      
      if (fromDate) {
        query = query.gte('created_at', fromDate);
      }
      if (toDate) {
        query = query.lt('created_at', toDate);
      }
      
      const { data: orders, error: ordersError } = await query;
      
      if (ordersError) throw ordersError;
      
      // Calculate current period stats
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const orderCount = orders?.length || 0;
      const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
      
      // Calculate previous period stats for comparison
      const periodDays = dateRange.from && dateRange.to 
        ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      
      const previousFromDate = new Date(dateRange.from?.getTime() - periodDays * 24 * 60 * 60 * 1000);
      const previousToDate = dateRange.from;
      
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', previousFromDate.toISOString().split('T')[0])
        .lt('created_at', previousToDate?.toISOString().split('T')[0]);
      
      const previousRevenue = previousOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const previousOrderCount = previousOrders?.length || 0;
      
      setStats({
        totalRevenue,
        orderCount,
        avgOrderValue,
        previousRevenue,
        previousOrderCount,
      });
      
      // Fetch recent orders (last 10)
      const { data: recent, error: recentError } = await supabase
        .from('orders')
        .select('id, customer_name, total, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (recentError) throw recentError;
      
      setRecentOrders(recent || []);
      
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening in your selected period.
        </p>
      </div>

      {/* Date Filter */}
      <DashboardDateFilter
        onDateRangeChange={setDateRange}
        onRefresh={fetchDashboardData}
        isLoading={loading}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatPrice(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={stats && stats.totalRevenue >= stats.previousRevenue ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : calculateChange(stats?.totalRevenue || 0, stats?.previousRevenue || 0)}
              </span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : stats?.orderCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={stats && stats.orderCount >= stats.previousOrderCount ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : calculateChange(stats?.orderCount || 0, stats?.previousOrderCount || 0)}
              </span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatPrice(stats?.avgOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : `${stats?.orderCount || 0} Total`}
            </div>
            <p className="text-xs text-muted-foreground">
              Orders in selected period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Revenue Chart (Coming Soon)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-muted-foreground">Loading orders...</div>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-muted-foreground">No recent orders</div>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.customer_name} - #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-sm font-medium">{formatPrice(order.total)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};