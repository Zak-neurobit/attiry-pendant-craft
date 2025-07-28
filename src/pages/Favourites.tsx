
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFavourites } from '@/stores/favourites';
import { useAuth } from '@/stores/auth';
import { useProducts } from '@/hooks/useProducts';

export const Favourites = () => {
  const { user } = useAuth();
  const { favourites, loadFavourites, isLoading, removeFromFavourites } = useFavourites();
  const { products } = useProducts();

  useEffect(() => {
    if (user) {
      loadFavourites();
    }
  }, [user, loadFavourites]);

  // Use database products with current prices
  const favouriteProducts = useMemo(() => {
    return products.filter(product => favourites.includes(product.id));
  }, [favourites, products]);

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

  const getSalePrice = (price: number, originalPrice?: number) => {
    return originalPrice && originalPrice > price ? price : price;
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
          <h1 className="text-2xl font-cormorant font-bold mb-4">Sign In Required</h1>
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

  if (favouriteProducts.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Subtle floral embossing background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white"></div>
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(229, 231, 235, 0.4) 2px, transparent 2px),
                radial-gradient(circle at 75% 25%, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 25% 75%, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, rgba(229, 231, 235, 0.4) 2px, transparent 2px),
                radial-gradient(circle at 50% 50%, rgba(229, 231, 235, 0.2) 1.5px, transparent 1.5px)
              `,
              backgroundSize: '60px 60px, 80px 80px, 70px 70px, 90px 90px, 50px 50px',
              backgroundPosition: '0 0, 30px 30px, 15px 45px, 45px 15px, 25px 25px',
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-conic-gradient(
                  from 0deg at 50% 50%,
                  rgba(229, 231, 235, 0.15) 0deg 30deg,
                  transparent 30deg 60deg,
                  rgba(229, 231, 235, 0.1) 60deg 90deg,
                  transparent 90deg 120deg
                )
              `,
              backgroundSize: '120px 120px',
              transform: 'rotate(15deg) scale(1.2)',
              transformOrigin: 'center',
            }}
          />
        </div>

        <div className="text-center max-w-md mx-auto px-6 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          </motion.div>
          <h1 className="text-2xl font-cormorant font-bold mb-4">No Favourites Yet</h1>
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
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Subtle floral embossing background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white"></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(229, 231, 235, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 75% 25%, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 25% 75%, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(229, 231, 235, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 50% 50%, rgba(229, 231, 235, 0.2) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '60px 60px, 80px 80px, 70px 70px, 90px 90px, 50px 50px',
            backgroundPosition: '0 0, 30px 30px, 15px 45px, 45px 15px, 25px 25px',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-conic-gradient(
                from 0deg at 50% 50%,
                rgba(229, 231, 235, 0.15) 0deg 30deg,
                transparent 30deg 60deg,
                rgba(229, 231, 235, 0.1) 60deg 90deg,
                transparent 90deg 120deg
              )
            `,
            backgroundSize: '120px 120px',
            transform: 'rotate(15deg) scale(1.2)',
            transformOrigin: 'center',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold mb-4">
            Your Favourites
          </h1>
          <p className="text-muted-foreground">
            {favouriteProducts.length} {favouriteProducts.length === 1 ? 'item' : 'items'} you've saved for later
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {favouriteProducts.map((product) => (
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
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
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
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(getSalePrice(product.price, product.originalPrice))}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="text-xs text-muted-foreground">Colors:</span>
                        <div className="flex space-x-1">
                          {product.colors.slice(0, 3).map((color) => (
                            <div
                              key={color}
                              className={`w-4 h-4 rounded-full border border-border ${
                                color === 'gold' ? 'bg-yellow-400' : 
                                color === 'rose-gold' ? 'bg-rose-400' : 
                                color === 'silver' ? 'bg-gray-300' :
                                color === 'black' ? 'bg-gray-800' :
                                'bg-gray-400'
                              }`}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{product.colors.length - 3}
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
