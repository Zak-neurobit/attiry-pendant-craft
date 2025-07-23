import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Star, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FontPicker from '@/components/product/FontPicker';
import NameInput from '@/components/product/NameInput';
import PreviewName from '@/components/product/PreviewName';
import ColorPicker from '@/components/product/ColorPicker';
import { getProduct } from '@/lib/products';
import { useProductCustomizer } from '@/stores/productCustomizer';
import { useCartStore } from '@/stores/cart';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const product = slug ? getProduct(slug) : null;
  const { customization, reset, isValid } = useProductCustomizer();
  const { addItem } = useCartStore();

  useEffect(() => {
    // Reset customization when entering a new product
    reset();
  }, [slug, reset]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-playfair font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <Button onClick={() => navigate('/shop')} variant="outline">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isValid()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name (1-12 characters, letters and spaces only)",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      customization: {
        font: customization.font,
        color: customization.color,
        nameText: customization.nameText,
      },
    });

    toast({
      title: "Added to cart!",
      description: `${product.name} with "${customization.nameText}" has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info & Customization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Product Info */}
            <div>
              {product.isNew && (
                <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
                  New
                </span>
              )}
              
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < product.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
                      25% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Customization Options */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-playfair font-semibold text-foreground mb-6">
                Customize Your Pendant
              </h2>
              
              <FontPicker />
              <NameInput />
              <PreviewName />
              <ColorPicker />

              {/* Add to Cart */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isValid()}
                  className="flex-1 btn-cta"
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart - ${product.price.toFixed(2)}
                </Button>
                <Button variant="outline" size="lg" className="btn-outline-luxury">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;