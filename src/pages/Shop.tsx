
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// 12 custom name pendant products
const shopProducts: Product[] = [
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

export const Shop = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
              Custom Name Pendants
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalize your style with our handcrafted name pendants.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-heading text-foreground mb-4">
              Unable to load products
            </h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Showing fallback products from cache
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
            Custom Name Pendants
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Personalize your style with our handcrafted name pendants. Choose from elegant designs
            in premium finishes, each piece uniquely yours.
          </p>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </motion.div>

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-background to-secondary rounded-2xl">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Let us create something special just for you. Our custom design service brings your vision to life.
          </p>
          <button className="btn-cta">
            Request Custom Design
          </button>
        </div>
      </div>
    </div>
  );
};
