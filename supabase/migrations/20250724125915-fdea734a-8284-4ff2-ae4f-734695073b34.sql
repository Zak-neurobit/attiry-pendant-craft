
-- Storage RLS policies for product-images bucket
-- Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated admin users to upload images
CREATE POLICY "Admin users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admin users to update images
CREATE POLICY "Admin users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admin users to delete images
CREATE POLICY "Admin users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
);
