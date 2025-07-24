
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Key, Save, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { defaultModel } from '@/services/openai';

interface KeyStatus {
  exists: boolean;
  lastUpdated?: string;
  updatedBy?: string;
}

interface UsageStats {
  totalCalls?: number;
  lastCall?: string;
  estimatedCost?: number;
}

const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [keyStatus, setKeyStatus] = useState<KeyStatus>({ exists: false });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Check if API key exists (without exposing the actual key)
      const { data: keyData, error: keyError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'openai_api_key')
        .single();

      if (!keyError && keyData) {
        const keyValue = keyData.value as any;
        setKeyStatus({
          exists: true,
          lastUpdated: keyValue?.updated_at,
          updatedBy: keyValue?.updated_by
        });
      }

      // Get selected model
      const { data: modelData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_selected_model')
        .single();

      if (modelData) {
        const modelValue = modelData.value as any;
        setSelectedModel(modelValue?.model || defaultModel);
      }

      // Get usage stats
      const { data: statsData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ai_usage_stats')
        .single();

      if (statsData) {
        setUsageStats(statsData.value as UsageStats);
      }

    } catch (error: any) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim() || !apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('save-openai-key', {
        body: { key: apiKey },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setKeyStatus({
        exists: true,
        lastUpdated: data?.updated_at
      });
      setApiKey('');
      setShowKeyInput(false);

      toast({
        title: "API Key Saved",
        description: "OpenAI API key has been securely saved",
      });

    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveModelSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'ai_selected_model',
          value: { model: selectedModel },
          description: 'Selected AI model for generation tasks'
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "AI model settings have been updated",
      });

    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!keyStatus.exists) {
      toast({
        title: "No API Key",
        description: "Please save an OpenAI API key first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-ping');

      if (error) throw error;

      toast({
        title: "Connection Successful",
        description: `OpenAI API is working correctly with model: ${data.model}`,
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect to OpenAI API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Settings</h1>
        <p className="text-muted-foreground">
          Configure AI features and OpenAI integration
        </p>
      </div>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyStatus.exists && !showKeyInput ? (
            <div className="space-y-4">
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>
                      Key on file ✓ (Supabase Secrets) • Last updated{' '}
                      {keyStatus.lastUpdated 
                        ? new Date(keyStatus.lastUpdated).toLocaleDateString()
                        : 'Unknown'
                      }
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowKeyInput(true)}
                      >
                        Replace Key
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testConnection}
                        disabled={loading}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Test Connection
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your API key will be securely stored in Supabase Secrets and never exposed to the browser
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={saveApiKey} 
                  disabled={saving || !apiKey.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save API Key'}
                </Button>
                {keyStatus.exists && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowKeyInput(false);
                      setApiKey('');
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Model Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="model">Default AI Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4.1-mini">GPT-4.1 Mini (Recommended - Fast & Efficient)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Vision Capable)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (Most Capable)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Default model: <code>{defaultModel}</code> - All AI features will use this model unless specified otherwise
            </p>
          </div>
          
          <Button onClick={saveModelSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Model Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Total API Calls</Label>
                <p className="text-2xl font-bold">{usageStats.totalCalls || 0}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Call</Label>
                <p className="text-sm text-muted-foreground">
                  {usageStats.lastCall 
                    ? new Date(usageStats.lastCall).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Estimated Cost</Label>
                <p className="text-2xl font-bold">
                  ${(usageStats.estimatedCost || 0).toFixed(4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Product Description Enhancement</span>
              <Badge variant={keyStatus.exists ? "default" : "secondary"}>
                {keyStatus.exists ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Image Analysis</span>
              <Badge variant={keyStatus.exists ? "default" : "secondary"}>
                {keyStatus.exists ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SEO Metadata Generation</span>
              <Badge variant={keyStatus.exists ? "default" : "secondary"}>
                {keyStatus.exists ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>

          {!keyStatus.exists && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Configure your OpenAI API key to enable AI-powered features
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
