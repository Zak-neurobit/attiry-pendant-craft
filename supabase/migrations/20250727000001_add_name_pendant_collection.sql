-- Add the complete Name Pendant Collection with all variants and metadata
-- This migration adds 10 personalized name pendant products with multiple color variants

INSERT INTO public.products (
  title,
  description,
  price,
  compare_price,
  stock,
  sku,
  is_active,
  is_featured,
  featured_order,
  image_urls,
  color_variants,
  chain_types,
  fonts,
  meta_title,
  meta_description,
  keywords,
  tags,
  cogs,
  category,
  slug
) VALUES 

-- 1. Aria Name Pendant
(
  'Aria Name Pendant',
  'Elegantly crafted Aria name pendant featuring flowing, graceful letterforms that embody musical beauty. This sophisticated piece transforms your name into wearable art with its refined curves and balanced proportions. Perfect for those who appreciate timeless elegance with a modern twist.',
  299.99,
  399.99,
  50,
  'ARI-001',
  true,
  true,
  1,
  ARRAY[
    'https://placeholder-storage-url/aria-gold.jpeg',
    'https://placeholder-storage-url/aria-silver.jpeg', 
    'https://placeholder-storage-url/aria-rose-gold.jpeg',
    'https://placeholder-storage-url/aria-black.jpeg',
    'https://placeholder-storage-url/aria-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Allura', 'Cursive'],
  'Aria Name Pendant - Elegant Personalized Jewelry | Attiry',
  'Discover the elegant Aria name pendant with flowing letterforms. Available in gold, silver, rose gold, black, and worn finishes. Personalized jewelry at its finest.',
  ARRAY['aria pendant', 'personalized jewelry', 'name necklace', 'elegant pendant', 'custom jewelry', 'aria name'],
  ARRAY['featured', 'bestseller', 'elegant', 'personalized'],
  89.99,
  'pendants',
  'aria-name-pendant'
),

-- 2. Ariana Name Pendant  
(
  'Ariana Name Pendant',
  'The Ariana name pendant showcases sophisticated elongated letterforms with subtle decorative flourishes. This premium piece combines contemporary design with classical elegance, creating a statement accessory that celebrates individuality while maintaining refined sophistication.',
  319.99,
  419.99,
  45,
  'ARN-002', 
  true,
  true,
  2,
  ARRAY[
    'https://placeholder-storage-url/ariana-gold.jpeg',
    'https://placeholder-storage-url/ariana-silver.jpeg',
    'https://placeholder-storage-url/ariana-rose-gold.jpeg', 
    'https://placeholder-storage-url/ariana-black.jpeg',
    'https://placeholder-storage-url/ariana-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Allura', 'Pacifico'],
  'Ariana Name Pendant - Sophisticated Personalized Jewelry | Attiry',
  'Elegant Ariana name pendant with decorative flourishes. Premium craftsmanship in multiple finishes. Perfect personalized gift.',
  ARRAY['ariana pendant', 'sophisticated jewelry', 'name pendant', 'luxury jewelry', 'personalized gift', 'ariana name'],
  ARRAY['featured', 'luxury', 'sophisticated', 'personalized'],
  94.99,
  'pendants', 
  'ariana-name-pendant'
),

