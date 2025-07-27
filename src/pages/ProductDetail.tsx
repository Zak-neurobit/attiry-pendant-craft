
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, ShoppingBag, Share2, Truck, Shield, RotateCcw, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { ImageZoomModal } from '@/components/ui/image-zoom-modal';
import { useImageZoom } from '@/hooks/useImageZoom';

// Components
import NameInput from '@/components/product/NameInput';
import FontPicker from '@/components/product/FontPicker';
import { ColorPicker } from '@/components/product/ColorPicker';
import ChainPicker from '@/components/product/ChainPicker';
import PreviewName from '@/components/product/PreviewName';
import { GiftWrapOption } from '@/components/product/GiftWrapOption';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';

// Import the products hook
import { useProducts } from '@/hooks/useProducts';

// Custom hook for managing sticky image gallery behavior
const useStickyImageGallery = () => {
  const [isSticky, setIsSticky] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const addToCartSection = document.getElementById('add-to-cart-section');
      if (addToCartSection) {
        const rect = addToCartSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Stop being sticky when Add to Cart section is in viewport
        setIsSticky(rect.top > windowHeight * 0.3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isSticky;
};

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  colors: string[];
  category: string;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const { toast } = useToast();
  const { customization, isValid, reset } = useProductCustomizer();
  const { getProductBySlug, loading: productsLoading } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [quantity] = useState(1);
  
  // Use the sticky image gallery hook
  const isSticky = useStickyImageGallery();

  // Get product data first (before using it in other hooks)
  const product = slug ? getProductBySlug(slug) : null;
  const loading = productsLoading;

  // Image zoom functionality (using product data)
  const { isOpen: isZoomOpen, openZoom, closeZoom } = useImageZoom({
    images: product?.images || [],
    alt: product?.name || 'Product image'
  });

  const isFavourite = product ? favourites.includes(product.id) : false;

  // Image navigation functions
  const nextImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const previousImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleAddToCart = () => {
    if (!product || !isValid()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your pendant",
        variant: "destructive",
      });
      return;
    }

    const finalPrice = product.price + (includeGiftWrap ? 5 : 0);

    addItem({
      productId: product.id,
      title: product.name,
      price: finalPrice,
      originalPrice: product.originalPrice || product.price,
      color: customization.color,
      font: customization.font,
      chain: customization.chain,
      customText: customization.nameText,
      quantity,
      image: product.images[0],
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} with "${customization.nameText}" has been added to your cart`,
    });
  };

  const toggleFavourite = () => {
    if (!product) return;
    
    if (isFavourite) {
      removeFromFavourites(product.id);
      toast({
        title: "Removed from Favourites",
        description: `${product.name} removed from your favourites`,
      });
    } else {
      addToFavourites(product.id);
      toast({
        title: "Added to Favourites",
        description: `${product.name} added to your favourites`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold font-cormorant mb-4">Product Not Found</h1>
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

  const salePrice = product.originalPrice && product.originalPrice > product.price 
    ? product.price 
    : undefined;
  const originalPrice = product.originalPrice && product.originalPrice > product.price 
    ? product.originalPrice 
    : product.price;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={product.name}
        description={product.description || `Custom ${product.name} - Personalized name pendant`}
        image={product.images[0]}
        url={`/product/${product.slug}`}
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

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images - Redesigned with left thumbnails and navigation arrows */}
          <div className="lg:w-1/2">
            <div className={`image-gallery-container ${isSticky ? 'lg:sticky-image-gallery' : ''}`}>
              {/* Desktop Layout: Thumbnails Left + Main Image Right */}
              <div className="hidden md:flex gap-4">
                {/* Thumbnail Column - Left Side */}
                {product.images.length > 1 && (
                  <div className="flex flex-col gap-2 w-20">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                          selectedImage === index ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:border-accent/60'
                        }`}
                      >
                        <button
                          onClick={() => setSelectedImage(index)}
                          className="w-full h-full"
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Image - Right Side */}
                <div className="flex-1">
                  <div 
                    className="aspect-square overflow-hidden rounded-lg border shadow-lg hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer"
                    onClick={() => openZoom(selectedImage)}
                  >
                    <img
                      src={product.images[selectedImage] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        {/* Previous Arrow */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            previousImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 relative z-20"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>

                        {/* Next Arrow */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 relative z-20"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Zoom overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 rounded-full p-3 pointer-events-auto">
                        <ZoomIn className="h-6 w-6 text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout: Main Image Top + Thumbnails Bottom */}
              <div className="md:hidden space-y-4">
                <div 
                  className="aspect-square overflow-hidden rounded-lg border shadow-lg hover:shadow-xl transition-shadow duration-300 relative group cursor-pointer"
                  onClick={() => openZoom(selectedImage)}
                >
                  <img
                    src={product.images[selectedImage] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Navigation Arrows for Mobile */}
                  {product.images.length > 1 && (
                    <>
                      {/* Previous Arrow */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          previousImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 relative z-20"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>

                      {/* Next Arrow */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 relative z-20"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 rounded-full p-3 pointer-events-auto">
                      <ZoomIn className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Thumbnails for Mobile */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                          selectedImage === index ? 'border-accent ring-2 ring-accent/20' : 'border-border hover:border-accent/60'
                        }`}
                      >
                        <button
                          onClick={() => setSelectedImage(index)}
                          className="w-full h-full"
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent text-accent-foreground">Custom Made</Badge>
                {product.isNew && (
                  <Badge variant="secondary">New</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold font-cormorant text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
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

            {/* Add to Cart Section - This acts as the sticky stop point */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              id="add-to-cart-section"
            >
              <Button
                onClick={handleAddToCart}
                className="w-full bg-cta hover:bg-cta/90 text-cta-foreground font-medium py-3"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart - {formatPrice((salePrice || originalPrice) + (includeGiftWrap ? 5 : 0))}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>

            {/* Trust Badges */}
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
      
      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={closeZoom}
        images={product.images || []}
        initialIndex={selectedImage}
        alt={product.name}
      />
    </div>
  );
};

export default ProductDetail;
