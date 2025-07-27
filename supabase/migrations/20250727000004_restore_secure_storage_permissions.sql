-- Restore secure storage permissions after product image setup is complete
-- Remove temporary permissive policies and add proper restrictions

-- Drop temporary setup policies
DROP POLICY IF EXISTS "Allow product image uploads during setup" ON storage.objects;
DROP POLICY IF EXISTS "Allow product image updates during setup" ON storage.objects;
DROP POLICY IF EXISTS "Allow product image deletions during setup" ON storage.objects;

-- Restore secure policies for production use
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Keep public read access for product images (policy already exists)
-- CREATE POLICY "Anyone can view product images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'product-images');

-- Add success message
DO $$
BEGIN
    RAISE NOTICE 'Secure storage permissions restored!';
    RAISE NOTICE 'Product images are now protected and ready for production.';
END $$;