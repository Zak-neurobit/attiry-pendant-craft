
import { useEffect, useRef } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export const Shop = () => {
  const { 
    products, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: loading, 
    error 
  } = useInfiniteProducts();
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="py-8 text-center">
          {isFetchingNextPage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <Button 
              onClick={() => fetchNextPage()} 
              variant="outline" 
              size="lg"
              className="mb-8"
            >
              Load More Products
            </Button>
          )}
        </div>

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
