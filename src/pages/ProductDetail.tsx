
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import ColorPicker from '@/components/product/ColorPicker';
import FontPicker from '@/components/product/FontPicker';
import NameInput from '@/components/product/NameInput';
import PreviewName from '@/components/product/PreviewName';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/auth';
import { useProductCustomizer } from '@/stores/productCustomizer';
import { LiveVisitorCount } from '@/components/conversion/LiveVisitorCount';
import { StockUrgency } from '@/components/conversion/StockUrgency';
import { TrustBadges } from '@/components/conversion/TrustBadges';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const { user } = useAuth();
  const { customization, isValid } = useProductCustomizer();
  const { trackProductView, trackAddToCart } = useAnalytics();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.error('Error loading product:', error);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

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

  const handleAddToCart = () => {
    if (!product || !isValid()) return;

    // Here you would typically add the product to a cart
    alert(`Added to cart: ${product.title} with "${customization.nameText}" in ${customization.color}`);
    
    // Track add to cart event
    trackAddToCart(product.id, calculateTotalPrice());
  };

  const calculateTotalPrice = () => {
    let total = product?.price || 0;
    if (giftWrap) {
      total += 5; // Gift wrap cost
    }
    return total;
  };

  const getImageUrl = () => {
    if (!product?.image_urls || product.image_urls.length === 0) return null;
    
    const imageUrl = product.image_urls[0];
    // If it's a Supabase storage path, get the public URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      return supabase.storage.from('product-images').getPublicUrl(imageUrl).data.publicUrl;
    }
    return imageUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
            <div className="space-y-6">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={product?.meta_title || `${product.title} - Attiry`}
        description={product?.meta_description || 'View details for our unique jewelry.'}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square">
              {getImageUrl() && !imageError ? (
                <img 
                  src={getImageUrl()}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-muted-foreground">Image coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Live visitor count */}
            <LiveVisitorCount productId={product?.id} />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product?.title}
              </h1>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-semibold text-gray-900">
                  ${calculateTotalPrice().toFixed(2)} USD
                </span>
                {product?.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock urgency */}
              {product && <StockUrgency stock={product.stock} />}

              {/* Name Input */}
              <NameInput />

              {/* Live Preview */}
              <PreviewName />

              {/* Color Picker */}
              <ColorPicker />

              {/* Font Picker */}
              <FontPicker />
            </div>

            {/* Gift Wrap Option */}
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <Checkbox
                id="gift-wrap"
                checked={giftWrap}
                onCheckedChange={setGiftWrap}
              />
              <Label htmlFor="gift-wrap" className="text-sm">
                Add gift wrap for $5.00
              </Label>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              disabled={!isValid()}
            >
              Add to Cart
            </Button>

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
