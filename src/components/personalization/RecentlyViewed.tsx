
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  image_urls: string[];
  color_variants: string[];
}

export const RecentlyViewed: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadRecentlyViewed();
  }, [user]);

  const loadRecentlyViewed = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: behavior } = await supabase
        .from('user_behavior')
        .select('viewed_products')
        .eq('user_id', user.id)
        .single();

      if (behavior?.viewed_products && behavior.viewed_products.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('id, title, price, image_urls, color_variants')
          .in('id', behavior.viewed_products.slice(0, 12))
          .eq('is_active', true);

        if (products) {
          // Maintain the order from viewed_products
          const orderedProducts = behavior.viewed_products
            .map(id => products.find(p => p.id === id))
            .filter(Boolean)
            .slice(0, 12);
          setProducts(orderedProducts);
        }
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.title}
              price={product.price}
              image={product.image_urls[0] || '/placeholder.svg'}
              colors={product.color_variants}
              slug={`product-${product.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
