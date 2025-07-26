
// Re-export types and utilities from the new useProducts hook
export type { Product, DatabaseProduct } from '@/hooks/useProducts';
export { mapFrontendColorToDatabase } from '@/hooks/useProducts';

// Static fallback products (minimal backup when database is unavailable)
// In production, use the useProducts hook to fetch from Supabase
export const shopProducts: Product[] = [
  // Empty fallback - all products now come from database
  // This ensures no old $4000 products are displayed
];

// Utility functions for backward compatibility (use these when not using the hook)
export const getProductById = (id: string): Product | undefined => {
  return shopProducts.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return shopProducts.find(product => product.slug === slug);
};
