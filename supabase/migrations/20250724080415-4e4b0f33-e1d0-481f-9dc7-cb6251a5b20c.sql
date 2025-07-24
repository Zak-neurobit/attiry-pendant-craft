
-- Add missing columns to products table for enhanced product management
ALTER TABLE public.products 
ADD COLUMN compare_price NUMERIC DEFAULT 0,
ADD COLUMN chain_types TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN fonts TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN meta_title TEXT DEFAULT '',
ADD COLUMN meta_description TEXT DEFAULT '',
ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update existing products to have default values for new columns
UPDATE public.products 
SET 
  compare_price = 0,
  chain_types = ARRAY[]::TEXT[],
  fonts = ARRAY[]::TEXT[],
  meta_title = '',
  meta_description = '',
  tags = ARRAY[]::TEXT[]
WHERE compare_price IS NULL;
