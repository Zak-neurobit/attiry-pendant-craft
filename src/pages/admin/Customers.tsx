
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Download, Users, Filter, MoreHorizontal, Eye, Edit, Ban, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CustomerDrawer } from '@/components/admin/customers/CustomerDrawer';

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

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [tierFilter, setTierFilter] = useState('all');
  const [pageSize, setPageSize] = useState(25);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);

  useEffect(() => {
    loadCustomers();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('customers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => loadCustomers()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadCustomers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_customer_overview')
        .select('*')
        .order('joined_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchQuery || 
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery);
      
      const matchesTier = tierFilter === 'all' || customer.loyalty_tier === tierFilter;
      
      return matchesSearch && matchesTier;
    });
  }, [customers, searchQuery, tierFilter]);

  const handleCustomerAction = async (customerId: string, action: string) => {
    try {
      switch (action) {
        case 'view':
          const customer = customers.find(c => c.id === customerId);
          if (customer) {
            setSelectedCustomer(customer);
            setShowCustomerDrawer(true);
          }
          break;
        case 'block':
          await supabase
            .from('profiles')
            .update({ is_blocked: true })
            .eq('id', customerId);
          toast.success('Customer blocked successfully');
          loadCustomers();
          break;
        case 'unblock':
          await supabase
            .from('profiles')
            .update({ is_blocked: false })
            .eq('id', customerId);
          toast.success('Customer unblocked successfully');
          loadCustomers();
          break;
      }
    } catch (error) {
      console.error('Error performing customer action:', error);
      toast.error('Action failed');
    }
  };

  const exportCustomers = () => {
    const csvContent = [
      ['ID', 'Email', 'Name', 'Phone', 'Joined', 'Orders', 'Total Spent', 'Tier', 'Points'].join(','),
      ...filteredCustomers.map(customer => [
        customer.id,
        customer.email,
        `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        customer.phone || '',
        new Date(customer.joined_at).toLocaleDateString(),
        customer.total_orders,
        customer.total_spent,
        customer.loyalty_tier,
        customer.loyalty_points
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getLastSeenText = (lastOrderAt: string) => {
    if (!lastOrderAt) return 'Never';
    const days = Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(lastOrderAt).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-600 mt-1">Total Customers: {customers.length}</p>
        </div>
        <Button onClick={exportCustomers} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCustomers(filteredCustomers.map(c => c.id));
                      } else {
                        setSelectedCustomers([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Loyalty Tier</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.slice(0, pageSize).map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCustomers(prev => [...prev, customer.id]);
                        } else {
                          setSelectedCustomers(prev => prev.filter(id => id !== customer.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </div>
                        {customer.is_blocked && (
                          <Badge variant="destructive" className="text-xs">Blocked</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || '—'}</TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell>${customer.total_spent?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(customer.loyalty_tier)}>
                      {customer.loyalty_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{getLastSeenText(customer.last_order_at)}</TableCell>
                  <TableCell>
                    {new Date(customer.joined_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCustomerAction(customer.id, 'view')}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCustomerAction(customer.id, 'edit')}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCustomerAction(customer.id, customer.is_blocked ? 'unblock' : 'block')}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {customer.is_blocked ? 'Unblock' : 'Block'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showCustomerDrawer && selectedCustomer && (
        <CustomerDrawer
          customer={selectedCustomer}
          open={showCustomerDrawer}
          onClose={() => {
            setShowCustomerDrawer(false);
            setSelectedCustomer(null);
          }}
          onUpdate={loadCustomers}
        />
      )}
    </div>
  );
}
