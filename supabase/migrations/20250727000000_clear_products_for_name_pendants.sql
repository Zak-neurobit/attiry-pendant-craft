-- Clear all existing products to prepare for name pendant collection
-- This migration removes all current products and resets the products table

-- Delete all existing products
DELETE FROM public.products;

-- Reset the sequence for IDs if needed
-- Note: Since we're using UUID, this isn't strictly necessary, but good practice
SELECT setval(pg_get_serial_sequence('products', 'id'), 1, false);

-- Add success message
DO $$
BEGIN
    RAISE NOTICE 'All existing products have been cleared successfully!';
    RAISE NOTICE 'Ready for name pendant collection import.';
END $$;