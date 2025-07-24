
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, Zap, DollarSign, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AISettings() {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4.1-mini');
  const [availableModels, setAvailableModels] = useState([
    'gpt-4.1-mini',
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4-vision-preview',
    'gpt-3.5-turbo-0125',
    'dalle-3',
    'text-embedding-3-small'
  ]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isRefreshingModels, setIsRefreshingModels] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [usageStats, setUsageStats] = useState({
    totalCalls: 0,
    lastCall: null as string | null,
    estimatedCost: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
    loadUsageStats();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: apiKeyData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'openai_api_key')
        .single();

      const { data: modelData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_selected_model')
        .single();

      if (apiKeyData?.value?.api_key) {
        const key = apiKeyData.value.api_key;
        setApiKey(`${key.substring(0, 8)}${'*'.repeat(Math.max(0, key.length - 12))}${key.substring(key.length - 4)}`);
      }

      if (modelData?.value?.model) {
        setSelectedModel(modelData.value.model);
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
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
        setUsageStats(data.value);
      }
    } catch (error) {
      console.error('Error loading usage stats:', error);
    }
  };

  const testConnection = async () => {
    if (!apiKey || apiKey.includes('*')) {
      toast.error('Please enter a valid API key first');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const response = await supabase.functions.invoke('ai-test-connection', {
        body: { apiKey }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setConnectionStatus('success');
      toast.success('OpenAI connection successful!');
    } catch (error) {
      setConnectionStatus('error');
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const refreshModelList = async () => {
    if (!apiKey || apiKey.includes('*')) {
      toast.error('Please enter a valid API key first');
      return;
    }

    setIsRefreshingModels(true);

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      const models = data.data
        .map((model: any) => model.id)
        .filter((id: string) => 
          id.includes('gpt') || 
          id.includes('dalle') || 
          id.includes('embedding')
        )
        .sort();

      setAvailableModels(models);
      toast.success('Model list refreshed successfully!');
    } catch (error) {
      toast.error("Couldn't fetch live model list—using default options.");
    } finally {
      setIsRefreshingModels(false);
    }
  };

  const saveSettings = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSaving(true);

    try {
      // Save API key if it's not masked
      if (!apiKey.includes('*')) {
        const { error: apiKeyError } = await supabase
          .from('site_settings')
          .upsert({
            key: 'openai_api_key',
            value: { api_key: apiKey },
            description: 'OpenAI API key for AI features'
          });

        if (apiKeyError) throw apiKeyError;
      }

      // Save selected model
      const { error: modelError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'ai_selected_model',
          value: { model: selectedModel },
          description: 'Selected OpenAI model for AI operations'
        });

      if (modelError) throw modelError;

      toast.success(`AI model set to ${selectedModel}.`);
      loadSettings(); // Reload to mask the API key
    } catch (error) {
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure OpenAI integration for AI-powered product descriptions and metadata generation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              OpenAI Configuration
            </CardTitle>
            <CardDescription>
              Set up your OpenAI API key and model preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1"
                />
                <Button
                  onClick={testConnection}
                  disabled={isTestingConnection || !apiKey}
                  variant="outline"
                >
                  {isTestingConnection ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : connectionStatus === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : connectionStatus === 'error' ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    'Test'
                  )}
                </Button>
              </div>
              {connectionStatus === 'success' && (
                <p className="text-sm text-green-600">✓ Connection verified</p>
              )}
              {connectionStatus === 'error' && (
                <p className="text-sm text-red-600">✗ Connection failed</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <div className="flex gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={refreshModelList}
                  disabled={isRefreshingModels || !apiKey || apiKey.includes('*')}
                  variant="outline"
                  size="sm"
                >
                  {isRefreshingModels ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    'Refresh list'
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={saveSettings} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
            <CardDescription>
              Monitor your AI usage and estimated costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total API Calls</span>
                <Badge variant="secondary">{usageStats.totalCalls}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estimated Cost</span>
                <Badge variant="secondary">${usageStats.estimatedCost.toFixed(2)}</Badge>
              </div>

              {usageStats.lastCall && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Call</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(usageStats.lastCall).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
          <CardDescription>
            Available AI-powered features in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Product Description Enhancement</p>
                <p className="text-sm text-gray-600">AI-powered product description generation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">SEO Metadata Generation</p>
                <p className="text-sm text-gray-600">Automatic title and description optimization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Image Analysis</p>
                <p className="text-sm text-gray-600">Extract product details from images</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Smart Recommendations</p>
                <p className="text-sm text-gray-600">AI-driven product suggestions (Coming Soon)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
