
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, RefreshCw, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  customersByMonth: Array<{
    month: string;
    customers: number;
  }>;
}

export const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // Last 30 days
  const { toast } = useToast();

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - dateRange);
      const fromDateStr = fromDate.toISOString().split('T')[0];
      
      const previousFromDate = new Date();
      previousFromDate.setDate(previousFromDate.getDate() - (dateRange * 2));
      const previousFromDateStr = previousFromDate.toISOString().split('T')[0];
      const previousToDateStr = fromDate.toISOString().split('T')[0];

      // Fetch current period orders
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            product_id,
            products (
              title,
              price
            )
          )
        `)
        .gte('created_at', fromDateStr);

      if (currentError) throw currentError;

      // Fetch previous period orders for comparison
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', previousFromDateStr)
        .lt('created_at', previousToDateStr);

      if (previousError) throw previousError;

      // Calculate metrics
      const totalRevenue = currentOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const totalOrders = currentOrders?.length || 0;
      const uniqueCustomers = new Set(currentOrders?.map(order => order.customer_email)).size;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const previousRevenue = previousOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const previousOrderCount = previousOrders?.length || 0;

      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      const orderGrowth = previousOrderCount > 0 ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 0;

      // Top products
      const productSales = new Map();
      currentOrders?.forEach(order => {
        order.order_items?.forEach(item => {
          const productName = item.products?.title || 'Unknown Product';
          const current = productSales.get(productName) || { sales: 0, revenue: 0 };
          current.sales += item.quantity;
          current.revenue += item.quantity * (item.products?.price || 0);
          productSales.set(productName, current);
        });
      });

      const topProducts = Array.from(productSales.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Revenue by day (last 7 days)
      const revenueByDay = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = currentOrders?.filter(order => 
          order.created_at.startsWith(dateStr)
        ) || [];
        
        revenueByDay.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayOrders.reduce((sum, order) => sum + Number(order.total), 0),
          orders: dayOrders.length
        });
      }

      // Orders by status
      const statusCounts = new Map();
      currentOrders?.forEach(order => {
        statusCounts.set(order.status, (statusCounts.get(order.status) || 0) + 1);
      });

      const statusColors = {
        pending: '#f59e0b',
        processing: '#3b82f6',
        shipped: '#8b5cf6',
        delivered: '#10b981',
        cancelled: '#ef4444'
      };

      const ordersByStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        color: statusColors[status as keyof typeof statusColors] || '#6b7280'
      }));

      // Customer growth by month (last 6 months)
      const customersByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const { data: monthOrders } = await supabase
          .from('orders')
          .select('customer_email')
          .gte('created_at', monthStart)
          .lte('created_at', monthEnd);
          
        const uniqueMonthCustomers = new Set(monthOrders?.map(order => order.customer_email)).size;
        
        customersByMonth.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          customers: uniqueMonthCustomers
        });
      }

      setData({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        avgOrderValue,
        revenueGrowth,
        orderGrowth,
        topProducts,
        revenueByDay,
        ordersByStatus,
        customersByMonth
      });

    } catch (error: any) {
      console.error('Analytics fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-cormorant">Analytics</h1>
          <p className="text-muted-foreground">
            Track your store's performance and customer behavior
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button variant="outline" onClick={fetchAnalyticsData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatPrice(data?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data?.revenueGrowth && data.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={data?.revenueGrowth && data.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : formatPercentage(data?.revenueGrowth || 0)}
              </span>
              {" "}from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : data?.totalOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data?.orderGrowth && data.orderGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={data?.orderGrowth && data.orderGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : formatPercentage(data?.orderGrowth || 0)}
              </span>
              {" "}from previous period
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
              {loading ? "Loading..." : formatPrice(data?.avgOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : data?.totalCustomers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique customers in period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
            <CardDescription>Daily revenue and order count</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div>Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.revenueByDay || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="right" dataKey="orders" fill="#8884d8" opacity={0.3} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div>Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.ordersByStatus || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data?.ordersByStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New customers by month</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div>Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.customersByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div>Loading products...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.topProducts?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(product.revenue)}</p>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                  </div>
                ))}
                {(!data?.topProducts?.length) && (
                  <div className="text-center py-4 text-muted-foreground">
                    No product data available
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
