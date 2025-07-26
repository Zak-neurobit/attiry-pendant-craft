-- Add featured product columns to products table
ALTER TABLE public.products 
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN featured_order INTEGER DEFAULT 0;

-- Create index for better performance when querying featured products
CREATE INDEX idx_products_featured ON products(is_featured, featured_order);

-- Update existing products to have a default featured_order based on creation date
-- This ensures older products have higher featured_order values if they get featured
UPDATE public.products 
SET featured_order = EXTRACT(EPOCH FROM created_at)::INTEGER 
WHERE featured_order = 0;