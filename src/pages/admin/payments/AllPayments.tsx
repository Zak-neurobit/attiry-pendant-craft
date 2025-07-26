
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Download, RefreshCw, Eye, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  customerEmail: string;
  amount: number;
  status: 'captured' | 'failed' | 'authorized' | 'pending';
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  createdAt: string;
  razorpayPaymentId: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    orderId: 'ord_12345',
    customerId: 'cust_67890',
    customerEmail: 'john@example.com',
    amount: 2999,
    status: 'captured',
    method: 'upi',
    createdAt: '2024-01-15T10:30:00Z',
    razorpayPaymentId: 'pay_razorpay123',
  },
  // Add more mock data as needed
];

export const AllPayments = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  // Filter payments based on search and filters
  useEffect(() => {
    let filtered = payments;

    if (searchQuery) {
      filtered = filtered.filter(payment => 
        payment.razorpayPaymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'captured': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'authorized': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(filteredPayments.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
    }
  };

  const exportPayments = () => {
    toast({
      title: "Export Started",
      description: "Your payment data is being exported to CSV.",
    });
  };

  const fetchRealPayments = async () => {
    setLoading(true);
    try {
      const { razorpayService } = await import('@/services/api/razorpayService');
      const response = await razorpayService.fetchPayments({
        count: 100,
      });

      const realPayments: Payment[] = response.items.map(payment => ({
        id: payment.id,
        orderId: payment.order_id || 'N/A',
        customerId: 'N/A',
        customerEmail: payment.email || 'N/A',
        amount: payment.amount,
        status: payment.status as any,
        method: payment.method as any,
        createdAt: new Date(payment.created_at * 1000).toISOString(),
        razorpayPaymentId: payment.id,
      }));

      setPayments(realPayments);
      toast({
        title: "Success",
        description: "Real payment data loaded from Razorpay",
      });
    } catch (error: any) {
      console.error('Failed to fetch real payments:', error);
      toast({
        title: "Razorpay Error",
        description: "Using mock data. Configure Razorpay in Settings to see real data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshPayments = async () => {
    await fetchRealPayments();
  };

  // Load real payments on mount
  useEffect(() => {
    fetchRealPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">All Payments</h1>
          <p className="text-muted-foreground">
            Manage and monitor all payment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshPayments} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportPayments}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="captured">Captured</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="authorized">Authorized</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="netbanking">Net Banking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>

            {selectedPayments.length > 0 && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Bulk Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">Bulk Refund</SelectItem>
                  <SelectItem value="export">Export Selected</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Payments ({filteredPayments.length})
            {selectedPayments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selectedPayments.length} selected)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPayments.length === filteredPayments.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={(checked) => handleSelectPayment(payment.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payment.razorpayPaymentId}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payment.orderId}
                  </TableCell>
                  <TableCell>{payment.customerEmail}</TableCell>
                  <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{payment.method}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Payment Details</DialogTitle>
                          <DialogDescription>
                            Complete information for payment {payment.razorpayPaymentId}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Payment ID</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {payment.razorpayPaymentId}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Order ID</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {payment.orderId}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Amount</label>
                              <p className="text-sm text-muted-foreground">
                                ${(payment.amount / 100).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button size="sm">Process Refund</Button>
                            <Button size="sm" variant="outline">Download Receipt</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
