
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/auth';
import { LiveVisitorCount } from '@/components/conversion/LiveVisitorCount';
import { StockUrgency } from '@/components/conversion/StockUrgency';
import { TrustBadges } from '@/components/conversion/TrustBadges';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useProductCustomizer } from '@/stores/productCustomizer';
import { ColorPicker } from '@/components/product/ColorPicker';
import { FontPicker } from '@/components/product/FontPicker';
import { NameInput } from '@/components/product/NameInput';
import { PreviewName } from '@/components/product/PreviewName';
import { GiftWrapOption } from '@/components/product/GiftWrapOption';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const { user } = useAuth();
  const { trackProductView, trackAddToCart } = useAnalytics();
  const { customization, isValid } = useProductCustomizer();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        
        // First try to find by slug, then fall back to title-based slug matching
        let { data, error } = await supabase
          .from('products')
          .select('*')  
          .eq('title', slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
          .eq('is_active', true)
          .single();

        if (error && error.code === 'PGRST116') {
          // If no exact match, try a more flexible search
          const searchQuery = slug.replace(/-/g, ' ');
          const { data: searchData, error: searchError } = await supabase
            .from('products')
            .select('*')
            .ilike('title', `%${searchQuery}%`)
            .eq('is_active', true)
            .limit(1)
            .single();
          
          if (searchError) throw searchError;
          data = searchData;
        } else if (error) {
          throw error;
        }

        setProduct(data);
      } catch (err: any) {
        console.error('Error loading product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // Add product view tracking
  useEffect(() => {
    if (product) {
      trackProductView(product.id);
      
      // Update user behavior for logged-in users
      if (user) {
        updateViewedProducts(product.id);
      }
    }
  }, [product, user, trackProductView]);

  const updateViewedProducts = async (productId: string) => {
    if (!user) return;

    try {
      const { data: behavior } = await supabase
        .from('user_behavior')
        .select('viewed_products')
        .eq('user_id', user.id)
        .single();

      const viewedProducts = behavior?.viewed_products || [];
      const updatedProducts = [productId, ...viewedProducts.filter(id => id !== productId)].slice(0, 12);

      await supabase
        .from('user_behavior')
        .upsert({
          user_id: user.id,
          viewed_products: updatedProducts,
        });
    } catch (error) {
      console.error('Error updating viewed products:', error);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  const handleAddToCart = () => {
    if (!product || !isValid()) return;

    // Track add to cart event
    trackAddToCart(product.id, calculateTotalPrice());
    
    // Here you would typically add the product to a cart
    alert(`Added to cart: ${product.title} with name "${customization.nameText}" in ${customization.color} with ${customization.font}${giftWrap ? ' (with gift wrap)' : ''}`);
  };

  const calculateTotalPrice = () => {
    let total = product?.price || 0;
    if (giftWrap) {
      total += 5; // Gift wrap cost
    }
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = product.image_urls?.[0];
  const imageUrl = primaryImage ? getImageUrl(primaryImage) : null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={product?.meta_title || `${product.title} - Attiry`}
        description={product?.meta_description || `Personalized ${product.title}. Custom engraved jewelry made with premium materials.`}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Image coming soon</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Live visitor count */}
            <LiveVisitorCount productId={product?.id} />
            
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product?.title}
              </h1>
              
              {/* Stock urgency */}
              {product && <StockUrgency stock={product.stock} />}
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-semibold text-foreground" style={{ fontWeight: 600, color: '#111' }}>
                  ${calculateTotalPrice().toFixed(2)} USD
                </span>
                {product?.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Name Input */}
              <NameInput />

              {/* Live Preview */}
              <PreviewName />

              {/* Color Picker */}
              <ColorPicker />

              {/* Font Picker */}
              <FontPicker />

              {/* Gift Wrap Option */}
              <GiftWrapOption 
                checked={giftWrap}
                onCheckedChange={setGiftWrap}
              />
            </div>

            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              disabled={!isValid()}
            >
              Add to Cart
            </Button>

            {!isValid() && (
              <p className="text-sm text-muted-foreground text-center">
                Please enter a valid name (1-12 characters, letters and spaces only)
              </p>
            )}

            {/* Trust Badges */}
            <TrustBadges />

            <div className="prose max-w-none">
              <h2>Description</h2>
              <p>{product?.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product && <ReviewsSection productId={product.id} />}
      </div>
    </div>
  );
}
