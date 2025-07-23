import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

const kpiData = [
  {
    title: "Today's Revenue",
    value: "$2,450",
    change: "+12.5%",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "42",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Avg Order Value",
    value: "$58.33",
    change: "+4.1%",
    icon: TrendingUp,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    icon: Users,
  },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{kpi.change}</span> from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
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
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Order #1234</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="text-sm font-medium">$89.99</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Order #1233</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
                <div className="text-sm font-medium">$145.50</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Order #1232</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="text-sm font-medium">$67.25</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};