-- Check current policies on products table
SELECT 
  policyname, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Test product access
SELECT 
  id, 
  title, 
  price, 
  is_active, 
  is_featured,
  featured_order
FROM products 
WHERE is_active = true 
ORDER BY featured_order
LIMIT 4;