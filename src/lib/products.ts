import productGold from '@/assets/product-gold.jpg';
import productRoseGold from '@/assets/product-rose-gold.jpg';

// Re-export types and utilities from the new useProducts hook
export type { Product, DatabaseProduct } from '@/hooks/useProducts';
export { mapFrontendColorToDatabase } from '@/hooks/useProducts';

// Real products from your Supabase database - replacing mock data
export const shopProducts: Product[] = [
  {
    id: 'd3484f2c-4bea-49f8-9b59-c8cd38131042',
    slug: 'aria-name-pendant',
    name: 'Aria Name Pendant',
    price: 299.99,
    originalPrice: 399.99,
    description: 'Elegantly crafted Aria name pendant featuring flowing, graceful letterforms that embody musical beauty. This sophisticated piece transforms your name into wearable art with its refined curves and balanced proportions.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/aria-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/aria-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/aria-rose-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/aria-black.jpeg'
    ],
    rating: 5,
    reviewCount: 152,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 50,
    sku: 'ARI-001'
  },
  {
    id: '04567b3e-e294-4763-9e9a-a40e414bf361',
    slug: 'habibi-arabic-name-pendant',
    name: 'Habibi Arabic Name Pendant',
    price: 349.99,
    originalPrice: 449.99,
    description: 'Experience the beauty of Arabic calligraphy with our exquisite Habibi name pendant. This culturally rich piece features authentic Arabic script rendered in flowing, artistic letterforms that honor traditional calligraphic artistry.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/habibi-arabic-silver.png',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/habibi-arabic-rose-gold.png'
    ],
    rating: 5,
    reviewCount: 89,
    isNew: false,
    colors: ['silver', 'rose-gold', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 40,
    sku: 'HAB-003'
  },
  {
    id: '3c3f0913-6944-4841-b078-d70d7c097f97',
    slug: 'yasmeen-arabic-name-pendant',
    name: 'Yasmeen Arabic Name Pendant',
    price: 359.99,
    originalPrice: 459.99,
    description: 'The Yasmeen Arabic name pendant celebrates the beauty of jasmine flowers through exquisite Arabic calligraphy. This culturally rich piece combines traditional Middle Eastern artistry with contemporary jewelry design, symbolizing grace and cultural heritage.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/yasmeen-arabic-gold.png',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/yasmeen-arabic-silver.png',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/yasmeen-arabic-rose-gold.png'
    ],
    rating: 5,
    reviewCount: 167,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 30,
    sku: 'YAS-009'
  },
  {
    id: 'c06ce985-be8d-4470-a286-8049bc2b9387',
    slug: 'zara-name-pendant',
    name: 'Zara Name Pendant',
    price: 299.99,
    originalPrice: 399.99,
    description: 'The Zara name pendant embodies blooming beauty with delicate, floral-inspired letterforms that capture the essence of dawn and new beginnings. This radiant piece combines gentle curves with confident strength, perfect for embracing life\'s beautiful moments.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/zara-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/zara-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/zara-rose-gold.jpeg'
    ],
    rating: 5,
    reviewCount: 198,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 48,
    sku: 'ZAR-010'
  },
  {
    id: 'f5d9e406-8a82-4dd7-a533-6397d596f3eb',
    slug: 'ariana-name-pendant',
    name: 'Ariana Name Pendant',
    price: 319.99,
    originalPrice: 419.99,
    description: 'The Ariana name pendant showcases sophisticated elongated letterforms with subtle decorative flourishes. This premium piece combines contemporary design with classical elegance, creating a statement accessory that celebrates individuality.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/ariana-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/ariana-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/ariana-rose-gold.jpeg'
    ],
    rating: 5,
    reviewCount: 134,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 45,
    sku: 'ARN-002'
  },
  {
    id: 'ab2ab166-1e73-49bf-808b-87895d97061d',
    slug: 'layla-name-pendant',
    name: 'Layla Name Pendant',
    price: 279.99,
    originalPrice: 369.99,
    description: 'The Layla name pendant captures mystical beauty with its flowing, ethereal letterforms inspired by moonlight and dreams. This enchanting piece combines delicate craftsmanship with poetic elegance, perfect for those who embrace their mysterious nature.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/layla-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/layla-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/layla-black.jpeg'
    ],
    rating: 5,
    reviewCount: 176,
    isNew: false,
    colors: ['gold', 'silver', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 50,
    sku: 'LAY-005'
  },
  {
    id: 'fc10fa58-efde-43b2-9cb7-21a5ba65a568',
    slug: 'milaa-name-pendant',
    name: 'Milaa Name Pendant',
    price: 269.99,
    originalPrice: 349.99,
    description: 'The Milaa name pendant showcases modern minimalism with clean, geometric letterforms that speak to contemporary sophistication. This sleek design offers understated elegance, perfect for the modern individual who appreciates refined simplicity.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/milaa-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/milaa-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/milaa-rose-gold.jpeg'
    ],
    rating: 5,
    reviewCount: 98,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black'],
    category: 'custom-pendants',
    stock: 45,
    sku: 'MIL-006'
  },
  {
    id: '7a4c9737-ea73-49a1-aa57-81eadc986c7e',
    slug: 'olivia-name-pendant',
    name: 'Olivia Name Pendant',
    price: 309.99,
    originalPrice: 409.99,
    description: 'The Olivia name pendant embodies natural grace with organic, flowing letterforms that mirror the beauty of olive branches. This harmonious piece represents peace, wisdom, and natural elegance, crafted for those who find beauty in nature\'s perfect designs.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/olivia-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/olivia-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/olivia-rose-gold.jpeg'
    ],
    rating: 5,
    reviewCount: 221,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 40,
    sku: 'OLI-007'
  },
  {
    id: 'ca18cf82-aac7-48e8-972e-a127741d59af',
    slug: 'isabella-name-pendant',
    name: 'Isabella Name Pendant',
    price: 289.99,
    originalPrice: 379.99,
    description: 'The Isabella name pendant embodies romantic elegance with its graceful, feminine letterforms. Featuring delicate curves and balanced proportions, this timeless piece captures the essence of classic beauty while maintaining contemporary appeal.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/isabella-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/isabella-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/isabella-rose-gold.jpeg'
    ],
    rating: 5,
    reviewCount: 189,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 55,
    sku: 'ISA-004'
  },
  {
    id: '2d3d08ad-9532-4fe7-82e8-89159dfd41f1',
    slug: 'sophia-name-pendant',
    name: 'Sophia Name Pendant',
    price: 329.99,
    originalPrice: 429.99,
    description: 'The Sophia name pendant represents wisdom and classical beauty through timeless, sophisticated letterforms. This distinguished piece combines intellectual elegance with refined craftsmanship, perfect for those who embody both inner wisdom and outer grace.',
    images: [
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/sophia-gold.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/sophia-silver.jpeg',
      'https://jpbfprlpbiojfhshlhcp.supabase.co/storage/v1/object/public/product-images/sophia-rose-gold.jpeg'
    ],
    rating: 5,
    reviewCount: 267,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold', 'black', 'vintage-copper'],
    category: 'custom-pendants',
    stock: 35,
    sku: 'SOP-008'
  }
];

// Utility functions for backward compatibility
export const getProductById = (id: string): Product | undefined => {
  return shopProducts.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return shopProducts.find(product => product.slug === slug);
};

// Get featured products for homepage (based on your database featured_order)
export const getFeaturedProducts = (): Product[] => {
  // Featured products based on your database: Aria (order 1), Habibi (order 3), Yasmeen (order 7), Zara (order 8)
  const featuredIds = [
    'd3484f2c-4bea-49f8-9b59-c8cd38131042', // Aria
    '04567b3e-e294-4763-9e9a-a40e414bf361', // Habibi
    '3c3f0913-6944-4841-b078-d70d7c097f97', // Yasmeen
    'c06ce985-be8d-4470-a286-8049bc2b9387'  // Zara
  ];
  
  return featuredIds
    .map(id => shopProducts.find(product => product.id === id))
    .filter(Boolean) as Product[];
};