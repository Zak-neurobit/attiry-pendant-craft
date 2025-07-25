
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFavourites } from '@/stores/favourites';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compare_price: number;
  image_urls: string[];
  color_variants: string[];
  slug: string;
}

export const Favourites = () => {
  const { user } = useAuth();
  const { favourites, loadFavourites, isLoading, removeFromFavourites } = useFavourites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavourites();
    }
  }, [user, loadFavourites]);

  useEffect(() => {
    const fetchFavouriteProducts = async () => {
      if (favourites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', favourites)
          .eq('is_active', true);

        if (data && !error) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching favourite products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteProducts();
  }, [favourites]);

  const handleRemoveFromFavourites = (productId: string) => {
    removeFromFavourites(productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSalePrice = (originalPrice: number, comparePrice: number) => {
    return comparePrice > originalPrice ? originalPrice : originalPrice;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-6">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-serif font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view your favourites.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your favourites...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          </motion.div>
          <h1 className="text-2xl font-serif font-bold mb-4">No Favourites Yet</h1>
          <p className="text-muted-foreground mb-8">
            Start building your collection by adding products to your favourites. 
            Look for the heart icon on product cards and detail pages.
          </p>
          <Button asChild size="lg">
            <Link to="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Your Favourites
          </h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? 'item' : 'items'} you've saved for later
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <Link
                to={`/product/${product.slug}`}
                className="block"
              >
                <div className="bg-card rounded-lg shadow-soft overflow-hidden border transition-transform duration-300 group-hover:scale-105">
                  <div className="relative aspect-square">
                    <img
                      src={product.image_urls?.[0] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 bg-white/90 rounded-full hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFromFavourites(product.id);
                        }}
                      >
                        <Heart className="h-4 w-4 text-accent fill-accent" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(getSalePrice(product.price, product.compare_price))}
                      </span>
                      {product.compare_price > product.price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                            {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {product.color_variants && product.color_variants.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="text-xs text-muted-foreground">Colors:</span>
                        <div className="flex space-x-1">
                          {product.color_variants.slice(0, 3).map((color) => (
                            <div
                              key={color}
                              className={`w-4 h-4 rounded-full border border-border ${
                                color === 'gold' ? 'bg-yellow-400' : 
                                color === 'rose_gold' ? 'bg-rose-400' : 
                                'bg-gray-400'
                              }`}
                            />
                          ))}
                          {product.color_variants.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{product.color_variants.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
