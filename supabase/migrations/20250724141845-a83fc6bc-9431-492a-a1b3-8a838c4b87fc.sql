
-- Remove gift message functionality and add proper image upload policies
DROP TABLE IF EXISTS gift_messages CASCADE;

-- Add storage policy for admin image uploads
CREATE POLICY "Admin uploads product images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add policy for public read access to product images
CREATE POLICY "Public read product images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');
