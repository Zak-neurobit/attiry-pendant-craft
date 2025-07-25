
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

export const Shop = () => {
  const { products, loading, error } = useProducts();

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  name: product.title,
                  price: Number(product.price),
                  originalPrice: Number(product.compare_price) > Number(product.price) ? Number(product.compare_price) : undefined,
                  description: product.description || '',
                  images: product.image_urls || ['/placeholder.svg'],
                  rating: 5,
                  reviewCount: Math.floor(Math.random() * 200) + 50,
                  isNew: product.tags?.includes('trending') || false,
                  colors: product.color_variants || [],
                  category: product.tags?.[0] || 'pendant'
                }}
              />
            ))}
          </motion.div>
        )}

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
