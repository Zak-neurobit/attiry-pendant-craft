-- Fix browser access to products by making them truly public
-- This ensures browser frontend can access products without authentication issues

-- First, check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Drop any restrictive policies that might be blocking browser access
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Create a completely open read policy for products
CREATE POLICY "Public read access to active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Keep admin write policies separate
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled but allows public reads
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Test the new policy by selecting products (this should work for anyone)
SELECT 
  id,
  title,
  price,
  is_active,
  is_featured,
  featured_order
FROM public.products 
WHERE is_active = true
ORDER BY featured_order
LIMIT 4;

-- Show final policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Also ensure related tables are accessible if needed
-- (profiles might be needed for admin checks but not for product viewing)

COMMENT ON POLICY "Public read access to active products" ON public.products IS 
'Allows anonymous browser access to view active products for the website frontend';

-- Log the changes
DO $$
BEGIN
    RAISE NOTICE 'Products table RLS policies updated for public browser access';
    RAISE NOTICE 'Active products should now be readable by anonymous users';
END $$;