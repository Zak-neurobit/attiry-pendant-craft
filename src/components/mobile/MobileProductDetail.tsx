
import { motion } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';
import { Button } from '@/components/ui/button';

interface MobileProductDetailProps {
  product: any;
  onAddToCart: () => void;
  isValid: boolean;
  totalPrice: number;
}

export const MobileProductDetail = ({ product, onAddToCart, isValid, totalPrice }: MobileProductDetailProps) => {
  const { customization } = useProductCustomizer();

  return (
    <div className="lg:hidden" id="mobile-product-detail">
      {/* Mobile-optimized sticky bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50" id="mobile-sticky-bottom">
        <div className="flex items-center justify-between mb-3" id="mobile-price-section">
          <div>
            <div className="text-lg font-semibold" id="mobile-price-text">
              ${totalPrice.toFixed(2)} USD
            </div>
            {customization.nameText && (
              <div className="text-sm text-muted-foreground" id="mobile-custom-text">
                Custom: "{customization.nameText}"
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={onAddToCart}
          disabled={!isValid}
          className="w-full"
          size="lg"
          id="mobile-add-to-cart-button"
        >
          Add to Cart
        </Button>
        
        {!isValid && (
          <p className="text-xs text-muted-foreground text-center mt-2" id="mobile-validation-message">
            Please enter a valid name (1-12 characters)
          </p>
        )}
      </div>
      
      {/* Add bottom padding to prevent content from being hidden behind sticky section */}
      <div className="h-32" id="mobile-bottom-spacer"></div>
    </div>
  );
};
