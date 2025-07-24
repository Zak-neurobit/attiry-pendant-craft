
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Key, Settings } from 'lucide-react';

export const AISettings = () => {
  const [model, setModel] = useState('gpt-4o-mini');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = async () => {
    try {
      // Check if OpenAI API key exists in settings
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'openai_api_key')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setHasApiKey(!!data);
    } catch (error: any) {
      console.error('Error checking API key status:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'ai_model',
          value: { model },
          description: 'Default AI model for content generation'
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "AI settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Settings</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Settings</h1>
        <p className="text-muted-foreground">
          Configure AI content generation and automation
        </p>
      </div>

      <div className="grid gap-6">
        {/* API Key Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OpenAI API Key
            </CardTitle>
            <CardDescription>
              API key status for OpenAI integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hasApiKey ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Key on file ✓
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      (stored in Supabase Secrets)
                    </span>
                  </>
                ) : (
                  <>
                    <Badge variant="destructive">
                      No key configured
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      API key required for AI features
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Model Configuration
            </CardTitle>
            <CardDescription>
              Configure the default AI model for content generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-select">Default Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recommended)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                GPT-4o Mini provides the best balance of speed, cost, and quality for product descriptions.
              </p>
            </div>

            <Button onClick={saveSettings} className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle>Available AI Features</CardTitle>
            <CardDescription>
              AI-powered functionality in your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Product Description Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate compelling product descriptions from images
                  </p>
                </div>
                <Badge variant={hasApiKey ? "default" : "secondary"}>
                  {hasApiKey ? "Active" : "Needs API Key"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">SEO Meta Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic meta titles and descriptions for better SEO
                  </p>
                </div>
                <Badge variant={hasApiKey ? "default" : "secondary"}>
                  {hasApiKey ? "Active" : "Needs API Key"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
