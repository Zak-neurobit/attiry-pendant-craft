
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Phone, MapPin, Gift, ShoppingBag, Clock, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Customer {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_blocked: boolean;
  joined_at: string;
  loyalty_points: number;
  loyalty_tier: string;
  total_spent: number;
  total_orders: number;
  last_order_at: string;
}

interface CustomerDrawerProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  open,
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: customer.first_name || '',
    last_name: customer.last_name || '',
    phone: customer.phone || '',
    notes: ''
  });
  const [orders, setOrders] = useState([]);
  const [loyaltyData, setLoyaltyData] = useState(null);

  useEffect(() => {
    if (open) {
      loadCustomerDetails();
    }
  }, [open, customer.id]);

  const loadCustomerDetails = async () => {
    try {
      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          status,
          created_at,
          order_items (
            products (
              title
            )
          )
        `)
        .eq('user_id', customer.user_id)
        .order('created_at', { ascending: false })
        .limit(10);

      setOrders(ordersData || []);

      // Load detailed loyalty data
      const { data: loyaltyDetail } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', customer.user_id)
        .single();

      setLoyaltyData(loyaltyDetail);

      // Load profile notes
      const { data: profileData } = await supabase
        .from('profiles')
        .select('notes')
        .eq('id', customer.id)
        .single();

      if (profileData) {
        setEditData(prev => ({ ...prev, notes: profileData.notes || '' }));
      }
    } catch (error) {
      console.error('Error loading customer details:', error);
    }
  };

  const saveCustomerData = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editData.first_name,
          last_name: editData.last_name,
          phone: editData.phone,
          notes: editData.notes
        })
        .eq('id', customer.id);

      if (error) throw error;

      toast.success('Customer updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const getTierProgress = () => {
    const thresholds = { bronze: 0, silver: 100, gold: 500 };
    const currentThreshold = thresholds[customer.loyalty_tier];
    const nextTier = customer.loyalty_tier === 'bronze' ? 'silver' : customer.loyalty_tier === 'silver' ? 'gold' : null;
    const nextThreshold = nextTier ? thresholds[nextTier] : null;

    if (!nextThreshold) return { progress: 100, nextTier: null, remaining: 0 };

    const progress = Math.min((customer.total_spent / nextThreshold) * 100, 100);
    const remaining = Math.max(nextThreshold - customer.total_spent, 0);

    return { progress, nextTier, remaining };
  };

  const tierProgress = getTierProgress();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {customer.first_name} {customer.last_name}
            </SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={editData.first_name}
                          onChange={(e) => setEditData(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={editData.last_name}
                          onChange={(e) => setEditData(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={editData.notes}
                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add notes about this customer..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={saveCustomerData} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Joined {new Date(customer.joined_at).toLocaleDateString()}</span>
                    </div>
                    {customer.is_blocked && (
                      <Badge variant="destructive">Account Blocked</Badge>
                    )}
                    {editData.notes && (
                      <div>
                        <Label>Notes</Label>
                        <p className="text-sm text-gray-600 mt-1">{editData.notes}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.order_items?.length} items
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.total}</div>
                        <Badge 
                          variant={order.status === 'paid' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current Points</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {customer.loyalty_points}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Tier: {customer.loyalty_tier}</span>
                    <span className="text-sm text-gray-600">
                      Total Spent: ${customer.total_spent}
                    </span>
                  </div>
                  
                  {tierProgress.nextTier && (
                    <>
                      <Progress value={tierProgress.progress} className="mb-2" />
                      <p className="text-sm text-gray-600">
                        ${tierProgress.remaining} away from {tierProgress.nextTier} tier
                      </p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total Orders:</strong> {customer.total_orders}
                  </div>
                  <div>
                    <strong>Total Spent:</strong> ${customer.total_spent}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  Activity tracking coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
