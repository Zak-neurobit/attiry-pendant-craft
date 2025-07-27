
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Eye, EyeOff, Key, Plus, Trash2, RefreshCw, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
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

interface TestRequest {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface TestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  timestamp: string;
  method: string;
  endpoint: string;
}

export const APISettings = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [apiLogs, setApiLogs] = useState<APIUsageLog[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  // API Testing state
  const [selectedEndpoint, setSelectedEndpoint] = useState('/products');
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [selectedApiKey, setSelectedApiKey] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [customHeaders, setCustomHeaders] = useState('');
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResponse[]>([]);
  
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

  const testApiEndpoint = async () => {
    if (!selectedApiKey || !selectedApiKey.startsWith('ak_live_')) {
      toast({
        title: "Error",
        description: "Please enter a valid API key (should start with 'ak_live_')",
        variant: "destructive",
      });
      return;
    }

    setIsTestingApi(true);
    const startTime = Date.now();

    try {
      const baseUrl = 'https://jpbfprlpbiojfhshlhcp.supabase.co/functions/v1';
      const url = `${baseUrl}${selectedEndpoint}`;
      
      // Parse custom headers
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selectedApiKey}`,
      };

      if (customHeaders.trim()) {
        try {
          const parsedHeaders = JSON.parse(customHeaders);
          headers = { ...headers, ...parsedHeaders };
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON format in custom headers",
            variant: "destructive",
          });
          setIsTestingApi(false);
          return;
        }
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: selectedMethod,
        headers,
      };

      // Add body for POST and PUT requests
      if ((selectedMethod === 'POST' || selectedMethod === 'PUT') && requestBody.trim()) {
        try {
          JSON.parse(requestBody); // Validate JSON
          requestOptions.body = requestBody;
        } catch (error) {
          toast({
            title: "Error", 
            description: "Invalid JSON format in request body",
            variant: "destructive",
          });
          setIsTestingApi(false);
          return;
        }
      }

      const response = await fetch(url, requestOptions);
      const responseTime = Date.now() - startTime;
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const testResult: TestResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime,
        timestamp: new Date().toISOString(),
        method: selectedMethod,
        endpoint: selectedEndpoint,
      };

      setTestResponse(testResult);
      setTestHistory(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 tests

      toast({
        title: "Test Completed",
        description: `Request completed in ${responseTime}ms`,
      });

    } catch (error) {
      const errorResponse: TestResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        method: selectedMethod,
        endpoint: selectedEndpoint,
      };

      setTestResponse(errorResponse);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const loadSampleData = () => {
    const samples: Record<string, Record<string, string>> = {
      '/products': {
        'POST': JSON.stringify({
          title: "Test Product",
          description: "A test product",
          price: 29.99,
          stock: 100
        }, null, 2),
        'PUT': JSON.stringify({
          title: "Updated Product",
          price: 34.99
        }, null, 2)
      },
      '/orders': {
        'POST': JSON.stringify({
          customer_id: "customer-id",
          items: [
            {
              product_id: "product-id",
              quantity: 1,
              price: 29.99
            }
          ]
        }, null, 2)
      },
      '/customers': {
        'POST': JSON.stringify({
          email: "test@example.com",
          name: "Test Customer"
        }, null, 2)
      }
    };

    const sample = samples[selectedEndpoint]?.[selectedMethod];
    if (sample) {
      setRequestBody(sample);
    }
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
        <h1 className="text-3xl font-bold font-cormorant">API Settings</h1>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Testing Interface</CardTitle>
                <CardDescription>
                  Test your API endpoints directly from the admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Key Input */}
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key for Testing</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key (ak_live_...)"
                    value={selectedApiKey}
                    onChange={(e) => setSelectedApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full API key that was shown when you generated it. Keys are not stored in plaintext for security.
                  </p>
                </div>

                {/* Request Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">Endpoint</Label>
                    <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/products">Products</SelectItem>
                        <SelectItem value="/orders">Orders</SelectItem>
                        <SelectItem value="/customers">Customers</SelectItem>
                        <SelectItem value="/analytics">Analytics</SelectItem>
                        <SelectItem value="/inventory">Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Request Body (for POST/PUT) */}
                {(selectedMethod === 'POST' || selectedMethod === 'PUT') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requestBody">Request Body (JSON)</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={loadSampleData}
                      >
                        Load Sample
                      </Button>
                    </div>
                    <Textarea
                      id="requestBody"
                      placeholder="Enter JSON request body..."
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {/* Custom Headers */}
                <div className="space-y-2">
                  <Label htmlFor="customHeaders">Custom Headers (JSON)</Label>
                  <Textarea
                    id="customHeaders"
                    placeholder='{"X-Custom-Header": "value"}'
                    value={customHeaders}
                    onChange={(e) => setCustomHeaders(e.target.value)}
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Send Request Button */}
                <div className="flex gap-2">
                  <Button 
                    onClick={testApiEndpoint}
                    disabled={isTestingApi || !selectedApiKey}
                    className="flex-1"
                  >
                    {isTestingApi ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Request
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setTestResponse(null);
                      setRequestBody('');
                      setCustomHeaders('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Display */}
            {testResponse && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      Response
                      {testResponse.status >= 200 && testResponse.status < 300 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {testResponse.responseTime}ms
                      </div>
                      <Badge variant={testResponse.status >= 200 && testResponse.status < 300 ? "default" : "destructive"}>
                        {testResponse.status} {testResponse.statusText}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Response Headers */}
                  <div>
                    <Label className="text-sm font-medium">Headers</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(testResponse.headers, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Response Body */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Response Body</Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(testResponse.data, null, 2))}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-1 p-3 bg-muted rounded-md max-h-96 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {typeof testResponse.data === 'string' 
                          ? testResponse.data 
                          : JSON.stringify(testResponse.data, null, 2)
                        }
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test History */}
            {testHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tests</CardTitle>
                  <CardDescription>
                    Your last {testHistory.length} API tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testHistory.map((test, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setTestResponse(test)}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            {test.method} {test.endpoint}
                          </Badge>
                          <Badge variant={test.status >= 200 && test.status < 300 ? "default" : "destructive"}>
                            {test.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {test.responseTime}ms
                          <span>{formatDate(test.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
