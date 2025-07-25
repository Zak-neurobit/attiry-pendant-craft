import { supabase } from '@/integrations/supabase/client';

export interface FeaturedProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  featured_order: number;
  image_urls: string[] | null;
  color_variants: string[] | null;
  chain_types: string[] | null;
  fonts: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  tags: string[] | null;
  cogs: number;
  created_at: string;
  updated_at: string;
}

/**
 * Toggle product featured status
 */
export const toggleProductFeatured = async (productId: string, isFeatured: boolean) => {
  try {
    const updateData: any = { is_featured: isFeatured };
    
    // If featuring the product, set a featured_order based on current timestamp
    if (isFeatured) {
      updateData.featured_order = Math.floor(Date.now() / 1000);
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error toggling product featured status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get featured products for homepage
 */
export const getFeaturedProducts = async (limit: number = 4): Promise<FeaturedProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('featured_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

/**
 * Get featured products with fallback to newest products if no featured products exist
 */
export const getFeaturedProductsWithFallback = async (limit: number = 4): Promise<FeaturedProduct[]> => {
  try {
    // First try to get featured products
    const featuredProducts = await getFeaturedProducts(limit);
    
    if (featuredProducts.length > 0) {
      return featuredProducts;
    }

    // Fallback to newest active products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error('Error fetching products with fallback:', error);
    return [];
  }
};

/**
 * Update featured product display order
 */
export const updateFeaturedOrder = async (productId: string, order: number) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ featured_order: order })
      .eq('id', productId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating featured order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Bulk feature/unfeature products
 */
export const bulkUpdateFeatured = async (productIds: string[], isFeatured: boolean) => {
  try {
    const updateData: any = { is_featured: isFeatured };
    
    // If featuring products, set featured_order based on current timestamp with increments
    if (isFeatured) {
      const baseTimestamp = Math.floor(Date.now() / 1000);
      
      // Update each product with a unique featured_order
      const promises = productIds.map((productId, index) => {
        return supabase
          .from('products')
          .update({ 
            is_featured: isFeatured, 
            featured_order: baseTimestamp + index 
          })
          .eq('id', productId);
      });

      const results = await Promise.all(promises);
      
      // Check if any updates failed
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} products`);
      }
    } else {
      // If unfeaturing, update all at once
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .in('id', productIds);

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error bulk updating featured status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get count of featured products
 */
export const getFeaturedProductsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_featured', true)
      .eq('is_active', true);

    if (error) throw error;

    return count || 0;
  } catch (error: any) {
    console.error('Error getting featured products count:', error);
    return 0;
  }
};