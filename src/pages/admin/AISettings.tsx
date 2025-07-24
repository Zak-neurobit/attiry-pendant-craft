
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, RefreshCw, Settings, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { defaultModel, OPENAI_MODELS } from '@/services/openai';

export default function AISettings() {
  const [keyStatus, setKeyStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [usage, setUsage] = useState({ totalCalls: 0, estimatedCost: 0, lastCall: null });
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkKeyStatus();
    loadSettings();
    loadUsageStats();
  }, []);

  const checkKeyStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-ping');
      
      if (error) throw error;
      
      if (data.success) {
        setKeyStatus('configured');
      } else {
        setKeyStatus('missing');
      }
    } catch (error: any) {
      console.error('Key status check failed:', error);
      setKeyStatus('missing');
    }
  };

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_selected_model')
        .single();

      if (data?.value?.model) {
        setSelectedModel(data.value.model);
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
    }
  };

  const loadUsageStats = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_usage_stats')
        .single();

      if (data?.value) {
        setUsage(data.value);
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-ping');
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Connection Successful",
          description: `AI service is working properly with model: ${data.model}`,
        });
        setKeyStatus('configured');
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to AI service",
        variant: "destructive",
      });
      setKeyStatus('missing');
    } finally {
      setTesting(false);
    }
  };

  const saveModelSelection = async (model: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'ai_selected_model',
          value: { model, updated_at: new Date().toISOString() },
          description: 'Selected OpenAI model for AI features'
        });

      if (error) throw error;

      setSelectedModel(model);
      toast({
        title: "Settings Saved",
        description: `AI model updated to ${model}`,
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save model selection",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Settings</h1>
        <p className="text-muted-foreground">
          Configure OpenAI integration and AI-powered features
        </p>
      </div>

      {/* API Key Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            OpenAI API Configuration
          </CardTitle>
          <CardDescription>
            Manage your OpenAI API key and connection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">API Key Status</p>
                <p className="text-sm text-muted-foreground">
                  {keyStatus === 'checking' && 'Checking connection...'}
                  {keyStatus === 'configured' && 'Key on file ✓ (stored in Supabase Secrets)'}
                  {keyStatus === 'missing' && 'No API key configured'}
                </p>
              </div>
              <Badge variant={keyStatus === 'configured' ? 'default' : 'destructive'}>
                {keyStatus === 'checking' ? (
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                ) : keyStatus === 'configured' ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {keyStatus === 'checking' ? 'Checking' : keyStatus === 'configured' ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
            <Button onClick={testConnection} disabled={testing} variant="outline">
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>
            Choose the OpenAI model for AI-powered features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Model</label>
            <Select
              value={selectedModel}
              onValueChange={saveModelSelection}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {OPENAI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              GPT-4.1 Mini is recommended for the best balance of performance and cost.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Statistics
          </CardTitle>
          <CardDescription>
            Monitor your AI feature usage and costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{usage.totalCalls || 0}</p>
              <p className="text-sm text-muted-foreground">Total API Calls</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">${(usage.estimatedCost || 0).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">
                {usage.lastCall ? new Date(usage.lastCall).toLocaleDateString() : 'Never'}
              </p>
              <p className="text-sm text-muted-foreground">Last Used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle>Available AI Features</CardTitle>
          <CardDescription>
            AI-powered tools available in your admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Product Image Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Automatically generate descriptions from product images
                </p>
              </div>
              <Badge variant={keyStatus === 'configured' ? 'default' : 'secondary'}>
                {keyStatus === 'configured' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Description Enhancement</p>
                <p className="text-sm text-muted-foreground">
                  Improve product descriptions with AI suggestions
                </p>
              </div>
              <Badge variant={keyStatus === 'configured' ? 'default' : 'secondary'}>
                {keyStatus === 'configured' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">SEO Metadata Generation</p>
                <p className="text-sm text-muted-foreground">
                  Generate optimized titles and descriptions for SEO
                </p>
              </div>
              <Badge variant={keyStatus === 'configured' ? 'default' : 'secondary'}>
                {keyStatus === 'configured' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
