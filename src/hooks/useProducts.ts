import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type DatabaseProduct = Database['public']['Tables']['products']['Row'];

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  colors: string[];
  category: string;
  stock: number;
  sku?: string;
}

// Map database color variants to frontend color names
const mapDatabaseColorToFrontend = (dbColor: string): string => {
  const colorMap: { [key: string]: string } = {
    'gold': 'gold',
    'rose_gold': 'rose-gold',
    'silver': 'silver',
    'matte_gold': 'matte-gold',
    'matte_silver': 'matte-silver',
    'vintage_copper': 'copper',
    'black': 'black'
  };
  return colorMap[dbColor] || dbColor;
};

// Map frontend color names to database color variants
export const mapFrontendColorToDatabase = (frontendColor: string): string => {
  const colorMap: { [key: string]: string } = {
    'gold': 'gold',
    'rose-gold': 'rose_gold',
    'silver': 'silver',
    'matte-gold': 'matte_gold',
    'matte-silver': 'matte_silver',
    'copper': 'vintage_copper',
    'black': 'black'
  };
  return colorMap[frontendColor] || frontendColor;
};

// Convert database product to frontend format
const convertDatabaseProduct = (dbProduct: DatabaseProduct): Product => {
  // Use existing slug or create from title as fallback
  const slug = (dbProduct as any).slug || dbProduct.title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Map colors
  const colors = dbProduct.color_variants?.map(mapDatabaseColorToFrontend) || ['gold'];

  // Use fallback images if none provided
  const images = dbProduct.image_urls && dbProduct.image_urls.length > 0 
    ? dbProduct.image_urls 
    : ['/src/assets/product-gold.jpg'];

  return {
    id: dbProduct.id,
    slug,
    name: dbProduct.title,
    price: Number(dbProduct.price),
    originalPrice: dbProduct.compare_price && Number(dbProduct.compare_price) > Number(dbProduct.price) 
      ? Number(dbProduct.compare_price) 
      : undefined,
    description: dbProduct.description || '',
    images,
    rating: 5, // Default rating - could be enhanced with reviews system
    reviewCount: Math.floor(Math.random() * 200) + 50, // Random for now
    isNew: new Date(dbProduct.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // New if created in last 30 days
    colors,
    category: 'custom-pendants',
    stock: dbProduct.stock,
    sku: dbProduct.sku || undefined
  };
};

// Optimized fetch function for React Query
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('products')
      .select('id, title, description, price, compare_price, stock, sku, image_urls, color_variants, chain_types, fonts, meta_title, meta_description, keywords, tags, cogs, category, slug, is_active, is_featured, featured_order, created_at, updated_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50); // Limit initial load

    if (supabaseError) {
      throw supabaseError;
    }

    const products = data?.map(convertDatabaseProduct) || [];

    // If database succeeds but returns no products, use fallback
    if (products.length === 0) {
      const { shopProducts } = await import('@/lib/products');
      return shopProducts;
    }

    return products;
  } catch (err) {
    // Fallback to static products if database fails
    const { shopProducts } = await import('@/lib/products');
    return shopProducts;
  }
};

export const useProducts = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Simple memory cache
  const cacheRef = React.useRef<{
    data: Product[] | null;
    timestamp: number;
  }>({ data: null, timestamp: 0 });

  const fetchProducts = React.useCallback(async () => {
    // Check cache first (2 minutes)
    const now = Date.now();
    if (cacheRef.current.data && (now - cacheRef.current.timestamp < 2 * 60 * 1000)) {
      setProducts(cacheRef.current.data);
      setLoading(false);
      return cacheRef.current.data;
    }

    setLoading(true);
    setError(null);

    try {
      // Direct Supabase query with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 2000)
      );

      const queryPromise = supabase
        .from('products')
        .select('id, title, description, price, compare_price, stock, sku, image_urls, color_variants, chain_types, fonts, meta_title, meta_description, keywords, tags, cogs, category, slug, is_active, is_featured, featured_order, created_at, updated_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const { data, error: supabaseError } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any;

      if (supabaseError) {
        throw supabaseError;
      }

      const convertedProducts = data?.map(convertDatabaseProduct) || [];
      
      // Update cache
      cacheRef.current = {
        data: convertedProducts,
        timestamp: now
      };

      setProducts(convertedProducts);
      setLoading(false);
      return convertedProducts;

    } catch (err) {
      console.warn('Database query failed, using static fallback:', err);
      // Fallback to static products only on genuine failure
      const { shopProducts } = await import('@/lib/products');
      
      cacheRef.current = {
        data: shopProducts,
        timestamp: now
      };

      setProducts(shopProducts);
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      setLoading(false);
      return shopProducts;
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(product => product.slug === slug);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const refetch = React.useCallback(() => {
    // Clear cache and refetch
    cacheRef.current = { data: null, timestamp: 0 };
    return fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    getProductBySlug,
    getProductById,
    refetch,
    isStale: false
  };
};

export default useProducts;