import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseProduct, Product } from './useProducts';
import { Database } from '@/integrations/supabase/types';

const PRODUCTS_PER_PAGE = 12;

interface ProductsPage {
  products: Product[];
  nextCursor: number | null;
  hasMore: boolean;
}

const fetchProductsPage = async ({ pageParam = 0 }): Promise<ProductsPage> => {
  try {
    const from = pageParam * PRODUCTS_PER_PAGE;
    const to = from + PRODUCTS_PER_PAGE - 1;

    const { data, error: supabaseError, count } = await supabase
      .from('products')
      .select('id, title, description, price, compare_price, stock, sku, image_urls, color_variants, chain_types, fonts, meta_title, meta_description, keywords, tags, cogs, category, slug, is_active, is_featured, featured_order, created_at, updated_at', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (supabaseError) {
      throw supabaseError;
    }
    
    const products = data?.map(convertDatabaseProduct) || [];
    const hasMore = count ? from + PRODUCTS_PER_PAGE < count : false;
    const nextCursor = hasMore ? pageParam + 1 : null;

    return {
      products,
      nextCursor,
      hasMore
    };
  } catch (err) {
    // Fallback to static products on first page only
    if (pageParam === 0) {
      const { shopProducts } = await import('@/lib/products');
      
      const from = pageParam * PRODUCTS_PER_PAGE;
      const pageProducts = shopProducts.slice(from, from + PRODUCTS_PER_PAGE);
      const hasMore = from + PRODUCTS_PER_PAGE < shopProducts.length;
      const nextCursor = hasMore ? pageParam + 1 : null;
      
      return {
        products: pageProducts,
        nextCursor,
        hasMore
      };
    }
    return { products: [], nextCursor: null, hasMore: false };
  }
};

// Convert database product to frontend format
const convertDatabaseProduct = (dbProduct: DatabaseProduct): Product => {
  // Use existing slug or create from title as fallback
  const slug = (dbProduct as any).slug || dbProduct.title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Map colors
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

export const useInfiniteProducts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['infinite-products'],
    queryFn: fetchProductsPage,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Flatten all pages into a single array
  const products = data?.pages.flatMap(page => page.products) || [];

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(product => product.slug === slug);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  return {
    products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: error as Error | null,
    getProductBySlug,
    getProductById,
    refetch,
    totalProducts: products.length
  };
};