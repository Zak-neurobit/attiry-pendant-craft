
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, EyeOff, Key, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface APIKey {
  id: string;
  name: string;
  key_preview: string;
  permissions: string[];
  last_used: string | null;
  created_at: string;
  is_active: boolean;
}

interface APIUsageLog {
  id: string;
  endpoint: string;
  method: string;
  ip_address: string | null;
  response_status: number | null;
  response_time_ms: number | null;
  created_at: string;
}

export const APISettings = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [apiLogs, setApiLogs] = useState<APIUsageLog[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAPIKeys();
    fetchAPILogs();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to fetch API keys",
        variant: "destructive",
      });
    }
  };

  const fetchAPILogs = async () => {
    try {
      const { data, error } = await supabase
        .from('api_usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setApiLogs(data || []);
    } catch (error) {
      console.error('Error fetching API logs:', error);
    }
  };

  const generateAPIKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate a new API key
      const newKey = `ak_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const keyHash = await hashAPIKey(newKey);
      const keyPreview = newKey.substring(0, 8) + '••••••••' + newKey.substring(newKey.length - 4);
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName,
          key_hash: keyHash,
          key_preview: keyPreview,
          permissions: ['read'],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setApiKeys([data, ...apiKeys]);
      setNewKeyName('');
      
      // Show the full key to user once
      toast({
        title: "Success",
        description: `API key generated: ${newKey}`,
        duration: 10000,
      });
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hashAPIKey = async (key: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const revokeAPIKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast({
        title: "Success",
        description: "API key revoked successfully",
      });
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Settings</h1>
        <p className="text-muted-foreground">
          Manage API keys and access permissions for your store
        </p>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>
                Create a new API key for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API, Mobile App"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateAPIKey} disabled={isGenerating}>
                    {isGenerating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Generate Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono">
                            {key.key_preview}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.key_preview)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {key.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.last_used ? formatDate(key.last_used) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeAPIKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Complete API reference for your e-commerce platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <h3>Base URL</h3>
                <code>https://jpbfprlpbiojfhshlhcp.supabase.co/functions/v1</code>
                
                <h3>Authentication</h3>
                <p>Include your API key in the Authorization header:</p>
                <code>Authorization: Bearer your-api-key</code>
                
                <h3>Endpoints</h3>
                
                <h4>Products</h4>
                <ul>
                  <li><code>GET /products</code> - List all products</li>
                  <li><code>GET /products/[product-id]</code> - Get single product</li>
                  <li><code>POST /products</code> - Create product</li>
                  <li><code>PUT /products/[product-id]</code> - Update product</li>
                  <li><code>DELETE /products/[product-id]</code> - Delete product</li>
                </ul>
                
                <h4>Orders</h4>
                <ul>
                  <li><code>GET /orders</code> - List all orders</li>
                  <li><code>GET /orders/[order-id]</code> - Get order details</li>
                  <li><code>POST /orders</code> - Create order</li>
                  <li><code>PUT /orders/[order-id]</code> - Update order status</li>
                </ul>
                
                <h4>Customers</h4>
                <ul>
                  <li><code>GET /customers</code> - List customers</li>
                  <li><code>GET /customers/[customer-id]</code> - Get customer details</li>
                  <li><code>POST /customers</code> - Create customer</li>
                  <li><code>PUT /customers/[customer-id]</code> - Update customer</li>
                </ul>
                
                <h4>Analytics</h4>
                <ul>
                  <li><code>GET /analytics/sales</code> - Sales data</li>
                  <li><code>GET /analytics/visitors</code> - Visitor data</li>
                  <li><code>GET /analytics/cart</code> - Cart abandonment data</li>
                  <li><code>GET /analytics/live</code> - Live visitors count</li>
                </ul>
                
                <h4>Inventory</h4>
                <ul>
                  <li><code>GET /inventory</code> - Stock levels</li>
                  <li><code>PUT /inventory/[product-id]</code> - Update stock</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>API Testing Interface</CardTitle>
              <CardDescription>
                Test your API endpoints directly from the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">API Testing Interface</h3>
                <p className="text-muted-foreground">
                  Coming soon - Interactive API testing interface
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Logs</CardTitle>
              <CardDescription>
                Monitor API usage and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono">{log.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.response_status === 200 ? "default" : "destructive"}>
                          {log.response_status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.response_time_ms ? `${log.response_time_ms}ms` : 'N/A'}</TableCell>
                      <TableCell>{log.ip_address || 'N/A'}</TableCell>
                      <TableCell>{formatDate(log.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
