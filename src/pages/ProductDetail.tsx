
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCart } from '@/stores/cart';
import { useToast } from '@/hooks/use-toast';
import { useFavourites } from '@/stores/favourites';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LivePreview from '@/components/product/LivePreview';
import NameEngraving from '@/components/product/NameEngraving';
import GiftWrapOption from '@/components/product/GiftWrapOption';
import TrustBadges from '@/components/product/TrustBadges';
import StockAlert from '@/components/product/StockAlert';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[];
  color_variants: string[];
  keywords: string[];
  sku: string;
}

const colorNames: Record<string, string> = {
  gold: 'Gold Plated',
  matte_gold: 'Matte Gold',
  rose_gold: 'Rose Gold',
  silver: 'Silver',
  matte_silver: 'Matte Silver',
  vintage_copper: 'Vintage Copper',
  black: 'Black',
};

const fontOptions = [
  { value: 'Great Vibes', label: 'Great Vibes' },
  { value: 'Allura', label: 'Allura' },
  { value: 'Alex Brush', label: 'Alex Brush' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Playfair Display', label: 'Playfair Display' },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

const getSalePrice = (originalPrice: number) => {
  return originalPrice * 0.75; // 25% off
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { toast } = useToast();
  const { isFavourite, addToFavourites, removeFromFavourites } = useFavourites();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('Great Vibes');
  const [engravingName, setEngravingName] = useState<string>('');
  const [includeGiftWrap, setIncludeGiftWrap] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      setProduct(data);
      
      if (data.color_variants && data.color_variants.length > 0) {
        setSelectedColor(data.color_variants[0]);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEngravingName = (name: string) => {
    if (name.length === 0) {
      setNameError('Please enter a name to engrave');
      return false;
    }
    if (name.length > 12) {
      setNameError('Name must be 12 characters or less');
      return false;
    }
    if (!/^[A-Za-z ]*$/.test(name)) {
      setNameError('Only letters and spaces allowed');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleEngravingNameChange = (value: string) => {
    setEngravingName(value);
    if (value.length > 0) {
      validateEngravingName(value);
    } else {
      setNameError('');
    }
  };

  const isProductFavourite = product ? isFavourite(product.id) : false;

  const handleFavoriteClick = async () => {
    if (!product) return;
    
    try {
      if (isProductFavourite) {
        await removeFromFavourites(product.id);
        toast({
          title: "Removed from favorites",
          description: `${product.title} has been removed from your favorites.`,
        });
      } else {
        await addToFavourites(product.id);
        toast({
          title: "Added to favorites",
          description: `${product.title} has been added to your favorites.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath).data.publicUrl;
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const basePrice = getSalePrice(product.price);
    const giftWrapPrice = includeGiftWrap ? 5 : 0;
    return basePrice + giftWrapPrice;
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!validateEngravingName(engravingName)) {
      return;
    }

    const cartItem = {
      productId: product.id,
      title: product.title,
      price: calculateTotalPrice(),
      originalPrice: product.price,
      color: selectedColor,
      font: selectedFont,
      customText: engravingName,
      giftWrap: includeGiftWrap,
      quantity: 1,
      image: product.image_urls[currentImageIndex],
    };

    addItem(cartItem);
    openCart();

    toast({
      title: 'Added to cart!',
      description: `${product.title} with "${engravingName}" has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const originalPrice = product.price;
  const salePrice = getSalePrice(originalPrice);
  const savings = originalPrice - salePrice;
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/shop')}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={getImageUrl(product.image_urls[currentImageIndex])}
                  alt={`${product.title} - ${colorNames[selectedColor]}`}
                  className="w-full h-96 lg:h-[500px] object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </AnimatePresence>
              <div className="absolute top-4 left-4">
                <Badge className="bg-accent text-accent-foreground font-medium">
                  25% OFF
                </Badge>
              </div>
              <motion.button
                onClick={handleFavoriteClick}
                className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isProductFavourite
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground hover:text-red-500'
                  }`}
                />
              </motion.button>
            </div>

            {/* Color Variants */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Color Finish</Label>
              <RadioGroup
                value={selectedColor}
                onValueChange={(value) => {
                  setSelectedColor(value);
                  const colorIndex = product.color_variants.indexOf(value);
                  if (colorIndex !== -1) {
                    setCurrentImageIndex(colorIndex);
                  }
                }}
                className="flex flex-wrap gap-3"
              >
                {product.color_variants.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={color}
                      id={color}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={color}
                      className={`cursor-pointer flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                        selectedColor === color
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border border-border ${
                          color === 'gold'
                            ? 'bg-yellow-400'
                            : color === 'rose_gold'
                            ? 'bg-rose-400'
                            : color === 'silver'
                            ? 'bg-gray-300'
                            : color === 'matte_gold'
                            ? 'bg-yellow-600'
                            : color === 'matte_silver'
                            ? 'bg-gray-400'
                            : color === 'vintage_copper'
                            ? 'bg-orange-600'
                            : 'bg-gray-800'
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {colorNames[color]}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-heading text-foreground mb-3">
                {product.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Alert */}
            <StockAlert stock={product.stock} />

            {/* Price Section */}
            <Card className="border border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-semibold text-foreground">
                      {formatPrice(totalPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Save {formatPrice(savings)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      (25% off original price)
                    </span>
                  </div>
                  {includeGiftWrap && (
                    <p className="text-sm text-muted-foreground">
                      Includes gift-wrap (+$5)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Font Selection */}
            <div className="space-y-3">
              <Label htmlFor="font-select" className="text-sm font-medium">
                Font Style
              </Label>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger id="font-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Name Engraving */}
            <NameEngraving
              value={engravingName}
              onChange={handleEngravingNameChange}
              error={nameError}
            />

            {/* Live Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Preview</Label>
              <LivePreview
                text={engravingName}
                font={selectedFont}
                color={selectedColor}
              />
            </div>

            {/* Gift Wrap Option */}
            <GiftWrapOption
              checked={includeGiftWrap}
              onChange={setIncludeGiftWrap}
            />

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full"
              disabled={!engravingName || !!nameError || product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ${formatPrice(totalPrice)}`}
            </Button>

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
