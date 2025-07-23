export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  colors: string[];
  category: string;
}

// Mock product data
export const products: Product[] = [
  {
    id: '1',
    slug: 'custom-gold-name-pendant',
    name: 'Custom Gold Name Pendant',
    price: 74.99,
    originalPrice: 99.99,
    description: 'Elegant gold-plated pendant with custom name engraving. Perfect for special occasions and personal gifts.',
    images: [
      '/src/assets/product-gold.jpg',
      '/src/assets/product-rose-gold.jpg'
    ],
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
    price: 69.99,
    originalPrice: 92.99,
    description: 'Beautiful rose gold pendant featuring elegant script lettering.',
    images: [
      '/src/assets/product-rose-gold.jpg',
      '/src/assets/product-gold.jpg'
    ],
    rating: 5,
    reviewCount: 89,
    colors: ['rose-gold', 'gold', 'silver'],
    category: 'rose-gold'
  },
  {
    id: '3',
    slug: 'classic-silver-nameplate',
    name: 'Classic Silver Nameplate',
    price: 59.99,
    originalPrice: 79.99,
    description: 'Timeless sterling silver nameplate with precision engraving.',
    images: [
      '/src/assets/product-gold.jpg',
      '/src/assets/product-rose-gold.jpg'
    ],
    rating: 5,
    reviewCount: 156,
    colors: ['silver', 'gold', 'copper'],
    category: 'silver'
  },
  {
    id: '4',
    slug: 'vintage-copper-pendant',
    name: 'Vintage Copper Pendant',
    price: 64.99,
    originalPrice: 86.99,
    description: 'Unique copper finish pendant with vintage styling.',
    images: [
      '/src/assets/product-rose-gold.jpg',
      '/src/assets/product-gold.jpg'
    ],
    rating: 5,
    reviewCount: 67,
    colors: ['copper', 'gold', 'silver'],
    category: 'copper'
  }
];

export const getProduct = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProducts = (): Product[] => {
  return products;
};