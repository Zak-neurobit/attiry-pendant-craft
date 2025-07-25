
// Re-export types and utilities from the new useProducts hook
export type { Product, DatabaseProduct } from '@/hooks/useProducts';
export { mapFrontendColorToDatabase } from '@/hooks/useProducts';

// Static fallback products (kept as backup when database is unavailable)
// In production, use the useProducts hook to fetch from Supabase
export const shopProducts: Product[] = [
  {
    id: '1',
    slug: 'classic-gold-nameplate',
    name: 'Classic Gold Nameplate',
    price: 79.99,
    originalPrice: 99.99,
    description: 'Elegant 18k gold-plated nameplate pendant with classic script engraving.',
    images: ['/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 124,
    isNew: true,
    colors: ['gold', 'rose-gold', 'silver'],
    category: 'gold'
  },
  {
    id: '2',
    slug: 'rose-gold-script-pendant',
    name: 'Rose Gold Script Pendant',
    price: 74.99,
    originalPrice: 94.99,
    description: 'Beautiful rose gold pendant featuring elegant script lettering.',
    images: ['/src/assets/product-rose-gold.jpg'],
    rating: 5,
    reviewCount: 89,
    colors: ['rose-gold', 'gold', 'silver'],
    category: 'rose-gold'
  },
  {
    id: '3',
    slug: 'sterling-silver-nameplate',
    name: 'Sterling Silver Nameplate',
    price: 69.99,
    originalPrice: 89.99,
    description: 'Premium sterling silver nameplate with precision engraving.',
    images: ['/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 156,
    colors: ['silver', 'gold', 'rose-gold'],
    category: 'silver'
  },
  {
    id: '4',
    slug: 'custom-cursive-pendant',
    name: 'Custom Cursive Pendant',
    price: 84.99,
    originalPrice: 104.99,
    description: 'Handcrafted cursive name pendant in your choice of metal finish.',
    images: ['/src/assets/product-rose-gold.jpg'],
    rating: 5,
    reviewCount: 67,
    isNew: true,
    colors: ['gold', 'silver', 'rose-gold'],
    category: 'custom'
  },
  {
    id: '5',
    slug: 'deluxe-gold-pendant',
    name: 'Deluxe Gold Pendant',
    price: 89.99,
    originalPrice: 119.99,
    description: 'Premium gold-plated pendant with diamond-cut edges.',
    images: ['/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 203,
    colors: ['gold', 'rose-gold'],
    category: 'gold'
  },
  {
    id: '6',
    slug: 'minimalist-bar-pendant',
    name: 'Minimalist Bar Pendant',
    price: 64.99,
    originalPrice: 84.99,
    description: 'Sleek and modern bar-style name pendant in multiple finishes.',
    images: ['/src/assets/product-rose-gold.jpg'],
    rating: 5,
    reviewCount: 98,
    colors: ['silver', 'gold', 'rose-gold'],
    category: 'minimalist'
  },
  {
    id: '7',
    slug: 'vintage-ornate-pendant',
    name: 'Vintage Ornate Pendant',
    price: 94.99,
    originalPrice: 124.99,
    description: 'Vintage-inspired pendant with ornate decorative borders.',
    images: ['/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 142,
    isNew: true,
    colors: ['gold', 'silver', 'copper'],
    category: 'vintage'
  },
  {
    id: '8',
    slug: 'heart-shaped-nameplate',
    name: 'Heart-Shaped Nameplate',
    price: 72.99,
    originalPrice: 92.99,
    description: 'Romantic heart-shaped pendant perfect for gifts.',
    images: ['/src/assets/product-rose-gold.jpg'],
    rating: 5,
    reviewCount: 178,
    colors: ['rose-gold', 'gold', 'silver'],
    category: 'heart'
  },
  {
    id: '9',
    slug: 'infinity-name-pendant',
    name: 'Infinity Name Pendant',
    price: 79.99,
    originalPrice: 99.99,
    description: 'Elegant infinity symbol combined with custom name engraving.',
    images: ['/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 134,
    colors: ['gold', 'silver', 'rose-gold'],
    category: 'infinity'
  },
  {
    id: '10',
    slug: 'double-layer-pendant',
    name: 'Double Layer Pendant',
    price: 104.99,
    originalPrice: 134.99,
    description: 'Sophisticated double-layer design with contrasting metals.',
    images: ['/src/assets/product-rose-gold.jpg'],
    rating: 5,
    reviewCount: 87,
    isNew: true,
    colors: ['gold', 'silver'],
    category: 'layered'
  },
  {
    id: '11',
    slug: 'birthstone-nameplate',
    name: 'Birthstone Nameplate',
    price: 99.99,
    originalPrice: 129.99,
    description: 'Personalized nameplate with genuine birthstone accent.',
    images: ['/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 156,
    colors: ['gold', 'rose-gold', 'silver'],
    category: 'birthstone'
  },
  {
    id: '12',
    slug: 'family-tree-pendant',
    name: 'Family Tree Pendant',
    price: 114.99,
    originalPrice: 149.99,
    description: 'Beautiful family tree design with custom name engravings.',
    images: ['/src/assets/product-rose-gold.jpg'],
    rating: 5,
    reviewCount: 92,
    isNew: true,
    colors: ['gold', 'silver', 'rose-gold'],
    category: 'family'
  }
];

// Utility functions for backward compatibility (use these when not using the hook)
export const getProductById = (id: string): Product | undefined => {
  return shopProducts.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return shopProducts.find(product => product.slug === slug);
};
