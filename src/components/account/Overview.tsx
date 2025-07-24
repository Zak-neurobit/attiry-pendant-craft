
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { Package, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface OverviewData {
  totalOrders: number;
  lastOrderDate: string | null;
}

export const Overview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData>({
    totalOrders: 0,
    lastOrderDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!user) return;

      try {
        // Fetch total orders and last order date
        const { data: orders } = await supabase
          .from('orders')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setData({
          totalOrders: orders?.length || 0,
          lastOrderDate: orders?.[0]?.created_at || null,
        });
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          A quick glance at your account activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
            <Button asChild variant="link" className="p-0 h-auto text-xs">
              <Link to="/account/orders">View all orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Last Order Date */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Order</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.lastOrderDate
                ? format(new Date(data.lastOrderDate), 'MMM d, yyyy')
                : 'No orders yet'}
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-xs">
              <Link to="/account/orders">View orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Address Placeholder */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Address management coming soon
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-xs mt-2">
              <Link to="/account/addresses">Manage addresses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
