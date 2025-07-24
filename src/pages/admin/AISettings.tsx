
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Sparkles, 
  Activity, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { OPENAI_MODELS, defaultModel, type OpenAIModel } from '@/services/openai';

export default function AISettings() {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>(defaultModel);
  const [keyStatus, setKeyStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
  const [usageStats, setUsageStats] = useState({
    totalCalls: 0,
    estimatedCost: 0,
    lastCall: null as any
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    loadUsageStats();
  }, []);

  const loadSettings = async () => {
    try {
      // Check if API key exists (without retrieving it)
      const { data: pingData, error: pingError } = await supabase.functions.invoke('ai-ping');
      
      if (pingError) {
        console.error('Ping error:', pingError);
        setKeyStatus('invalid');
        return;
      }

      if (pingData?.success) {
        setKeyStatus('valid');
        if (pingData.model) {
          setSelectedModel(pingData.model as OpenAIModel);
        }
      } else {
        setKeyStatus('invalid');
      }
    } catch (error) {
      console.error('Error checking API key status:', error);
      setKeyStatus('invalid');
    }
  };

  const loadUsageStats = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_usage_stats')
        .single();

      if (error) {
        console.error('Error loading usage stats:', error);
        return;
      }

      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        const stats = data.value as any;
        setUsageStats({
          totalCalls: stats.totalCalls || 0,
          estimatedCost: stats.estimatedCost || 0,
          lastCall: stats.lastCall || null
        });
      }
    } catch (error) {
      console.error('Error loading usage stats:', error);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-openai-key', {
        body: { 
          key: apiKey.trim(),
          model: selectedModel
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "OpenAI API key saved successfully",
      });
      
      setApiKey('');
      setKeyStatus('valid');
      await loadSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-ping');
      
      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Connection Successful",
          description: `OpenAI API is working with ${data.model || defaultModel}`,
        });
        setKeyStatus('valid');
      } else {
        throw new Error(data?.error || 'Connection test failed');
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to OpenAI API",
        variant: "destructive",
      });
      setKeyStatus('invalid');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="ai-settings-page">
      {/* Header */}
      <div id="ai-settings-header">
        <h1 className="text-3xl font-bold" id="page-title">AI Settings</h1>
        <p className="text-muted-foreground" id="page-description">
          Configure OpenAI integration for product descriptions, metadata generation, and image analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="ai-settings-grid">
        {/* API Configuration */}
        <Card id="api-config-card">
          <CardHeader id="api-config-header">
            <CardTitle className="flex items-center gap-2" id="api-config-title">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription id="api-config-description">
              Manage your OpenAI API key and model settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" id="api-config-content">
            {/* API Key Status */}
            <div className="flex items-center justify-between" id="api-key-status">
              <Label id="status-label">API Key Status</Label>
              <Badge variant={keyStatus === 'valid' ? 'default' : keyStatus === 'invalid' ? 'destructive' : 'secondary'} id="status-badge">
                {keyStatus === 'valid' && <CheckCircle className="h-3 w-3 mr-1" />}
                {keyStatus === 'invalid' && <AlertCircle className="h-3 w-3 mr-1" />}
                {keyStatus === 'valid' ? 'Connected' : keyStatus === 'invalid' ? 'Disconnected' : 'Unknown'}
              </Badge>
            </div>

            <Separator />

            {/* Model Selection */}
            <div className="space-y-2" id="model-selection">
              <Label htmlFor="model-select" id="model-label">OpenAI Model</Label>
              <Select value={selectedModel} onValueChange={(value: OpenAIModel) => setSelectedModel(value)}>
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent id="model-content">
                  {OPENAI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value} id={`model-option-${model.value}`}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* API Key Input */}
            <div className="space-y-2" id="api-key-input">
              <Label htmlFor="api-key" id="api-key-label">OpenAI API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground" id="api-key-help">
                Your API key is stored securely in Supabase Secrets
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2" id="api-action-buttons">
              <Button 
                onClick={handleSaveKey} 
                disabled={loading}
                className="flex-1"
                id="save-key-button"
              >
                {loading ? 'Saving...' : 'Save API Key'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={testLoading}
                id="test-connection-button"
              >
                {testLoading ? 'Testing...' : 'Test'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card id="usage-stats-card">
          <CardHeader id="usage-stats-header">
            <CardTitle className="flex items-center gap-2" id="usage-stats-title">
              <Activity className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
            <CardDescription id="usage-stats-description">
              Monitor your AI API usage and costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" id="usage-stats-content">
            <div className="grid grid-cols-2 gap-4" id="usage-stats-grid">
              <div className="text-center" id="total-calls-stat">
                <div className="text-2xl font-bold" id="total-calls-number">{usageStats.totalCalls}</div>
                <div className="text-sm text-muted-foreground" id="total-calls-label">Total Calls</div>
              </div>
              <div className="text-center" id="estimated-cost-stat">
                <div className="text-2xl font-bold flex items-center justify-center gap-1" id="estimated-cost-display">
                  <DollarSign className="h-4 w-4" />
                  {usageStats.estimatedCost.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground" id="estimated-cost-label">Estimated Cost</div>
              </div>
            </div>

            {usageStats.lastCall && (
              <div className="text-center" id="last-call-stat">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground" id="last-call-display">
                  <Clock className="h-3 w-3" />
                  Last call: {new Date(usageStats.lastCall).toLocaleDateString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Features */}
      <Card id="ai-features-card">
        <CardHeader id="ai-features-header">
          <CardTitle className="flex items-center gap-2" id="ai-features-title">
            <Sparkles className="h-5 w-5" />
            AI Features
          </CardTitle>
          <CardDescription id="ai-features-description">
            Available AI-powered features for your products
          </CardDescription>
        </CardHeader>
        <CardContent id="ai-features-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="ai-features-grid">
            <div className="text-center p-4 border rounded-lg" id="feature-description">
              <Settings className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1" id="feature-description-title">Description Enhancement</h3>
              <p className="text-sm text-muted-foreground" id="feature-description-text">
                Generate compelling product descriptions
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg" id="feature-metadata">
              <Key className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1" id="feature-metadata-title">SEO Metadata</h3>
              <p className="text-sm text-muted-foreground" id="feature-metadata-text">
                Auto-generate titles, descriptions, and keywords
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg" id="feature-analysis">
              <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1" id="feature-analysis-title">Image Analysis</h3>
              <p className="text-sm text-muted-foreground" id="feature-analysis-text">
                Analyze product images for automatic tagging
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
