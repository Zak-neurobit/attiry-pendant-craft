import { useQuery } from '@tanstack/react-query';
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
  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
    isStale
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Products are now loaded from database

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(product => product.slug === slug);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  return {
    products,
    loading,
    error: error as Error | null,
    getProductBySlug,
    getProductById,
    refetch,
    isStale
  };
};

export default useProducts;