-- Insert sample products to test website display
INSERT INTO public.products (
  title,
  description,
  price,
  compare_price,
  stock,
  sku,
  is_active,
  is_featured,
  featured_order,
  image_urls,
  color_variants,
  chain_types,
  fonts,
  meta_title,
  meta_description,
  keywords,
  tags,
  cogs
) VALUES 
(
  'Classic Gold Name Pendant',
  'Beautiful handcrafted gold pendant with personalized name engraving. Perfect for everyday wear or special occasions.',
  299.99,
  399.99,
  50,
  'CGP-001',
  true,
  true,
  1,
  ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500'],
  ARRAY['gold']::color_variant[],
  ARRAY['18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Cursive'],
  'Classic Gold Name Pendant - Personalized Jewelry',
  'Elegant gold name pendant with custom engraving. High-quality craftsmanship and premium materials.',
  ARRAY['gold pendant', 'personalized jewelry', 'name necklace', 'custom jewelry'],
  ARRAY['featured', 'bestseller', 'personalized'],
  75.00
),
(
  'Rose Gold Heart Pendant',
  'Romantic rose gold pendant shaped like a heart with elegant name engraving. A perfect gift for loved ones.',
  249.99,
  329.99,
  35,
  'RGH-002',
  true,
  true,
  2,
  ARRAY['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'],
  ARRAY['rose_gold']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain'],
  ARRAY['Great Vibes', 'Allura', 'Cursive'],
  'Rose Gold Heart Pendant - Romantic Jewelry',
  'Beautiful rose gold heart pendant with personalized engraving. Perfect romantic gift.',
  ARRAY['rose gold', 'heart pendant', 'romantic jewelry', 'personalized gift'],
  ARRAY['featured', 'romantic', 'gift'],
  60.00
),
(
  'Sterling Silver Bar Pendant',
  'Modern minimalist silver bar pendant with sleek name engraving. Contemporary style for everyday elegance.',
  199.99,
  259.99,
  40,
  'SSB-003',
  true,
  true,
  3,
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'],
  ARRAY['silver']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Modern', 'Arial', 'Helvetica'],
  'Sterling Silver Bar Pendant - Modern Jewelry',
  'Sleek silver bar pendant with modern engraving. Perfect for contemporary style.',
  ARRAY['silver pendant', 'bar necklace', 'modern jewelry', 'minimalist'],
  ARRAY['featured', 'modern', 'bestseller'],
  45.00
),
(
  'Vintage Copper Circle Pendant',
  'Unique vintage-style copper pendant with artistic name engraving. Boho chic design with antique finish.',
  179.99,
  229.99,
  25,
  'VCC-004',
  true,
  false,
  0,
  ARRAY['https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500'],
  ARRAY['vintage_copper']::color_variant[],
  ARRAY['18-inch chain', '20-inch chain'],
  ARRAY['Great Vibes', 'Vintage Script', 'Cursive'],
  'Vintage Copper Circle Pendant - Bohemian Jewelry',
  'Artistic copper pendant with vintage styling. Unique bohemian jewelry piece.',
  ARRAY['copper pendant', 'vintage jewelry', 'bohemian style', 'artistic'],
  ARRAY['vintage', 'boho', 'unique'],
  40.00
),
(
  'Matte Gold Infinity Pendant',
  'Elegant matte gold infinity symbol pendant with beautiful name engraving. Symbol of eternal love and friendship.',
  329.99,
  429.99,
  30,
  'MGI-005',
  true,
  false,
  0,
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
  ARRAY['matte_gold']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Elegant'],
  'Matte Gold Infinity Pendant - Eternal Love Jewelry',
  'Beautiful infinity pendant in matte gold finish. Perfect symbol of everlasting love.',
  ARRAY['infinity pendant', 'matte gold', 'eternal love', 'symbolic jewelry'],
  ARRAY['infinity', 'love', 'symbolic'],
  85.00
) ON CONFLICT (sku) DO NOTHING;

-- Update the products to ensure proper metadata
UPDATE public.products 
SET 
  updated_at = NOW(),
  category = 'pendants',
  slug = LOWER(REPLACE(REPLACE(title, ' ', '-'), '''', ''))
WHERE title IN (
  'Classic Gold Name Pendant',
  'Rose Gold Heart Pendant', 
  'Sterling Silver Bar Pendant',
  'Vintage Copper Circle Pendant',
  'Matte Gold Infinity Pendant'
);

-- Add success message
DO $$
BEGIN
    RAISE NOTICE 'Sample products created successfully!';
END $$;