import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SimpleProductCard } from '@/components/SimpleProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';

export const Shop = () => {
  const [displayCount, setDisplayCount] = useState(12);
  const { products, loading } = useProducts();
  
  // Get products to display with current database prices
  const productsToShow = products.slice(0, displayCount);
  const hasMoreProducts = displayCount < products.length;

  const loadMoreProducts = () => {
    setDisplayCount(prev => Math.min(prev + 12, products.length));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-cormorant text-foreground mb-4">
            Custom Name Pendants
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Personalize your style with our handcrafted name pendants. Choose from elegant designs
            in premium finishes, each piece uniquely yours.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            {loading ? 'Loading products...' : `Showing ${productsToShow.length} of ${products.length} products`}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg h-96"
              />
            ))
          ) : (
            productsToShow.map((product, index) => (
              <div 
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <SimpleProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMoreProducts && (
          <div className="text-center mt-12">
            <Button 
              onClick={loadMoreProducts} 
              variant="outline" 
              size="lg"
              className="px-8 py-3"
            >
              Load More Products ({products.length - displayCount} remaining)
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-background to-secondary rounded-2xl">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Let us create something special just for you. Our custom design service brings your vision to life.
          </p>
          <Button asChild className="btn-cta">
            <Link to="/design-request">
              Request Custom Design
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};