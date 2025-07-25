
-- First, let's ensure we have a proper slug column for URL routing
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON public.products(slug) WHERE slug IS NOT NULL;

-- Update existing products with slugs based on title
UPDATE public.products SET slug = 
  CASE 
    WHEN title = 'Classic Gold Nameplate' THEN 'classic-gold-nameplate'
    WHEN title = 'Rose Gold Script Pendant' THEN 'rose-gold-script-pendant'
    WHEN title = 'Sterling Silver Nameplate' THEN 'sterling-silver-nameplate'
    WHEN title = 'Custom Cursive Pendant' THEN 'custom-cursive-pendant'
    WHEN title = 'Deluxe Gold Pendant' THEN 'deluxe-gold-pendant'
    WHEN title = 'Minimalist Bar Pendant' THEN 'minimalist-bar-pendant'
    WHEN title = 'Vintage Ornate Pendant' THEN 'vintage-ornate-pendant'
    WHEN title = 'Heart-Shaped Nameplate' THEN 'heart-shaped-nameplate'
    WHEN title = 'Infinity Name Pendant' THEN 'infinity-name-pendant'
    WHEN title = 'Double Layer Pendant' THEN 'double-layer-pendant'
    WHEN title = 'Birthstone Nameplate' THEN 'birthstone-nameplate'
    WHEN title = 'Family Tree Pendant' THEN 'family-tree-pendant'
  END
WHERE slug IS NULL;

-- Add rating and review_count columns to match your static data structure
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;

-- Update products with missing data to match your static structure
UPDATE public.products SET 
  rating = 5.0,
  review_count = 
    CASE title
      WHEN 'Classic Gold Nameplate' THEN 124
      WHEN 'Rose Gold Script Pendant' THEN 89
      WHEN 'Sterling Silver Nameplate' THEN 156
      WHEN 'Custom Cursive Pendant' THEN 67
      WHEN 'Deluxe Gold Pendant' THEN 203
      WHEN 'Minimalist Bar Pendant' THEN 98
      WHEN 'Vintage Ornate Pendant' THEN 142
      WHEN 'Heart-Shaped Nameplate' THEN 178
      WHEN 'Infinity Name Pendant' THEN 134
      WHEN 'Double Layer Pendant' THEN 87
      WHEN 'Birthstone Nameplate' THEN 156
      WHEN 'Family Tree Pendant' THEN 92
      ELSE 50
    END,
  category = 
    CASE title
      WHEN 'Classic Gold Nameplate' THEN 'gold'
      WHEN 'Rose Gold Script Pendant' THEN 'rose-gold'
      WHEN 'Sterling Silver Nameplate' THEN 'silver'
      WHEN 'Custom Cursive Pendant' THEN 'custom'
      WHEN 'Deluxe Gold Pendant' THEN 'gold'
      WHEN 'Minimalist Bar Pendant' THEN 'minimalist'
      WHEN 'Vintage Ornate Pendant' THEN 'vintage'
      WHEN 'Heart-Shaped Nameplate' THEN 'heart'
      WHEN 'Infinity Name Pendant' THEN 'infinity'
      WHEN 'Double Layer Pendant' THEN 'layered'
      WHEN 'Birthstone Nameplate' THEN 'birthstone'
      WHEN 'Family Tree Pendant' THEN 'family'
    END,
  is_new = title IN ('Classic Gold Nameplate', 'Custom Cursive Pendant', 'Vintage Ornate Pendant', 'Double Layer Pendant', 'Family Tree Pendant');
