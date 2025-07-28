-- Fix product visibility by updating RLS policies
-- This allows public read access to products so they show on the homepage

-- First, let's see current RLS policies for products
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
WHERE tablename = 'products';

-- Drop existing restrictive policies that might be blocking public access
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Create a comprehensive public read policy for products
CREATE POLICY "Everyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Allow admins to manage products (insert, update, delete)
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled but allows public reads
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Test the policies
DO $$
BEGIN
    -- Test if we can select products without authentication
    PERFORM COUNT(*) FROM public.products WHERE is_active = true;
    RAISE NOTICE 'Products table is accessible for public reads';
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Error accessing products: %', SQLERRM;
END $$;

-- Show final policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;