-- ================================================================
-- CUSTOM NAME PENDANT PRODUCTS WITH EMBEDDED SHIPPING PRICING
-- ================================================================
-- Strategy: Hide international shipping costs ($15-25) in product price
-- Show fake 25% discount and low shipping costs ($5-15) for better conversion
-- ================================================================

-- ========================================
-- ENGLISH NAME PENDANT PRODUCTS (6 Styles)
-- ========================================
-- Base pricing: $55 (includes $15-20 embedded shipping)
-- Compare price: $73.33 (creates 25% off illusion)
-- Real shipping embedded, customer pays $5-15 for "shipping"

INSERT INTO public.products (
    title, 
    description, 
    price, 
    compare_price,
    stock, 
    sku, 
    image_urls, 
    color_variants, 
    fonts,
    chain_types,
    keywords, 
    category,
    cogs,
    slug,
    meta_title,
    meta_description,
    tags,
    is_active
) VALUES

-- 1. Classic Script Name Pendant
(
    'Classic Script Name Pendant - Personalized Jewelry',
    'Elegant handcrafted script pendant featuring your personalized name in beautiful cursive lettering. Made with premium stainless steel base and luxury plating options. Each pendant is individually laser-engraved for perfect precision and includes an 18" adjustable chain. Hypoallergenic, tarnish-resistant, and water-resistant finish ensures lasting beauty. Perfect for gifting or treating yourself to personalized luxury jewelry.',
    55.00,
    73.33,
    100,
    'PENDANT-CLASSIC-SCRIPT-ENG',
    ARRAY[
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Classic Script', 'Elegant Cursive', 'Traditional Script'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['personalized', 'custom name', 'script pendant', 'elegant jewelry', 'cursive', 'handcrafted', 'luxury'],
    'Custom Name Pendants',
    12.00,
    'classic-script-name-pendant',
    'Custom Classic Script Name Pendant | Personalized Jewelry',
    'Elegant personalized script name pendant with premium finishes. Custom laser engraving, hypoallergenic materials, free chain included.',
    ARRAY['personalized', 'name pendant', 'script', 'elegant', 'custom jewelry'],
    true
),

-- 2. Modern Sans-Serif Name Pendant  
(
    'Modern Sans-Serif Name Pendant - Contemporary Style',
    'Clean and contemporary sans-serif name pendant perfect for modern style enthusiasts. Features bold, readable lettering with precise laser engraving on premium stainless steel. Available in multiple luxury finishes including gold, rose gold, and silver plating. The minimalist design makes it perfect for everyday wear or special occasions. Includes premium gift packaging and 30-day satisfaction guarantee.',
    55.00,
    73.33,
    100,
    'PENDANT-MODERN-SANS-ENG',
    ARRAY[
        'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Modern Sans', 'Clean Typography', 'Contemporary Font'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['modern', 'contemporary', 'sans serif', 'minimalist', 'clean design', 'custom name', 'everyday wear'],
    'Custom Name Pendants',
    12.00,
    'modern-sans-serif-name-pendant',
    'Modern Sans-Serif Name Pendant | Contemporary Custom Jewelry',
    'Contemporary personalized name pendant with clean sans-serif typography. Premium materials, multiple finishes, perfect for modern style.',
    ARRAY['personalized', 'name pendant', 'modern', 'contemporary', 'minimalist'],
    true
),

-- 3. Elegant Serif Name Pendant
(
    'Elegant Serif Name Pendant - Timeless Sophistication',
    'Sophisticated serif typography pendant that exudes timeless elegance and luxury appeal. Each letter is carefully crafted with classic serif details for maximum visual impact. Made with premium stainless steel core and finished with your choice of luxury plating. The traditional yet refined design makes it perfect for formal occasions and professional settings. Includes elegant jewelry box and authenticity certificate.',
    55.00,
    73.33,
    100,
    'PENDANT-ELEGANT-SERIF-ENG',
    ARRAY[
        'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Elegant Serif', 'Traditional Typography', 'Classic Serif'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['elegant', 'sophisticated', 'serif', 'timeless', 'luxury', 'formal', 'classic design'],
    'Custom Name Pendants',
    12.00,
    'elegant-serif-name-pendant',
    'Elegant Serif Name Pendant | Sophisticated Custom Jewelry',
    'Timeless personalized serif name pendant with sophisticated typography. Luxury finishes, premium materials, perfect for formal occasions.',
    ARRAY['personalized', 'name pendant', 'elegant', 'serif', 'sophisticated'],
    true
),

-- 4. Bold Gothic Name Pendant
(
    'Bold Gothic Name Pendant - Statement Piece',
    'Make a powerful statement with this bold gothic lettering name pendant. Features strong, dramatic typography that commands attention and showcases your unique style. Crafted with premium materials and precision laser engraving for sharp, defined edges. The substantial design and bold aesthetic make it perfect for those who love standout jewelry pieces. Available in striking finishes including matte black and vintage copper.',
    55.00,
    73.33,
    100,
    'PENDANT-BOLD-GOTHIC-ENG',
    ARRAY[
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Bold Gothic', 'Dramatic Typography', 'Strong Lettering'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['bold', 'gothic', 'statement', 'dramatic', 'strong', 'unique style', 'standout jewelry'],
    'Custom Name Pendants',
    12.00,
    'bold-gothic-name-pendant',
    'Bold Gothic Name Pendant | Statement Custom Jewelry',
    'Dramatic personalized gothic name pendant with bold typography. Statement piece with premium materials and striking finishes.',
    ARRAY['personalized', 'name pendant', 'bold', 'gothic', 'statement'],
    true
),

-- 5. Handwritten Style Name Pendant
(
    'Handwritten Style Name Pendant - Organic Beauty',
    'Capture the beauty of handwritten script with this organic, flowing name pendant design. Each letter flows naturally with artistic curves and personal character, just like genuine handwriting. The warm, personal touch makes it perfect for meaningful gifts or celebrating special relationships. Meticulously crafted with premium materials and available in romantic finishes like rose gold and vintage copper for added charm.',
    55.00,
    73.33,
    100,
    'PENDANT-HANDWRITTEN-ENG',
    ARRAY[
        'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Handwritten Script', 'Organic Curves', 'Personal Style'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['handwritten', 'organic', 'personal', 'artistic', 'flowing', 'meaningful gift', 'romantic'],
    'Custom Name Pendants',
    12.00,
    'handwritten-style-name-pendant',
    'Handwritten Style Name Pendant | Personal Custom Jewelry',
    'Organic personalized handwritten name pendant with flowing script. Artistic design, premium materials, perfect for meaningful gifts.',
    ARRAY['personalized', 'name pendant', 'handwritten', 'organic', 'artistic'],
    true
),

-- 6. Minimalist Block Name Pendant
(
    'Minimalist Block Name Pendant - Geometric Simplicity',
    'Pure geometric simplicity meets personalized luxury in this minimalist block letter name pendant. Features clean, architectural lines and perfect symmetry for a truly modern aesthetic. The understated design makes it incredibly versatile - perfect for professional settings, casual wear, or layering with other jewelry. Precision-crafted with premium materials and finished to perfection in your choice of luxury plating.',
    55.00,
    73.33,
    100,
    'PENDANT-MINIMALIST-BLOCK-ENG',
    ARRAY[
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Minimalist Block', 'Geometric Letters', 'Clean Lines'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['minimalist', 'geometric', 'simple', 'modern', 'architectural', 'versatile', 'professional'],
    'Custom Name Pendants',
    12.00,
    'minimalist-block-name-pendant',
    'Minimalist Block Name Pendant | Geometric Custom Jewelry',
    'Geometric personalized block name pendant with minimalist design. Clean lines, architectural style, perfect for modern professionals.',
    ARRAY['personalized', 'name pendant', 'minimalist', 'geometric', 'modern'],
    true
);

-- ========================================
-- ARABIC NAME PENDANT PRODUCTS (4 Styles)
-- ========================================
-- Premium pricing: $62 (includes $15-20 embedded shipping + premium for Arabic craftsmanship)
-- Compare price: $82.67 (creates 25% off illusion)
-- Specialized Arabic typography commands higher pricing

INSERT INTO public.products (
    title, 
    description, 
    price, 
    compare_price,
    stock, 
    sku, 
    image_urls, 
    color_variants, 
    fonts,
    chain_types,
    keywords, 
    category,
    cogs,
    slug,
    meta_title,
    meta_description,
    tags,
    is_active
) VALUES

-- 7. Traditional Arabic Calligraphy Name Pendant
(
    'Traditional Arabic Calligraphy Name Pendant - Classical Beauty',
    'Exquisite traditional Arabic calligraphy pendant featuring your name in classical Arabic script. Each letter is carefully crafted following centuries-old calligraphic traditions for authentic beauty and cultural significance. Made with premium stainless steel and luxury plating options. Perfect for celebrating Arabic heritage or gifting to loved ones who appreciate Middle Eastern artistry. Includes cultural authenticity certificate and premium gift packaging.',
    62.00,
    82.67,
    100,
    'PENDANT-ARABIC-TRADITIONAL-CALI',
    ARRAY[
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Traditional Arabic', 'Classical Calligraphy', 'Authentic Script'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['arabic', 'calligraphy', 'traditional', 'cultural', 'heritage', 'middle eastern', 'authentic', 'classical'],
    'Arabic Name Pendants',
    14.00,
    'traditional-arabic-calligraphy-pendant',
    'Traditional Arabic Calligraphy Name Pendant | Authentic Cultural Jewelry',
    'Authentic traditional Arabic calligraphy name pendant with classical script. Cultural heritage jewelry with premium materials and luxury finishes.',
    ARRAY['arabic', 'name pendant', 'calligraphy', 'traditional', 'cultural'],
    true
),

-- 8. Modern Arabic Name Pendant
(
    'Modern Arabic Name Pendant - Contemporary Elegance',
    'Contemporary Arabic typography meets modern design in this sleek name pendant. Features clean, readable Arabic lettering with a fresh, contemporary approach while maintaining cultural authenticity. Perfect for modern Arabic speakers who appreciate both tradition and contemporary style. Crafted with precision laser engraving and available in trending finishes including matte gold and rose gold for sophisticated appeal.',
    62.00,
    82.67,
    100,
    'PENDANT-ARABIC-MODERN-STYLE',
    ARRAY[
        'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Modern Arabic', 'Contemporary Script', 'Clean Typography'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['arabic', 'modern', 'contemporary', 'clean', 'readable', 'sophisticated', 'trendy'],
    'Arabic Name Pendants',
    14.00,
    'modern-arabic-name-pendant',
    'Modern Arabic Name Pendant | Contemporary Cultural Jewelry',
    'Contemporary Arabic name pendant with modern typography. Clean design maintaining cultural authenticity with sophisticated finishes.',
    ARRAY['arabic', 'name pendant', 'modern', 'contemporary', 'sophisticated'],
    true
),

-- 9. Decorative Kufic Name Pendant
(
    'Decorative Kufic Name Pendant - Geometric Artistry',
    'Stunning decorative Kufic script pendant that transforms your name into geometric art. This ancient Arabic calligraphic style features bold, angular lines and intricate geometric patterns that create visual masterpieces. Each pendant is a unique work of art combining cultural heritage with geometric beauty. Perfect for those who appreciate Islamic art and architectural design. Available in premium finishes that highlight the intricate geometric details.',
    62.00,
    82.67,
    100,
    'PENDANT-ARABIC-KUFIC-GEOMETRIC',
    ARRAY[
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Decorative Kufic', 'Geometric Script', 'Islamic Calligraphy'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['arabic', 'kufic', 'geometric', 'islamic art', 'decorative', 'architectural', 'artistic', 'cultural'],
    'Arabic Name Pendants',
    14.00,
    'decorative-kufic-name-pendant',
    'Decorative Kufic Name Pendant | Islamic Geometric Art Jewelry',
    'Artistic Kufic Arabic name pendant with geometric calligraphy. Islamic art inspired design with intricate patterns and premium finishes.',
    ARRAY['arabic', 'name pendant', 'kufic', 'geometric', 'islamic art'],
    true
),

-- 10. Simplified Arabic Name Pendant
(
    'Simplified Arabic Name Pendant - Clean & Readable',
    'Clean, simplified Arabic script pendant designed for maximum readability and everyday elegance. Features straightforward Arabic lettering that maintains cultural authenticity while ensuring easy recognition. Perfect for daily wear and ideal for those new to Arabic jewelry or preferring understated elegance. The simplified design makes it versatile enough to complement any outfit while proudly displaying your Arabic name.',
    62.00,
    82.67,
    100,
    'PENDANT-ARABIC-SIMPLIFIED-CLEAN',
    ARRAY[
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506629905333-1ef4458d5dbd?w=800&h=800&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800&h=800&fit=crop&crop=center'
    ],
    ARRAY['gold', 'rose_gold', 'silver', 'matte_gold', 'matte_silver', 'vintage_copper', 'black']::color_variant[],
    ARRAY['Simplified Arabic', 'Clean Script', 'Readable Typography'],
    ARRAY['18" Adjustable Chain', '20" Extension Available', 'Stainless Steel Chain'],
    ARRAY['arabic', 'simplified', 'clean', 'readable', 'everyday', 'elegant', 'versatile', 'understated'],
    'Arabic Name Pendants',
    14.00,
    'simplified-arabic-name-pendant',
    'Simplified Arabic Name Pendant | Clean Cultural Jewelry',
    'Clean simplified Arabic name pendant with readable script. Everyday elegance with cultural authenticity and versatile design.',
    ARRAY['arabic', 'name pendant', 'simplified', 'clean', 'everyday'],
    true
);

-- ========================================
-- SHIPPING CONFIGURATION
-- ========================================
-- Create shipping rates that appear low but account for embedded costs
-- Standard: $5 (real cost $15 embedded in product)
-- Express: $10 (real cost $20 embedded in product)  
-- Priority: $15 (real cost $25 embedded in product)

-- Note: Shipping configuration would typically be handled in a separate shipping_rates table
-- This is conceptual data for the shipping strategy

/*
INSERT INTO shipping_rates (
    name,
    display_price,
    actual_cost,
    embedded_in_product,
    delivery_days_min,
    delivery_days_max,
    description,
    is_active
) VALUES
(
    'Standard Shipping',
    5.00,
    15.00,
    true,
    15,
    25,
    'Affordable shipping with tracking',
    true
),
(
    'Express Shipping', 
    10.00,
    20.00,
    true,
    7,
    12,
    'Faster delivery with priority handling',
    true
),
(
    'Priority Shipping',
    15.00,
    25.00,
    true,
    3,
    7,
    'Premium expedited shipping',
    true
);
*/

-- ========================================
-- PRICING SUMMARY
-- ========================================
/*
ENGLISH PENDANTS:
- Display Price: $55.00
- Compare Price: $73.33 (25% off illusion)
- Embedded Shipping: $15-20
- Customer Total: $60-70 (with shipping)

ARABIC PENDANTS:
- Display Price: $62.00  
- Compare Price: $82.67 (25% off illusion)
- Embedded Shipping: $15-20
- Premium for Arabic: $7 extra
- Customer Total: $67-77 (with shipping)

SHIPPING OPTIONS:
- Standard: $5 (customer pays) + $15 (embedded) = $20 total shipping
- Express: $10 (customer pays) + $20 (embedded) = $30 total shipping  
- Priority: $15 (customer pays) + $25 (embedded) = $40 total shipping

PSYCHOLOGICAL BENEFITS:
✅ Customer sees "25% off" discount
✅ Low shipping costs ($5-15 vs $15-30)  
✅ Maintains healthy profit margins
✅ Competitive with US jewelry market pricing
*/