import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, Activity, Settings, Cog, Bot, CreditCard } from 'lucide-react';
import { DashboardDateFilter } from '@/components/admin/DashboardDateFilter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  activeProducts: number;
  recentActivities: number;
  previousProducts: number;
  previousCustomers: number;
}

interface RecentActivity {
  id: string;
  type: 'product' | 'customer' | 'order' | 'contact';
  description: string;
  created_at: string;
}

interface ProductMetric {
  date: string;
  count: number;
}

export const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<ProductMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) throw productsError;
      
      // Fetch customers data
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) throw customersError;
      
      // Calculate current stats
      const totalProducts = products?.length || 0;
      const totalCustomers = customers?.length || 0;
      const activeProducts = products?.filter(p => p.status === 'active').length || 0;
      
      // Calculate previous period stats for comparison
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const previousProducts = products?.filter(p => new Date(p.created_at) < thirtyDaysAgo).length || 0;
      const previousCustomers = customers?.filter(c => new Date(c.created_at) < thirtyDaysAgo).length || 0;
      
      setStats({
        totalProducts,
        totalCustomers,
        activeProducts,
        recentActivities: 0,
        previousProducts,
        previousCustomers,
      });
      
      // Fetch recent activities
      const recentActivitiesData: RecentActivity[] = [];
      
      // Add recent products
      const recentProducts = products?.slice(0, 3).map(p => ({
        id: p.id,
        type: 'product' as const,
        description: `New product: ${p.name}`,
        created_at: p.created_at
      })) || [];
      
      // Add recent customers
      const recentCustomers = customers?.slice(0, 3).map(c => ({
        id: c.id,
        type: 'customer' as const,
        description: `New customer: ${c.email}`,
        created_at: c.created_at
      })) || [];
      
      recentActivitiesData.push(...recentProducts, ...recentCustomers);
      recentActivitiesData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setRecentActivities(recentActivitiesData.slice(0, 10));
      
      // Create chart data for product growth
      const chartMetrics: ProductMetric[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const count = products?.filter(p => new Date(p.created_at).toDateString() === date.toDateString()).length || 0;
        chartMetrics.push({ date: dateStr, count });
      }
      
      setChartData(chartMetrics);
      
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


  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatChartData = () => {
    return chartData.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-cormorant">Dashboard</h1>
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
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatNumber(stats?.totalProducts || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={stats && stats.totalProducts >= stats.previousProducts ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : calculateChange(stats?.totalProducts || 0, stats?.previousProducts || 0)}
              </span> from last month
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
              {loading ? "Loading..." : formatNumber(stats?.totalCustomers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={stats && stats.totalCustomers >= stats.previousCustomers ? "text-green-600" : "text-red-600"}>
                {loading ? "..." : calculateChange(stats?.totalCustomers || 0, stats?.previousCustomers || 0)}
              </span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatNumber(stats?.activeProducts || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "Loading..." : "Online"}
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Product Growth</CardTitle>
            <CardDescription>Product additions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div>Loading chart data...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Products Added']} />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-muted-foreground">Loading activity...</div>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-muted-foreground">No recent activity</div>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'product' ? 'bg-blue-500' : 
                      activity.type === 'customer' ? 'bg-green-500' : 
                      activity.type === 'order' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {activity.type}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            Quick Settings
          </CardTitle>
          <CardDescription>
            Access important configuration options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Settings className="h-6 w-6" />
                <span>Store Settings</span>
              </Button>
            </Link>
            <Link to="/admin/ai-settings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Bot className="h-6 w-6" />
                <span>AI Settings</span>
              </Button>
            </Link>
            <Link to="/admin/api-settings">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <span>Payment Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};