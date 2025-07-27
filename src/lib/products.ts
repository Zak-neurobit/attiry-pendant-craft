
// Re-export types and utilities from the new useProducts hook
export type { Product, DatabaseProduct } from '@/hooks/useProducts';
export { mapFrontendColorToDatabase } from '@/hooks/useProducts';

// Static fallback products (backup when database is unavailable)
// In production, use the useProducts hook to fetch from Supabase
export const shopProducts: Product[] = [
  {
    id: 'fallback-cgp-001',
    slug: 'classic-gold-name-pendant',
    name: 'Classic Gold Name Pendant',
    price: 299.99,
    originalPrice: 399.99,
    description: 'Beautiful handcrafted gold pendant with personalized name engraving. Perfect for everyday wear or special occasions.',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1609687393-6e96e1c9ad9e?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 5,
    reviewCount: 124,
    isNew: true,
    colors: ['gold'],
    category: 'custom-pendants',
    stock: 50,
    sku: 'CGP-001'
  },
  {
    id: 'fallback-rgh-002',
    slug: 'rose-gold-heart-pendant',
    name: 'Rose Gold Heart Pendant',
    price: 249.99,
    originalPrice: 329.99,
    description: 'Romantic rose gold pendant shaped like a heart with elegant name engraving. A perfect gift for loved ones.',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 5,
    reviewCount: 89,
    isNew: false,
    colors: ['rose-gold'],
    category: 'custom-pendants',
    stock: 35,
    sku: 'RGH-002'
  },
  {
    id: 'fallback-ssb-003',
    slug: 'sterling-silver-bar-pendant',
    name: 'Sterling Silver Bar Pendant',
    price: 199.99,
    originalPrice: 259.99,
    description: 'Modern minimalist silver bar pendant with sleek name engraving. Contemporary style for everyday elegance.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 5,
    reviewCount: 156,
    isNew: false,
    colors: ['silver'],
    category: 'custom-pendants',
    stock: 40,
    sku: 'SSB-003'
  },
  {
    id: 'fallback-vcc-004',
    slug: 'vintage-copper-circle-pendant',
    name: 'Vintage Copper Circle Pendant',
    price: 179.99,
    originalPrice: 229.99,
    description: 'Unique vintage-style copper pendant with artistic name engraving. Boho chic design with antique finish.',
    images: [
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 4,
    reviewCount: 73,
    isNew: false,
    colors: ['copper'],
    category: 'custom-pendants',
    stock: 25,
    sku: 'VCC-004'
  },
  {
    id: 'fallback-mgi-005',
    slug: 'matte-gold-infinity-pendant',
    name: 'Matte Gold Infinity Pendant',
    price: 329.99,
    originalPrice: 429.99,
    description: 'Elegant matte gold infinity symbol pendant with beautiful name engraving. Symbol of eternal love and friendship.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 5,
    reviewCount: 98,
    isNew: true,
    colors: ['matte-gold'],
    category: 'custom-pendants',
    stock: 30,
    sku: 'MGI-005'
  },
  {
    id: 'fallback-bsc-006',
    slug: 'black-steel-chain-pendant',
    name: 'Black Steel Chain Pendant',
    price: 159.99,
    originalPrice: 199.99,
    description: 'Bold black steel pendant with modern chain design. Perfect for contemporary style with personalized engraving.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 4,
    reviewCount: 45,
    isNew: false,
    colors: ['black'],
    category: 'custom-pendants',
    stock: 20,
    sku: 'BSC-006'
  }
];

// Utility functions for backward compatibility (use these when not using the hook)
export const getProductById = (id: string): Product | undefined => {
  return shopProducts.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return shopProducts.find(product => product.slug === slug);
};
