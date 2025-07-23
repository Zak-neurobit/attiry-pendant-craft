import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
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

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

const getSalePrice = (originalPrice: number) => {
  return originalPrice * 0.75; // 25% off
};

const formatSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

export const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
          {products.map((product) => {
            const originalPrice = product.price;
            const salePrice = getSalePrice(originalPrice);
            const slug = formatSlug(product.title);

            return (
              <motion.div key={product.id} variants={item}>
                <Link to={`/product/${slug}`} state={{ product }}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image_urls[0]}
                        alt={product.title}
                        className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-accent-foreground font-medium">
                          25% OFF
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(originalPrice)}
                            </span>
                            <span className="font-bold text-foreground">
                              {formatPrice(salePrice)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {product.color_variants.slice(0, 3).map((color, index) => (
                            <div
                              key={color}
                              className={`w-3 h-3 rounded-full border border-border ${
                                color === 'gold'
                                  ? 'bg-yellow-400'
                                  : color === 'rose_gold'
                                  ? 'bg-rose-400'
                                  : color === 'silver'
                                  ? 'bg-gray-300'
                                  : color === 'matte_gold'
                                  ? 'bg-yellow-600'
                                  : color === 'matte_silver'
                                  ? 'bg-gray-400'
                                  : color === 'vintage_copper'
                                  ? 'bg-orange-600'
                                  : 'bg-gray-800'
                              }`}
                            />
                          ))}
                          {product.color_variants.length > 3 && (
                            <div className="w-3 h-3 rounded-full border border-border bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
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