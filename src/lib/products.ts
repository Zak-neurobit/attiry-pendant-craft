
// Re-export types and utilities from the new useProducts hook
export type { Product, DatabaseProduct } from '@/hooks/useProducts';
export { mapFrontendColorToDatabase } from '@/hooks/useProducts';

// Minimal emergency fallback products (only used when database is completely unavailable)
// In production, the system primarily uses the useProducts hook to fetch from Supabase
export const shopProducts: Product[] = [
  {
    id: 'emergency-fallback-001',
    slug: 'emergency-pendant',
    name: 'Custom Name Pendant',
    price: 299.99,
    originalPrice: 399.99,
    description: 'Personalized name pendant. Database temporarily unavailable - please try again later.',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=60'
    ],
    rating: 5,
    reviewCount: 0,
    isNew: false,
    colors: ['gold'],
    category: 'custom-pendants',
    stock: 0,
    sku: 'EMRG-001'
  }
];

// Utility functions for backward compatibility (use these when not using the hook)
export const getProductById = (id: string): Product | undefined => {
  return shopProducts.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return shopProducts.find(product => product.slug === slug);
};
