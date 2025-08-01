-- Create site_settings table for storing application-wide configuration
CREATE TABLE public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings table
-- Only admins can read, insert, update, and delete site settings
CREATE POLICY "Admins can manage all site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at column
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_site_settings_key ON public.site_settings(key);
CREATE INDEX idx_site_settings_created_at ON public.site_settings(created_at);

-- Insert some default settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', '"Attiry Pendant Craft"', 'The name of the website'),
  ('site_description', '"Custom jewelry and pendant crafting"', 'Website description for SEO'),
  ('currency_default', '"USD"', 'Default currency for the store'),
  ('ai_features_enabled', 'true', 'Whether AI features are enabled globally');