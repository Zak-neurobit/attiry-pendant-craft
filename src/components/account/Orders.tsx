

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';
import { useToast } from '@/hooks/use-toast';
import { Package, Eye, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: any;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    custom_text?: string;
    color_variant: string;
    products: {
      title: string;
      image_urls?: string[];
    };
  }>;
}

export const Orders = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
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

  const handleBuyAgain = async (order: Order) => {
    try {
      for (const item of order.order_items) {
        addItem({
          id: item.product_id,
          title: item.products.title,
          price: item.unit_price,
          image_urls: item.products.image_urls || [],
          color_variant: item.color_variant as 'gold' | 'rose_gold' | 'silver',
          custom_text: item.custom_text || '',
        }, item.quantity);
      }
      
      toast({
        title: 'Success',
        description: 'Items added to cart successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add items to cart.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
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
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View your order history and track shipments
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
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(order.status)} text-white`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p className="font-medium">
                      {order.order_items.reduce((total, item) => total + item.quantity, 0)} items
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-lg">
                        {selectedOrder && (
                          <>
                            <SheetHeader>
                              <SheetTitle>
                                Order #{selectedOrder.id.slice(-8).toUpperCase()}
                              </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                              {/* Order Items */}
                              <div>
                                <h3 className="font-semibold mb-3">Items</h3>
                                <div className="space-y-3">
                                  {selectedOrder.order_items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                      {item.products.image_urls?.[0] && (
                                        <img
                                          src={item.products.image_urls[0]}
                                          alt={item.products.title}
                                          className="w-16 h-16 object-cover rounded"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <p className="font-medium">{item.products.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {item.color_variant.replace('_', ' ')} • Qty: {item.quantity}
                                        </p>
                                        {item.custom_text && (
                                          <p className="text-sm text-muted-foreground">
                                            "{item.custom_text}"
                                          </p>
                                        )}
                                        <p className="text-sm font-medium">
                                          ${(item.unit_price * item.quantity).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              {/* Shipping Address */}
                              <div>
                                <h3 className="font-semibold mb-3">Shipping Address</h3>
                                <div className="text-sm space-y-1">
                                  <p>{selectedOrder.shipping_address.name}</p>
                                  <p>{selectedOrder.shipping_address.line1}</p>
                                  {selectedOrder.shipping_address.line2 && (
                                    <p>{selectedOrder.shipping_address.line2}</p>
                                  )}
                                  <p>
                                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                                  </p>
                                  <p>{selectedOrder.shipping_address.country}</p>
                                </div>
                              </div>

                              <Separator />

                              {/* Order Total */}
                              <div>
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Buy Again Button */}
                              <Button 
                                className="w-full" 
                                onClick={() => handleBuyAgain(selectedOrder)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Buy Again
                              </Button>
                            </div>
                          </>
                        )}
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

