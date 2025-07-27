-- Temporarily allow public uploads for product image setup
-- This will be restricted later after initial setup

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- Create temporary more permissive policies for initial setup
CREATE POLICY "Allow product image uploads during setup"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow product image updates during setup"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Allow product image deletions during setup"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- Add success message
DO $$
BEGIN
    RAISE NOTICE 'Storage permissions updated for product image setup!';
    RAISE NOTICE 'Upload permissions are now enabled for product-images bucket.';
END $$;