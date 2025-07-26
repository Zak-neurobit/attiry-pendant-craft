-- ================================================================
-- REMOVE OLD EXPENSIVE PRODUCTS ($4000 PRICE POINT)
-- ================================================================
-- Remove outdated products that are priced at $4000 to clean up the catalog
-- Keep only the new custom name pendants with proper pricing

-- Remove products priced at $4000 (old expensive products)
DELETE FROM public.products 
WHERE price = 4000 OR price = 4000.00;

-- Verify removal
DO $$
DECLARE
    expensive_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO expensive_count FROM public.products WHERE price >= 1000;
    SELECT COUNT(*) INTO total_count FROM public.products;
    
    RAISE NOTICE 'Product cleanup completed:';
    RAISE NOTICE '- Expensive products (>$1000) remaining: %', expensive_count;
    RAISE NOTICE '- Total products in catalog: %', total_count;
    RAISE NOTICE 'Old $4000 products have been removed successfully.';
END
$$;

-- Show remaining products for verification
SELECT 
    title,
    price,
    compare_price,
    category,
    created_at
FROM public.products 
ORDER BY price ASC, created_at DESC;