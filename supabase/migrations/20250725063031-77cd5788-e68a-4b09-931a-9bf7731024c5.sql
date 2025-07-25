
-- Create products table with proper schema for custom name pendants
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  compare_price NUMERIC DEFAULT 0,
  description TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  color_variants color_variant[] DEFAULT ARRAY['gold'::color_variant],
  chain_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  fonts TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sku TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  keywords TEXT[],
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  cogs NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create color_variant enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE color_variant AS ENUM ('gold', 'rose-gold', 'silver', 'copper');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update products table to use the enum
ALTER TABLE public.products 
ALTER COLUMN color_variants SET DEFAULT ARRAY['gold'::color_variant];

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert the 12 products from your shop
INSERT INTO public.products (title, price, compare_price, description, image_urls, color_variants, stock, tags, keywords) VALUES
('Classic Gold Nameplate', 79.99, 99.99, 'Elegant 18k gold-plated nameplate pendant with classic script engraving.', ARRAY['/src/assets/product-gold.jpg'], ARRAY['gold'::color_variant, 'rose-gold'::color_variant, 'silver'::color_variant], 50, ARRAY['bestseller', 'classic'], ARRAY['nameplate', 'gold', 'pendant', 'jewelry']),
('Rose Gold Script Pendant', 74.99, 94.99, 'Beautiful rose gold pendant featuring elegant script lettering.', ARRAY['/src/assets/product-rose-gold.jpg'], ARRAY['rose-gold'::color_variant, 'gold'::color_variant, 'silver'::color_variant], 45, ARRAY['trending', 'elegant'], ARRAY['rose gold', 'script', 'pendant']),
('Sterling Silver Nameplate', 69.99, 89.99, 'Premium sterling silver nameplate with precision engraving.', ARRAY['/src/assets/product-gold.jpg'], ARRAY['silver'::color_variant, 'gold'::color_variant, 'rose-gold'::color_variant], 60, ARRAY['premium', 'silver'], ARRAY['sterling silver', 'nameplate']),
('Custom Cursive Pendant', 84.99, 104.99, 'Handcrafted cursive name pendant in your choice of metal finish.', ARRAY['/src/assets/product-rose-gold.jpg'], ARRAY['gold'::color_variant, 'silver'::color_variant, 'rose-gold'::color_variant], 35, ARRAY['custom', 'handcrafted'], ARRAY['cursive', 'custom', 'handcrafted']),
('Deluxe Gold Pendant', 89.99, 119.99, 'Premium gold-plated pendant with diamond-cut edges.', ARRAY['/src/assets/product-gold.jpg'], ARRAY['gold'::color_variant, 'rose-gold'::color_variant], 30, ARRAY['deluxe', 'premium'], ARRAY['deluxe', 'gold', 'diamond-cut']),
('Minimalist Bar Pendant', 64.99, 84.99, 'Sleek and modern bar-style name pendant in multiple finishes.', ARRAY['/src/assets/product-rose-gold.jpg'], ARRAY['silver'::color_variant, 'gold'::color_variant, 'rose-gold'::color_variant], 55, ARRAY['minimalist', 'modern'], ARRAY['minimalist', 'bar', 'modern']),
('Vintage Ornate Pendant', 94.99, 124.99, 'Vintage-inspired pendant with ornate decorative borders.', ARRAY['/src/assets/product-gold.jpg'], ARRAY['gold'::color_variant, 'silver'::color_variant, 'copper'::color_variant], 25, ARRAY['vintage', 'ornate'], ARRAY['vintage', 'ornate', 'decorative']),
('Heart-Shaped Nameplate', 72.99, 92.99, 'Romantic heart-shaped pendant perfect for gifts.', ARRAY['/src/assets/product-rose-gold.jpg'], ARRAY['rose-gold'::color_variant, 'gold'::color_variant, 'silver'::color_variant], 40, ARRAY['romantic', 'gift'], ARRAY['heart', 'romantic', 'gift']),
('Infinity Name Pendant', 79.99, 99.99, 'Elegant infinity symbol combined with custom name engraving.', ARRAY['/src/assets/product-gold.jpg'], ARRAY['gold'::color_variant, 'silver'::color_variant, 'rose-gold'::color_variant], 42, ARRAY['infinity', 'symbolic'], ARRAY['infinity', 'symbol', 'elegant']),
('Double Layer Pendant', 104.99, 134.99, 'Sophisticated double-layer design with contrasting metals.', ARRAY['/src/assets/product-rose-gold.jpg'], ARRAY['gold'::color_variant, 'silver'::color_variant], 20, ARRAY['sophisticated', 'layered'], ARRAY['double layer', 'sophisticated', 'contrasting']),
('Birthstone Nameplate', 99.99, 129.99, 'Personalized nameplate with genuine birthstone accent.', ARRAY['/src/assets/product-gold.jpg'], ARRAY['gold'::color_variant, 'rose-gold'::color_variant, 'silver'::color_variant], 35, ARRAY['birthstone', 'personalized'], ARRAY['birthstone', 'personalized', 'genuine']),
('Family Tree Pendant', 114.99, 149.99, 'Beautiful family tree design with custom name engravings.', ARRAY['/src/assets/product-rose-gold.jpg'], ARRAY['gold'::color_variant, 'silver'::color_variant, 'rose-gold'::color_variant], 18, ARRAY['family', 'tree'], ARRAY['family tree', 'custom', 'engravings']);
