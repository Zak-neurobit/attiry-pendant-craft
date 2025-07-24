
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/stores/cart';
import { Eye, Package, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  custom_text?: string;
  color_variant: string;
  products: {
    id: string;
    title: string;
    image_urls: string[];
  };
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  customer_name: string;
  shipping_address: any;
  order_items: OrderItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCartStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id,
              title,
              image_urls
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load orders.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgain = (order: Order) => {
    order.order_items.forEach((item) => {
      addToCart({
        id: item.products.id,
        name: item.products.title,
        price: item.unit_price,
        image: item.products.image_urls[0] || '/placeholder.svg',
        customText: item.custom_text || '',
        color: item.color_variant,
        quantity: item.quantity,
      });
    });

    toast({
      title: 'Items Added to Cart',
      description: `${order.order_items.length} item(s) have been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Your order history will appear here once you make your first purchase
            </p>
            <Button asChild>
              <a href="/shop">Start Shopping</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[80vh]">
                        <DrawerHeader>
                          <DrawerTitle>
                            Order #{order.id.slice(-8).toUpperCase()}
                          </DrawerTitle>
                        </DrawerHeader>
                        <div className="p-6 space-y-6 overflow-y-auto">
                          {/* Order Items */}
                          <div>
                            <h3 className="font-semibold mb-3">Items</h3>
                            <div className="space-y-3">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                                  <img
                                    src={item.products.image_urls[0] || '/placeholder.svg'}
                                    alt={item.products.title}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{item.products.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Color: {item.color_variant}
                                    </p>
                                    {item.custom_text && (
                                      <p className="text-sm text-muted-foreground">
                                        Custom: "{item.custom_text}"
                                      </p>
                                    )}
                                    <p className="text-sm">
                                      Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="font-semibold mb-3">Shipping Address</h3>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-sm space-y-1">
                                <div className="font-medium">{order.customer_name}</div>
                                {order.shipping_address && (
                                  <>
                                    <div>{order.shipping_address.line1}</div>
                                    {order.shipping_address.line2 && <div>{order.shipping_address.line2}</div>}
                                    <div>
                                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                                    </div>
                                    <div>{order.shipping_address.country}</div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Order Date:</span>
                                <span>{format(new Date(order.created_at), 'PPP')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-between font-semibold border-t pt-2">
                                <span>Total:</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button onClick={() => handleBuyAgain(order)} className="flex-1">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Buy Again
                            </Button>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};
