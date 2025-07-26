import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_price?: number;
  stock: number;
  sku: string | null;
  image_urls: string[] | null;
  color_variants: string[] | null;
  keywords: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
  // Create slug from title
  const slug = dbProduct.title.toLowerCase()
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

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      const convertedProducts = data?.map(convertDatabaseProduct) || [];
      setProducts(convertedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      
      // Fallback to static products if database fails
      const { shopProducts } = await import('@/lib/products');
      setProducts(shopProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(product => product.slug === slug);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    getProductBySlug,
    getProductById,
    refetch
  };
};

export default useProducts;