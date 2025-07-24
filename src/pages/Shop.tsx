
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

const getSalePrice = (originalPrice: number) => {
  return originalPrice * 0.75; // 25% off
};

export const Shop = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
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
    const originalPrice = supabaseProduct.price;
    const salePrice = getSalePrice(originalPrice);

    return {
      id: supabaseProduct.id,
      slug: `product-${supabaseProduct.id}`,
      name: supabaseProduct.title,
      price: salePrice,
      originalPrice: originalPrice,
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
            <div>Loading products...</div>
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map((supabaseProduct) => (
            <ProductCard
              key={supabaseProduct.id}
              product={convertToProduct(supabaseProduct)}
            />
          ))}
        </motion.div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">Check back soon for new pendant designs!</p>
          </div>
        )}
      </div>
    </div>
  );
};
