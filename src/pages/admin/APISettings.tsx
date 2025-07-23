
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, EyeOff, Key, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  last_used: string | null;
  created_at: string;
  is_active: boolean;
}

export const APISettings = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    // This would fetch from a dedicated API keys table
    // For now, we'll use mock data
    const mockKeys: APIKey[] = [
      {
        id: '1',
        name: 'Production API',
        key: 'ak_live_1234567890abcdef',
        permissions: ['read', 'write'],
        last_used: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        is_active: true
      },
      {
        id: '2',
        name: 'Mobile App',
        key: 'ak_live_0987654321fedcba',
        permissions: ['read'],
        last_used: null,
        created_at: '2024-01-10T00:00:00Z',
        is_active: false
      }
    ];
    
    setApiKeys(mockKeys);
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
      
      const newAPIKey: APIKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: newKey,
        permissions: ['read'],
        last_used: null,
        created_at: new Date().toISOString(),
        is_active: true
      };

      setApiKeys([...apiKeys, newAPIKey]);
      setNewKeyName('');
      
      toast({
        title: "Success",
        description: "API key generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeAPIKey = async (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast({
      title: "Success",
      description: "API key revoked successfully",
    });
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

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '••••••••' + key.substring(key.length - 4);
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
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono">
                            {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {apiKey.last_used ? formatDate(apiKey.last_used) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                          {apiKey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeAPIKey(apiKey.id)}
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
                  <li><code>GET /products/{id}</code> - Get single product</li>
                  <li><code>POST /products</code> - Create product</li>
                  <li><code>PUT /products/{id}</code> - Update product</li>
                  <li><code>DELETE /products/{id}</code> - Delete product</li>
                </ul>
                
                <h4>Orders</h4>
                <ul>
                  <li><code>GET /orders</code> - List all orders</li>
                  <li><code>GET /orders/{id}</code> - Get order details</li>
                  <li><code>POST /orders</code> - Create order</li>
                  <li><code>PUT /orders/{id}</code> - Update order status</li>
                </ul>
                
                <h4>Customers</h4>
                <ul>
                  <li><code>GET /customers</code> - List customers</li>
                  <li><code>GET /customers/{id}</code> - Get customer details</li>
                  <li><code>POST /customers</code> - Create customer</li>
                  <li><code>PUT /customers/{id}</code> - Update customer</li>
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
                  <li><code>PUT /inventory/{product_id}</code> - Update stock</li>
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
              <CardTitle>API Logs</CardTitle>
              <CardDescription>
                Monitor API usage and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">API Logs</h3>
                <p className="text-muted-foreground">
                  Coming soon - Real-time API logs and monitoring
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
