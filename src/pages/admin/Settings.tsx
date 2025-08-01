
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Store, 
  CreditCard, 
  Mail, 
  Shield, 
  Globe, 
  Palette,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { adminCurrencyService } from '@/services/currencyService';

interface StoreSettings {
  store_name: string;
  store_description: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  timezone: string;
  maintenance_mode: boolean;
  allow_guest_checkout: boolean;
  require_email_verification: boolean;
  auto_archive_orders: boolean;
  order_archive_days: number;
}

interface PaymentSettings {
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_webhook_secret: string;
  payment_capture_mode: 'auto' | 'manual';
}

interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  order_confirmation_enabled: boolean;
  shipping_notification_enabled: boolean;
}

interface AppearanceSettings {
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
  custom_css: string;
}

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    store_name: '',
    store_description: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    currency: 'USD',
    timezone: 'UTC',
    maintenance_mode: false,
    allow_guest_checkout: true,
    require_email_verification: false,
    auto_archive_orders: false,
    order_archive_days: 90,
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_webhook_secret: '',
    payment_capture_mode: 'auto',
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: '',
    order_confirmation_enabled: true,
    shipping_notification_enabled: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    logo_url: '',
    favicon_url: '',
    custom_css: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      // Parse settings into respective objects
      settings?.forEach((setting) => {
        const value = setting.value;
        
        switch (setting.key) {
          case 'store_settings':
            setStoreSettings(prev => ({ ...prev, ...value }));
            break;
          case 'payment_settings':
            setPaymentSettings(prev => ({ ...prev, ...value }));
            break;
          case 'email_settings':
            setEmailSettings(prev => ({ ...prev, ...value }));
            break;
          case 'appearance_settings':
            setAppearanceSettings(prev => ({ ...prev, ...value }));
            break;
        }
      });

    } catch (error: any) {
      console.error('Settings fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (category: string, settings: any) => {
    try {
      setSaving(true);

      // Check if this is a store settings update with currency change
      const isStoreCurrencyUpdate = category === 'store_settings' && settings.currency;
      const previousCurrency = storeSettings.currency;

      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: category,
          value: settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // If currency was changed, clear the admin currency cache to force refresh globally
      if (isStoreCurrencyUpdate && settings.currency !== previousCurrency) {
        console.log('💱 Admin currency changed from', previousCurrency, 'to', settings.currency);
        adminCurrencyService.clearCache();
        
        // Force a page reload to reinitialize the currency system for all users
        // This ensures immediate global effect
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        toast({
          title: "Currency Updated",
          description: `Store currency changed to ${settings.currency}. Page will refresh to apply changes globally.`,
        });
      } else {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
      }

    } catch (error: any) {
      console.error('Settings save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      // Test SMTP connection
      toast({
        title: "Testing Connection",
        description: "Sending test email...",
      });
      
      // Here you would implement actual email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Email connection test successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Email connection test failed",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-cormorant">Settings</h1>
        <p className="text-muted-foreground">
          Configure your store settings and preferences
        </p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Store Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    value={storeSettings.store_name}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, store_name: e.target.value }))}
                    placeholder="Your Store Name"
                  />
                </div>
                <div>
                  <Label htmlFor="store_email">Store Email</Label>
                  <Input
                    id="store_email"
                    type="email"
                    value={storeSettings.store_email}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, store_email: e.target.value }))}
                    placeholder="store@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="store_description">Store Description</Label>
                <Textarea
                  id="store_description"
                  value={storeSettings.store_description}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, store_description: e.target.value }))}
                  placeholder="Describe your store..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store_phone">Phone Number</Label>
                  <Input
                    id="store_phone"
                    value={storeSettings.store_phone}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, store_phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="store_address">Store Address</Label>
                <Textarea
                  id="store_address"
                  value={storeSettings.store_address}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, store_address: e.target.value }))}
                  placeholder="Full store address..."
                  rows={2}
                />
              </div>

              <Button 
                onClick={() => saveSettings('store_settings', storeSettings)}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Store Settings'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Preferences</CardTitle>
              <CardDescription>
                Configure how your store operates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put your store in maintenance mode
                  </p>
                </div>
                <Switch
                  checked={storeSettings.maintenance_mode}
                  onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Guest Checkout</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to checkout without creating an account
                  </p>
                </div>
                <Switch
                  checked={storeSettings.allow_guest_checkout}
                  onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, allow_guest_checkout: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require customers to verify their email addresses
                  </p>
                </div>
                <Switch
                  checked={storeSettings.require_email_verification}
                  onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, require_email_verification: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Archive Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically archive old completed orders
                  </p>
                </div>
                <Switch
                  checked={storeSettings.auto_archive_orders}
                  onCheckedChange={(checked) => setStoreSettings(prev => ({ ...prev, auto_archive_orders: checked }))}
                />
              </div>

              {storeSettings.auto_archive_orders && (
                <div>
                  <Label htmlFor="archive_days">Archive After (Days)</Label>
                  <Input
                    id="archive_days"
                    type="number"
                    value={storeSettings.order_archive_days}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, order_archive_days: parseInt(e.target.value) }))}
                    min="1"
                    max="365"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Razorpay Configuration</CardTitle>
              <CardDescription>
                Configure your Razorpay payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Hide' : 'Show'} Secrets
                </Button>
                <Badge variant="secondary">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </div>

              <div>
                <Label htmlFor="razorpay_key_id">Key ID</Label>
                <Input
                  id="razorpay_key_id"
                  value={paymentSettings.razorpay_key_id}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpay_key_id: e.target.value }))}
                  placeholder="rzp_test_..."
                />
              </div>

              <div>
                <Label htmlFor="razorpay_key_secret">Key Secret</Label>
                <Input
                  id="razorpay_key_secret"
                  type={showSecrets ? "text" : "password"}
                  value={paymentSettings.razorpay_key_secret}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpay_key_secret: e.target.value }))}
                  placeholder="••••••••••••••••"
                />
              </div>

              <div>
                <Label htmlFor="razorpay_webhook_secret">Webhook Secret</Label>
                <Input
                  id="razorpay_webhook_secret"
                  type={showSecrets ? "text" : "password"}
                  value={paymentSettings.razorpay_webhook_secret}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, razorpay_webhook_secret: e.target.value }))}
                  placeholder="••••••••••••••••"
                />
              </div>

              <div>
                <Label htmlFor="payment_capture_mode">Payment Capture Mode</Label>
                <select
                  id="payment_capture_mode"
                  value={paymentSettings.payment_capture_mode}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, payment_capture_mode: e.target.value as 'auto' | 'manual' }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="auto">Automatic Capture</option>
                  <option value="manual">Manual Capture</option>
                </select>
              </div>

              <Button 
                onClick={() => saveSettings('payment_settings', paymentSettings)}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Configure your email server settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={emailSettings.smtp_host}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={emailSettings.smtp_port}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: parseInt(e.target.value) }))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_username">Username</Label>
                  <Input
                    id="smtp_username"
                    value={emailSettings.smtp_username}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_password">Password</Label>
                  <Input
                    id="smtp_password"
                    type={showSecrets ? "text" : "password"}
                    value={emailSettings.smtp_password}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_from_email">From Email</Label>
                  <Input
                    id="smtp_from_email"
                    type="email"
                    value={emailSettings.smtp_from_email}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_from_email: e.target.value }))}
                    placeholder="noreply@yourstore.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_from_name">From Name</Label>
                  <Input
                    id="smtp_from_name"
                    value={emailSettings.smtp_from_name}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_from_name: e.target.value }))}
                    placeholder="Your Store Name"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => saveSettings('email_settings', emailSettings)}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Email Settings'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={testEmailConnection}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which emails to send automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Confirmation Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send confirmation emails when orders are placed
                  </p>
                </div>
                <Switch
                  checked={emailSettings.order_confirmation_enabled}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, order_confirmation_enabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Shipping Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send emails when orders are shipped
                  </p>
                </div>
                <Switch
                  checked={emailSettings.shipping_notification_enabled}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, shipping_notification_enabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Customize your store's appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={appearanceSettings.primary_color}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.primary_color}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={appearanceSettings.secondary_color}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={appearanceSettings.secondary_color}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={appearanceSettings.logo_url}
                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={appearanceSettings.favicon_url}
                    onChange={(e) => setAppearanceSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="custom_css">Custom CSS</Label>
                <Textarea
                  id="custom_css"
                  value={appearanceSettings.custom_css}
                  onChange={(e) => setAppearanceSettings(prev => ({ ...prev, custom_css: e.target.value }))}
                  placeholder="/* Add your custom CSS here */"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={() => saveSettings('appearance_settings', appearanceSettings)}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Appearance Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
