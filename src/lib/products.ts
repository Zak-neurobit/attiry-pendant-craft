
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

// Updated mock product data for custom name pendants
export const products: Product[] = [
  {
    id: '1',
    slug: 'classic-gold-nameplate',
    name: 'Classic Gold Nameplate',
    price: 79.99,
    originalPrice: 99.99,
    description: 'Elegant 18k gold-plated nameplate pendant with classic script engraving.',
    images: ['/src/assets/product-gold.jpg', '/src/assets/product-rose-gold.jpg'],
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
    images: ['/src/assets/product-rose-gold.jpg', '/src/assets/product-gold.jpg'],
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
    images: ['/src/assets/product-gold.jpg', '/src/assets/product-rose-gold.jpg'],
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
    images: ['/src/assets/product-rose-gold.jpg', '/src/assets/product-gold.jpg'],
    rating: 5,
    reviewCount: 67,
    isNew: true,
    colors: ['gold', 'silver', 'rose-gold'],
    category: 'custom'
  }
];

export const getProduct = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProducts = (): Product[] => {
  return products;
};
