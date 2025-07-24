
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Key, Zap, AlertCircle, CheckCircle, Settings, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [usage, setUsage] = useState({
    totalCalls: 0,
    lastCall: null as string | null,
    estimatedCost: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    checkExistingConnection();
    loadUsageStats();
  }, []);

  const checkExistingConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'openai_api_key')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setIsConnected(true);
        setApiKey('sk-...hidden');
      }
    } catch (error: any) {
      console.error('Error checking connection:', error);
    }
  };

  const loadUsageStats = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_usage_stats')
        .single();

      if (error && error.code !== 'PGRST116') return;
      
      if (data) {
        setUsage(data.value as typeof usage);
      }
    } catch (error: any) {
      console.error('Error loading usage stats:', error);
    }
  };

  const testConnection = async () => {
    if (!apiKey || apiKey === 'sk-...hidden') {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-test-connection', {
        body: { apiKey }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Connection Successful",
          description: "OpenAI API key is working correctly",
        });
        setIsConnected(true);
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to OpenAI API",
        variant: "destructive",
      });
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey || apiKey === 'sk-...hidden') {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'openai_api_key',
          value: { api_key: apiKey },
          description: 'OpenAI API key for AI features'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "OpenAI API key saved successfully",
      });

      setApiKey('sk-...hidden');
      await testConnection();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectAI = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('key', 'openai_api_key');

      if (error) throw error;

      setIsConnected(false);
      setApiKey('');
      toast({
        title: "Disconnected",
        description: "OpenAI API key has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Settings</h1>
        <p className="text-muted-foreground">
          Configure AI content generation and automation
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={testConnection}
                  disabled={isTesting || !apiKey || apiKey === 'sk-...hidden'}
                  variant="outline"
                >
                  {isTesting ? 'Testing...' : 'Test'}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={saveApiKey}
                disabled={isLoading || !apiKey || apiKey === 'sk-...hidden'}
              >
                {isLoading ? 'Saving...' : 'Save API Key'}
              </Button>
              {isConnected && (
                <Button
                  onClick={disconnectAI}
                  variant="destructive"
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Product Image Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Automatically analyze product images to generate descriptions and detect colors
              </p>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Enabled" : "Requires API Key"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Description Enhancement</h4>
              <p className="text-sm text-muted-foreground">
                Improve product descriptions with AI-powered content generation
              </p>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Enabled" : "Requires API Key"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">SEO Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Generate optimized meta titles and descriptions for better search visibility
              </p>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Enabled" : "Requires API Key"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Content Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                Get AI-powered suggestions for product titles, tags, and marketing copy
              </p>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Enabled" : "Requires API Key"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Total API Calls</h4>
                <p className="text-2xl font-bold">{usage.totalCalls.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Last API Call</h4>
                <p className="text-sm text-muted-foreground">
                  {usage.lastCall 
                    ? new Date(usage.lastCall).toLocaleDateString()
                    : "No calls yet"
                  }
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Estimated Cost (This Month)</h4>
                <p className="text-2xl font-bold">${usage.estimatedCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISettings;
