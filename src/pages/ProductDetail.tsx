
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { ColorPicker } from '@/components/product/ColorPicker';
import { FontPicker } from '@/components/product/FontPicker';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/auth';
import { LiveVisitorCount } from '@/components/conversion/LiveVisitorCount';
import { StockUrgency } from '@/components/conversion/StockUrgency';
import { TrustBadges } from '@/components/conversion/TrustBadges';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { GiftOptions } from '@/components/gift/GiftOptions';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('');
  const { user } = useAuth();
  const { trackProductView, trackAddToCart } = useAnalytics();
  const [giftOptions, setGiftOptions] = useState({
    isGift: false,
    message: '',
    giftWrap: false,
    deliveryDate: undefined as Date | undefined,
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.error('Error loading product:', error);
        } else {
          setProduct(data);
          setSelectedColor(data.color_variants?.[0] || '');
          setSelectedFont(data.fonts?.[0] || '');
        }
      } catch (error) {
        console.error('Error loading product:', error);
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
    if (!product) return;

    // Basic validation
    if (!selectedColor) {
      alert('Please select a color.');
      return;
    }

    if (!selectedFont) {
      alert('Please select a font.');
      return;
    }

    // Here you would typically add the product to a cart
    // This is a placeholder for that functionality
    alert(`Added to cart: ${product.title} in ${selectedColor} with ${selectedFont}`);
    
    // Track add to cart event
    if (product) {
      trackAddToCart(product.id, product.price);
    }
    
    // You might also want to update local storage or a context
    // to reflect the items in the cart
  };

  const handleGiftOptionsChange = (options: {
    isGift: boolean;
    message: string;
    giftWrap: boolean;
    deliveryDate?: Date;
  }) => {
    setGiftOptions({
      ...options,
      deliveryDate: options.deliveryDate || undefined,
    });
  };

  const calculateTotalPrice = () => {
    let total = product?.price || 0;
    if (giftOptions.giftWrap) {
      total += 5; // Gift wrap cost
    }
    return total;
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={product?.meta_title || 'Product Detail - Attiry'}
        description={product?.meta_description || 'View details for our unique jewelry.'}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product?.image_urls && product.image_urls.length > 0 && (
              <div className="aspect-square">
                <img 
                  src={product.image_urls[0]} 
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Live visitor count */}
            <LiveVisitorCount productId={product?.id} />
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product?.title}
              </h1>
              
              {/* Stock urgency */}
              {product && <StockUrgency stock={product.stock} />}
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-purple-600">
                  ${calculateTotalPrice()}
                </span>
                {product?.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compare_price}
                  </span>
                )}
              </div>

              <ColorPicker
                colors={product?.color_variants || []}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />

              <FontPicker
                fonts={product?.fonts || []}
                selectedFont={selectedFont}
                onFontChange={setSelectedFont}
              />
            </div>

            {/* Gift Options */}
            <GiftOptions onGiftOptionsChange={handleGiftOptionsChange} />

            <Button onClick={handleAddToCart} className="w-full">
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
