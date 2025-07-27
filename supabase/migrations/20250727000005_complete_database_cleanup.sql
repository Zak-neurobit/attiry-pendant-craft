-- Complete database cleanup - remove ALL products and start fresh
-- This ensures we only have the 10 name pendant products

-- Delete ALL products from the database
DELETE FROM public.products;

-- Reset any sequences if needed
-- Note: We use UUID primary keys, so no sequence reset needed

-- Verify table is empty
DO $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count FROM public.products;
    
    IF product_count = 0 THEN
        RAISE NOTICE 'Database successfully cleaned - 0 products remaining';
        RAISE NOTICE 'Ready for fresh name pendant product import';
    ELSE
        RAISE WARNING 'Cleanup may not have completed - % products still exist', product_count;
    END IF;
END $$;