-- 3. Habibi Arabic Name Pendant
(
  'Habibi Arabic Name Pendant',
  'Experience the beauty of Arabic calligraphy with our exquisite Habibi name pendant. This culturally rich piece features authentic Arabic script rendered in flowing, artistic letterforms that honor traditional calligraphic artistry while offering contemporary wearability.',
  349.99,
  449.99,
  40,
  'HAB-003',
  true,
  true,
  3,
  ARRAY[
    'https://placeholder-storage-url/habibi-arabic-gold.png',
    'https://placeholder-storage-url/habibi-arabic-silver.png',
    'https://placeholder-storage-url/habibi-arabic-rose-gold.png',
    'https://placeholder-storage-url/habibi-arabic-black.png', 
    'https://placeholder-storage-url/habibi-arabic-worn.png'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Arabic Calligraphy', 'Traditional Arabic', 'Modern Arabic'],
  'Habibi Arabic Name Pendant - Authentic Arabic Calligraphy Jewelry | Attiry',
  'Stunning Habibi Arabic name pendant featuring authentic calligraphy. Cultural jewelry celebrating Arabic heritage and beauty.',
  ARRAY['habibi pendant', 'arabic jewelry', 'arabic calligraphy', 'cultural jewelry', 'habibi arabic', 'middle eastern jewelry'],
  ARRAY['featured', 'cultural', 'arabic', 'calligraphy'],
  104.99,
  'pendants',
  'habibi-arabic-name-pendant'
),

-- 4. Isabella Name Pendant
(
  'Isabella Name Pendant', 
  'The Isabella name pendant embodies romantic elegance with its graceful, feminine letterforms. Featuring delicate curves and balanced proportions, this timeless piece captures the essence of classic beauty while maintaining contemporary appeal for the modern woman.',
  289.99,
  379.99,
  55,
  'ISA-004',
  true,
  true,
  4,
  ARRAY[
    'https://placeholder-storage-url/isabella-gold.jpeg',
    'https://placeholder-storage-url/isabella-silver.jpeg',
    'https://placeholder-storage-url/isabella-rose-gold.jpeg',
    'https://placeholder-storage-url/isabella-black.jpeg',
    'https://placeholder-storage-url/isabella-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Allura', 'Romantic Script'],
  'Isabella Name Pendant - Romantic Elegant Jewelry | Attiry',
  'Beautiful Isabella name pendant with feminine curves and romantic elegance. Perfect personalized jewelry for the sophisticated woman.',
  ARRAY['isabella pendant', 'romantic jewelry', 'feminine pendant', 'elegant necklace', 'isabella name', 'classic jewelry'],
  ARRAY['featured', 'romantic', 'feminine', 'classic'],
  84.99,
  'pendants',
  'isabella-name-pendant'
),

-- 5. Layla Name Pendant
(
  'Layla Name Pendant',
  'The Layla name pendant captures mystical beauty with its flowing, ethereal letterforms inspired by moonlight and dreams. This enchanting piece combines delicate craftsmanship with poetic elegance, perfect for those who embrace their mysterious and captivating nature.',
  279.99,
  369.99,
  50,
  'LAY-005',
  true,
  false,
  0,
  ARRAY[
    'https://placeholder-storage-url/layla-gold.jpeg',
    'https://placeholder-storage-url/layla-silver.jpeg',
    'https://placeholder-storage-url/layla-black.jpeg',
    'https://placeholder-storage-url/layla-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Mystical Script', 'Cursive'],
  'Layla Name Pendant - Mystical Elegant Jewelry | Attiry', 
  'Enchanting Layla name pendant with ethereal letterforms. Mystical beauty meets elegant craftsmanship in this captivating piece.',
  ARRAY['layla pendant', 'mystical jewelry', 'ethereal pendant', 'elegant necklace', 'layla name', 'poetic jewelry'],
  ARRAY['mystical', 'ethereal', 'elegant', 'personalized'],
  79.99,
  'pendants',
  'layla-name-pendant'
),

-- 6. Milaa Name Pendant
(
  'Milaa Name Pendant',
  'The Milaa name pendant showcases modern minimalism with clean, geometric letterforms that speak to contemporary sophistication. This sleek design offers understated elegance, perfect for the modern individual who appreciates refined simplicity and subtle luxury.',
  269.99,
  349.99,
  45,
  'MIL-006',
  true,
  false,
  0,
  ARRAY[
    'https://placeholder-storage-url/milaa-gold.jpeg',
    'https://placeholder-storage-url/milaa-silver.jpeg', 
    'https://placeholder-storage-url/milaa-rose-gold.jpeg',
    'https://placeholder-storage-url/milaa-black.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Modern Sans', 'Minimalist', 'Contemporary', 'Clean Script'],
  'Milaa Name Pendant - Modern Minimalist Jewelry | Attiry',
  'Sleek Milaa name pendant with clean geometric design. Modern minimalist jewelry for contemporary sophistication.',
  ARRAY['milaa pendant', 'modern jewelry', 'minimalist pendant', 'geometric necklace', 'milaa name', 'contemporary jewelry'],
  ARRAY['modern', 'minimalist', 'contemporary', 'geometric'],
  74.99,
  'pendants',
  'milaa-name-pendant'
),

-- 7. Olivia Name Pendant
(
  'Olivia Name Pendant',
  'The Olivia name pendant embodies natural grace with organic, flowing letterforms that mirror the beauty of olive branches. This harmonious piece represents peace, wisdom, and natural elegance, crafted for those who find beauty in nature''s perfect designs.',
  309.99,
  409.99,
  40,
  'OLI-007',
  true,
  true,
  5,
  ARRAY[
    'https://placeholder-storage-url/olivia-gold.jpeg',
    'https://placeholder-storage-url/olivia-silver.jpeg',
    'https://placeholder-storage-url/olivia-rose-gold.jpeg',
    'https://placeholder-storage-url/olivia-black.jpeg',
    'https://placeholder-storage-url/olivia-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Natural Script', 'Organic Cursive'],
  'Olivia Name Pendant - Natural Grace Jewelry | Attiry',
  'Beautiful Olivia name pendant with organic flowing design. Natural elegance inspired by olive branches and peaceful beauty.',
  ARRAY['olivia pendant', 'natural jewelry', 'organic pendant', 'graceful necklace', 'olivia name', 'peaceful jewelry'],
  ARRAY['featured', 'natural', 'organic', 'graceful'],
  92.99,
  'pendants',
  'olivia-name-pendant'
),

-- 8. Sophia Name Pendant
(
  'Sophia Name Pendant',
  'The Sophia name pendant represents wisdom and classical beauty through timeless, sophisticated letterforms. This distinguished piece combines intellectual elegance with refined craftsmanship, perfect for those who embody both inner wisdom and outer grace.',
  329.99,
  429.99,
  35,
  'SOP-008',
  true,
  true,
  6,
  ARRAY[
    'https://placeholder-storage-url/sophia-gold.jpeg',
    'https://placeholder-storage-url/sophia-silver.jpeg',
    'https://placeholder-storage-url/sophia-rose-gold.jpeg',
    'https://placeholder-storage-url/sophia-black.jpeg',
    'https://placeholder-storage-url/sophia-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Classical Script', 'Wisdom Font', 'Elegant Cursive'],
  'Sophia Name Pendant - Wisdom & Classical Beauty Jewelry | Attiry',
  'Sophisticated Sophia name pendant representing wisdom and grace. Classical elegance meets refined craftsmanship.',
  ARRAY['sophia pendant', 'wisdom jewelry', 'classical pendant', 'sophisticated necklace', 'sophia name', 'intelligent jewelry'],
  ARRAY['featured', 'wisdom', 'classical', 'sophisticated'],
  99.99,
  'pendants',
  'sophia-name-pendant'
),

-- 9. Yasmeen Arabic Name Pendant
(
  'Yasmeen Arabic Name Pendant',
  'The Yasmeen Arabic name pendant celebrates the beauty of jasmine flowers through exquisite Arabic calligraphy. This culturally rich piece combines traditional Middle Eastern artistry with contemporary jewelry design, symbolizing grace, elegance, and cultural heritage.',
  359.99,
  459.99,
  30,
  'YAS-009',
  true,
  true,
  7,
  ARRAY[
    'https://placeholder-storage-url/yasmeen-arabic-gold.png',
    'https://placeholder-storage-url/yasmeen-arabic-silver.png',
    'https://placeholder-storage-url/yasmeen-arabic-rose-gold.png',
    'https://placeholder-storage-url/yasmeen-arabic-black.png',
    'https://placeholder-storage-url/yasmeen-arabic-worn.png'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Arabic Calligraphy', 'Traditional Arabic', 'Floral Arabic', 'Modern Arabic'],
  'Yasmeen Arabic Name Pendant - Jasmine Beauty Arabic Calligraphy | Attiry',
  'Exquisite Yasmeen Arabic pendant with jasmine-inspired calligraphy. Cultural heritage meets contemporary elegance.',
  ARRAY['yasmeen pendant', 'arabic jewelry', 'jasmine pendant', 'cultural jewelry', 'yasmeen arabic', 'calligraphy jewelry'],
  ARRAY['featured', 'cultural', 'arabic', 'floral'],
  109.99,
  'pendants',
  'yasmeen-arabic-name-pendant'
),

-- 10. Zara Name Pendant
(
  'Zara Name Pendant',
  'The Zara name pendant embodies blooming beauty with delicate, floral-inspired letterforms that capture the essence of dawn and new beginnings. This radiant piece combines gentle curves with confident strength, perfect for those who embrace life''s beautiful moments.',
  299.99,
  399.99,
  48,
  'ZAR-010',
  true,
  true,
  8,
  ARRAY[
    'https://placeholder-storage-url/zara-gold.jpeg',
    'https://placeholder-storage-url/zara-silver.jpeg',
    'https://placeholder-storage-url/zara-rose-gold.jpeg',
    'https://placeholder-storage-url/zara-black.jpeg',
    'https://placeholder-storage-url/zara-worn.jpeg'
  ],
  ARRAY['gold', 'silver', 'rose_gold', 'black', 'vintage_copper']::color_variant[],
  ARRAY['16-inch chain', '18-inch chain', '20-inch chain', '22-inch chain'],
  ARRAY['Great Vibes', 'Dancing Script', 'Floral Script', 'Dawn Cursive'],
  'Zara Name Pendant - Blooming Beauty Jewelry | Attiry',
  'Radiant Zara name pendant with floral-inspired design. Captures dawn''s beauty and new beginnings in elegant jewelry.',
  ARRAY['zara pendant', 'floral jewelry', 'dawn pendant', 'blooming necklace', 'zara name', 'radiant jewelry'],
  ARRAY['featured', 'floral', 'radiant', 'new beginnings'],
  89.99,
  'pendants',
  'zara-name-pendant'
);

-- Add success message
DO $$
BEGIN
    RAISE NOTICE 'Name Pendant Collection added successfully!';
    RAISE NOTICE '10 products with complete variants, descriptions, and metadata created.';
END $$;