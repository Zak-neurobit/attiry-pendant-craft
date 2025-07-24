
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/products';

interface SupabaseProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_urls: string[];
  color_variants: string[];
  keywords: string[];
  sku: string;
  compare_price?: number;
  stock?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const getSalePrice = (originalPrice: number, comparePrice?: number) => {
  if (comparePrice && comparePrice > originalPrice) {
    return originalPrice;
  }
  return originalPrice * 0.75; // 25% off as fallback
};

export const Shop = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched products:', data);
      setProducts(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch products');
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const convertToProduct = (supabaseProduct: SupabaseProduct): Product => {
    const originalPrice = supabaseProduct.compare_price || supabaseProduct.price;
    const salePrice = getSalePrice(supabaseProduct.price, supabaseProduct.compare_price);

    return {
      id: supabaseProduct.id,
      slug: supabaseProduct.id, // Use ID as slug for simpler routing
      name: supabaseProduct.title,
      price: salePrice,
      originalPrice: originalPrice > salePrice ? originalPrice : undefined,
      description: supabaseProduct.description || '',
      images: supabaseProduct.image_urls || ['/placeholder.svg'],
      rating: 5,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      isNew: Math.random() > 0.7,
      colors: supabaseProduct.color_variants || ['gold', 'rose-gold', 'silver'],
      category: 'custom'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Error Loading Products</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              Try Again
            </button>
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
        {products.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((supabaseProduct) => (
              <ProductCard
                key={supabaseProduct.id}
                product={convertToProduct(supabaseProduct)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">Check back soon for new pendant designs!</p>
          </div>
        )}
      </div>
    </div>
  );
};
