
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
import FontPicker from '@/components/product/FontPicker';
import NameInput from '@/components/product/NameInput';
import PreviewName from '@/components/product/PreviewName';
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
      <div className="min-h-screen bg-background" id="product-detail-loading">
        <div className="container mx-auto px-4 py-8" id="loading-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" id="loading-grid">
            <div className="space-y-4" id="loading-image-section">
              <Skeleton className="aspect-square w-full rounded-lg" id="loading-image-skeleton" />
            </div>
            <div className="space-y-6" id="loading-details-section">
              <Skeleton className="h-8 w-3/4" id="loading-title-skeleton" />
              <Skeleton className="h-6 w-1/2" id="loading-price-skeleton" />
              <Skeleton className="h-4 w-full" id="loading-desc-1" />
              <Skeleton className="h-4 w-full" id="loading-desc-2" />
              <Skeleton className="h-4 w-2/3" id="loading-desc-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" id="product-detail-error">
        <div className="text-center" id="error-content">
          <h1 className="text-2xl font-bold mb-4" id="error-title">Product Not Found</h1>
          <p className="text-muted-foreground mb-4" id="error-message">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()} id="error-back-button">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = product.image_urls?.[0];
  const imageUrl = primaryImage ? getImageUrl(primaryImage) : null;

  return (
    <div className="min-h-screen bg-background" id="product-detail-page">
      <SEOHead
        title={product?.meta_title || `${product.title} - Attiry`}
        description={product?.meta_description || `Personalized ${product.title}. Custom engraved jewelry made with premium materials.`}
      />
      
      <div className="container mx-auto px-4 py-8" id="product-detail-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" id="product-detail-grid">
          {/* Product Images */}
          <div className="space-y-4" id="product-images-section">
            <div className="aspect-square" id="main-image-container">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                  id="main-product-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center" id="placeholder-image">
                  <span className="text-muted-foreground" id="placeholder-text">Image coming soon</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6" id="product-info-section">
            {/* Live visitor count */}
            <LiveVisitorCount productId={product?.id} />
            
            <div id="product-header">
              <h1 className="text-3xl font-bold text-foreground mb-2" id="product-title">
                {product?.title}
              </h1>
              
              {/* Stock urgency */}
              {product && <StockUrgency stock={product.stock} />}
              
              <div className="flex items-center gap-4 mb-6" id="price-section">
                <span className="text-3xl font-semibold text-foreground" style={{ fontWeight: 600, color: '#111' }} id="product-price">
                  ${calculateTotalPrice().toFixed(2)} USD
                </span>
                {product?.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-muted-foreground line-through" id="compare-price">
                    ${product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Name Input */}
              <div id="name-input-section">
                <NameInput />
              </div>

              {/* Live Preview */}
              <div id="preview-section">
                <PreviewName />
              </div>

              {/* Color Picker */}
              <div id="color-picker-section">
                <ColorPicker />
              </div>

              {/* Font Picker */}
              <div id="font-picker-section">
                <FontPicker />
              </div>

              {/* Gift Wrap Option */}
              <div id="gift-wrap-section">
                <GiftWrapOption 
                  checked={giftWrap}
                  onCheckedChange={setGiftWrap}
                />
              </div>
            </div>

            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              disabled={!isValid()}
              id="add-to-cart-button"
            >
              Add to Cart
            </Button>

            {!isValid() && (
              <p className="text-sm text-muted-foreground text-center" id="validation-message">
                Please enter a valid name (1-12 characters, letters and spaces only)
              </p>
            )}

            {/* Trust Badges */}
            <div id="trust-badges-section">
              <TrustBadges />
            </div>

            <div className="prose max-w-none" id="product-description">
              <h2 id="description-title">Description</h2>
              <p id="description-content">{product?.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product && <ReviewsSection productId={product.id} />}
      </div>
    </div>
  );
}
