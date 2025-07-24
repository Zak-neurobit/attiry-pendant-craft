
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/stores/cart';
import { useToast } from '@/hooks/use-toast';
import { useFavourites } from '@/stores/favourites';
import { ShoppingCart, ArrowLeft, Clock, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
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
  { value: 'Great Vibes', label: 'Great Vibes', className: 'font-greatvibes' },
  { value: 'Allura', label: 'Allura', className: 'font-allura' },
  { value: 'Alex Brush', label: 'Alex Brush', className: 'font-alexbrush' },
  { value: 'Dancing Script', label: 'Dancing Script', className: 'font-dancingscript' },
  { value: 'Playfair Display', label: 'Playfair Display', className: 'font-playfair-italic' },
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
  const [selectedFont, setSelectedFont] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textError, setTextError] = useState<string>('');

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      
      // Try to find product by converting slug back to title
      const productTitle = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .ilike('title', `%${productTitle}%`)
        .single();

      if (error) throw error;

      setProduct(data);
      
      if (data.color_variants && data.color_variants.length > 0) {
        setSelectedColor(data.color_variants[0]);
      }
      
      if (fontOptions.length > 0) {
        setSelectedFont(fontOptions[0].value);
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

  const validateCustomText = (text: string) => {
    const nameRegex = /^[A-Za-z ]{0,12}$/;
    if (text.length === 0) {
      setTextError('Please enter a name');
      return false;
    }
    if (!nameRegex.test(text)) {
      setTextError('Only letters and spaces allowed (max 12 characters)');
      return false;
    }
    setTextError('');
    return true;
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    if (text.length > 0) {
      validateCustomText(text);
    } else {
      setTextError('');
    }
  };

  const getFontClass = (fontValue: string) => {
    const font = fontOptions.find(f => f.value === fontValue);
    return font ? font.className : 'font-greatvibes';
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!validateCustomText(customText)) {
      return;
    }

    const cartItem = {
      productId: product.id,
      title: product.title,
      price: getSalePrice(product.price),
      originalPrice: product.price,
      color: selectedColor,
      font: selectedFont,
      customText,
      quantity: 1,
      image: product.image_urls[currentImageIndex],
    };

    addItem(cartItem);
    openCart();

    toast({
      title: 'Added to cart!',
      description: `${product.title} with "${customText}" has been added to your cart.`,
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
                  src={product.image_urls[currentImageIndex]}
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

            {/* Price Section */}
            <Card className="border border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(salePrice)}
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
                      <span className={font.className}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Text Input */}
            <div className="space-y-3">
              <Label htmlFor="custom-text" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="custom-text"
                placeholder="Type the name (max 12 chars)"
                value={customText}
                onChange={handleCustomTextChange}
                maxLength={12}
                className={textError ? 'border-destructive' : ''}
                aria-describedby={textError ? 'text-error' : undefined}
              />
              {textError && (
                <p id="text-error" className="text-sm text-destructive">
                  {textError}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {customText.length}/12 characters • Only letters and spaces allowed
              </p>
            </div>

            {/* Font Preview */}
            {customText && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preview</Label>
                <Card className="border border-muted bg-muted/30">
                  <CardContent className="p-6 flex items-center justify-center min-h-[100px]">
                    <motion.div
                      key={`${customText}-${selectedFont}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`${getFontClass(selectedFont)} text-foreground text-center`}
                      style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        lineHeight: '1.2'
                      }}
                    >
                      {customText}
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full"
              disabled={!customText || !!textError}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - {formatPrice(salePrice)}
            </Button>

            {/* Upsell Strip */}
            <Card className="border border-muted bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      Need it in a hurry?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Next-day dispatch available for urgent orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
