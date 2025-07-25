
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, ShoppingBag, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/stores/cart';
import { useFavourites } from '@/stores/favourites';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';
import { useProductCustomizer } from '@/stores/productCustomizer';
import { supabase } from '@/integrations/supabase/client';

// Components
import NameInput from '@/components/product/NameInput';
import FontPicker from '@/components/product/FontPicker';
import { ColorPicker } from '@/components/product/ColorPicker';
import ChainPicker from '@/components/product/ChainPicker';
import PreviewName from '@/components/product/PreviewName';
import { GiftWrapOption } from '@/components/product/GiftWrapOption';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { TrustBadges } from '@/components/conversion/TrustBadges';

interface Product {
  id: string;
  title: string;
  price: number;
  compare_price?: number;
  description?: string;
  image_urls?: string[];
  color_variants?: string[];
  tags?: string[];
  stock: number;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const { toast } = useToast();
  const { customization, isValid, reset } = useProductCustomizer();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [quantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        // Convert slug back to title format for searching
        const searchTitle = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('title', `%${searchTitle}%`)
          .eq('is_active', true)
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error('Error in fetchProduct:', err);
        setProduct(null);
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  const isFavourite = product ? favourites.includes(product.id) : false;

  const handleAddToCart = () => {
    if (!product || !isValid()) {
      toast({
        title: "Name Required",
        description: "Please enter a valid name for your pendant (1-12 characters, letters only)",
        variant: "destructive",
      });
      return;
    }

    const finalPrice = Number(product.price) + (includeGiftWrap ? 5 : 0);

    addItem({
      productId: product.id,
      title: product.title,
      price: finalPrice,
      originalPrice: product.compare_price ? Number(product.compare_price) : Number(product.price),
      color: customization.color,
      font: customization.font,
      chain: customization.chain,
      customText: customization.nameText,
      quantity,
      image: product.image_urls?.[0] || '/placeholder.svg',
    });

    toast({
      title: "Added to Cart",
      description: `${product.title} with "${customization.nameText}" has been added to your cart`,
    });
  };

  const toggleFavourite = () => {
    if (!product) return;
    
    if (isFavourite) {
      removeFromFavourites(product.id);
      toast({
        title: "Removed from Favourites",
        description: `${product.title} removed from your favourites`,
      });
    } else {
      addToFavourites(product.id);
      toast({
        title: "Added to Favourites",
        description: `${product.title} added to your favourites`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const salePrice = product.compare_price && Number(product.compare_price) > Number(product.price) 
    ? Number(product.price)
    : undefined;
  const originalPrice = product.compare_price && Number(product.compare_price) > Number(product.price) 
    ? Number(product.compare_price)
    : Number(product.price);

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEOHead
        title={product.title}
        description={product.description || `Custom ${product.title} - Personalized name pendant`}
        image={product.image_urls?.[0] || '/placeholder.svg'}
        url={`/product/${slug}`}
        type="product"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.image_urls?.[selectedImage] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {product.image_urls && product.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent text-accent-foreground">Custom Made</Badge>
                {product.tags?.includes('trending') && (
                  <Badge variant="secondary">New</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (124 reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(salePrice || originalPrice)}
                  </span>
                  {salePrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavourite}
                  className="hover:bg-muted"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavourite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Separator />

            {/* Customization Options */}
            <div className="space-y-6">
              <NameInput />
              
              <PreviewName />
              
              <FontPicker />
              
              <ColorPicker />
              
              <ChainPicker />
              
              <GiftWrapOption 
                checked={includeGiftWrap} 
                onCheckedChange={setIncludeGiftWrap} 
              />
            </div>

            <Separator />

            {/* Add to Cart */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleAddToCart}
                className="w-full bg-cta hover:bg-cta/90 text-cta-foreground font-medium py-3"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ${formatPrice((salePrice || originalPrice) + (includeGiftWrap ? 5 : 0))}`}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-accent" />
                      <div>
                        <h4 className="font-medium">Free Shipping</h4>
                        <p className="text-sm text-muted-foreground">On orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-accent" />
                      <div>
                        <h4 className="font-medium">Lifetime Warranty</h4>
                        <p className="text-sm text-muted-foreground">Against manufacturing defects</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-5 w-5 text-accent" />
                      <div>
                        <h4 className="font-medium">30-Day Returns</h4>
                        <p className="text-sm text-muted-foreground">Easy returns & exchanges</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Processing Time</h4>
                      <p className="text-sm text-muted-foreground">
                        Custom pendants are made to order and typically ship within 3-5 business days.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Shipping Options</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Standard Shipping (5-7 days): Free on orders over $50</li>
                        <li>• Express Shipping (2-3 days): $15</li>
                        <li>• Overnight Shipping (1 day): $25</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <ReviewsSection productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
