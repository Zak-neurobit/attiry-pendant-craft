-- ================================================================
-- VERIFY AND UPDATE PRODUCTS WITH COMPARE PRICES AND IMAGES
-- ================================================================
-- This script ensures products have proper compare_price and updated images
-- Run this to complete the product setup
-- ================================================================

-- First, let's check if products exist and their current state
SELECT 
    title,
    price,
    compare_price,
    array_length(image_urls, 1) as image_count,
    sku,
    is_active
FROM public.products 
ORDER BY created_at DESC 
LIMIT 10;

-- Update products with new authentic images (run the update-pendant-images.sql content)
-- Classic Script Name Pendant - Gold/Silver variants
UPDATE public.products 
SET image_urls = ARRAY[
    'https://cdn.onecklace.com/products/2630/product_2630_1_730.jpeg',
    'https://cdn.theograce.com/digital-asset/product/multiple-name-necklace-in-rose-gold-plating-1.jpg',
    'https://cdn.onecklace.com/products/3108/product_3108_1_730.jpeg'
],
updated_at = now()
WHERE sku = 'PENDANT-CLASSIC-SCRIPT-ENG';

-- Modern Sans-Serif Name Pendant - Contemporary style
UPDATE public.products 
SET image_urls = ARRAY[
    'https://cdn.theograce.com/digital-asset/product/heart-drop-vertical-name-necklace-in-18k-rose-gold-plating-8.jpg',
    'https://www.customcuff.co/cdn/shop/products/necklace_black.jpg',
    'https://cdn.onecklace.com/products/2630/product_2630_1_730.jpeg'
],
updated_at = now()
WHERE sku = 'PENDANT-MODERN-SANS-ENG';

-- Traditional Arabic Calligraphy Name Pendant
UPDATE public.products 
SET image_urls = ARRAY[
    'https://cdn.theograce.com/digital-asset/product/18k-gold-plated-sterling-silver-arabic-name-necklace-8.jpg',
    'https://prya.co.uk/cdn/shop/products/PRYAPERSONALISEDNECKLACE-128.jpg?v=1619454768',
    'https://cdn.theograce.com/digital-asset/product/18k-gold-plated-sterling-silver-arabic-name-necklace-13.jpg'
],
updated_at = now()
WHERE sku = 'PENDANT-ARABIC-TRADITIONAL-CALI';

-- Verify the updates
SELECT 
    title,
    price,
    compare_price,
    CASE 
        WHEN compare_price > price THEN CONCAT('$', compare_price, ' → $', price, ' (', ROUND(((compare_price - price) / compare_price * 100)::numeric, 0), '% off)')
        ELSE 'No discount'
    END as discount_display,
    array_length(image_urls, 1) as image_count,
    sku
FROM public.products 
WHERE is_active = true
ORDER BY created_at DESC;

-- Summary report
DO $$
DECLARE
    total_products INTEGER;
    products_with_compare_price INTEGER;
    products_with_images INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_products FROM public.products WHERE is_active = true;
    SELECT COUNT(*) INTO products_with_compare_price FROM public.products WHERE is_active = true AND compare_price > price;
    SELECT COUNT(*) INTO products_with_images FROM public.products WHERE is_active = true AND array_length(image_urls, 1) > 0;
    
    RAISE NOTICE 'Product Status Summary:';
    RAISE NOTICE '- Total active products: %', total_products;
    RAISE NOTICE '- Products with compare prices: %', products_with_compare_price;
    RAISE NOTICE '- Products with images: %', products_with_images;
    
    IF products_with_compare_price > 0 THEN
        RAISE NOTICE '✅ Compare prices are available - scratched prices should display';
    ELSE
        RAISE NOTICE '⚠️  No compare prices found - check database data';
    END IF;
    
    IF products_with_images = total_products THEN
        RAISE NOTICE '✅ All products have images';
    ELSE
        RAISE NOTICE '⚠️  Some products missing images';
    END IF;
END
$$;