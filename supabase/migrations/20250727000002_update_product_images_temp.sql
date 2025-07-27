-- Temporary update to use accessible placeholder images until storage is configured
-- This allows us to test the frontend functionality immediately

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'aria-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'ariana-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'habibi-arabic-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'isabella-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'layla-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'milaa-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'olivia-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'sophia-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'yasmeen-arabic-name-pendant';

UPDATE public.products SET image_urls = ARRAY[
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596944924617-b69950f9c9a9?w=500&q=60&auto=format&fit=crop'
] WHERE slug = 'zara-name-pendant';

-- Add success message
DO $$
BEGIN
    RAISE NOTICE 'Temporary placeholder images have been added to all products!';
    RAISE NOTICE 'Products are now ready for frontend testing.';
END $$;