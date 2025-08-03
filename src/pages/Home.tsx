import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { ChevronRight, Star, Quote, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SimpleProductCard } from '@/components/SimpleProductCard';
import { CurrencyIndicator } from '@/components/CurrencyIndicator';
import { useProducts } from '@/hooks/useProducts';
import { getHomepageReviews } from '@/lib/reviews';
import heroImage from '@/assets/hero-pendant.jpg';
import collectionImage from '@/assets/collection-hero.jpg';
import precisionCraftsmanshipImage from '@/assets/precision-craftsmanship.webp';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Get products from database with current prices
  const { products, loading } = useProducts();
  
  // Get featured products with current database prices
  const featuredProducts = useMemo(() => {
    // Featured products based on your database: Aria, Habibi, Yasmeen, Zara
    const featuredIds = [
      'd3484f2c-4bea-49f8-9b59-c8cd38131042', // Aria
      '04567b3e-e294-4763-9e9a-a40e414bf361', // Habibi
      '3c3f0913-6944-4841-b078-d70d7c097f97', // Yasmeen
      'c06ce985-be8d-4470-a286-8049bc2b9387'  // Zara
    ];
    
    return featuredIds
      .map(id => products.find(product => product.id === id))
      .filter(Boolean)
      .slice(0, 4); // Limit to 4 featured products
  }, [products]);
  
  // Get random reviews for the homepage showcase
  const homepageReviews = getHomepageReviews(16);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkScrollButtons = () => {
    if (reviewsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reviewsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 350; // Width of one review card plus gap
      const newScrollLeft = direction === 'left' 
        ? reviewsScrollRef.current.scrollLeft - scrollAmount
        : reviewsScrollRef.current.scrollLeft + scrollAmount;
      
      reviewsScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const scrollContainer = reviewsScrollRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons);
    }
  }, [homepageReviews]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src={heroImage} 
            alt="Luxury Custom Name Pendant - Personalized Jewelry"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/20" />
        </div>

        <div className="absolute top-6 left-6 z-20">
          <CurrencyIndicator variant="compact" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="fade-in">
              <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-foreground mb-6 leading-tight">
                Custom Name
                <span className="block text-accent">Pendants</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Handcrafted jewelry that tells your story. Personalize your style with our premium custom name pendants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-cta text-lg px-8 py-4">
                  <Link to="/shop">
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-outline-luxury text-lg px-8 py-4">
                  <Link to="/about">
                    Explore Collection
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-source-serif font-bold text-foreground mb-4">
                Top Offers
              </h2>
              <p className="text-muted-foreground">
                Limited time birthday sale - 25% off everything
              </p>
            </div>
            <Button asChild variant="outline" className="btn-outline-luxury hidden md:flex">
              <Link to="/shop">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg h-96"
                />
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <SimpleProductCard product={product} priority={index < 2} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Personalized Jewelry */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-source-serif font-bold text-foreground mb-4">
              Why Choose Personalized Jewelry?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Perfect gifts for every occasion - birthdays, anniversaries, and special moments
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Premium Materials</h3>
              <p className="text-muted-foreground">14k Gold, Sterling Silver, and Rose Gold finishes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Handcrafted with Love</h3>
              <p className="text-muted-foreground">Each piece is carefully crafted by master jewelers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Perfect Gifts</h3>
              <p className="text-muted-foreground">Ideal for couples, anniversaries, and special occasions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-20 bg-gradient-to-br from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="text-4xl font-source-serif font-bold text-foreground mb-6">
                Handcrafted with
                <span className="block text-accent">Precision</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Every pendant is meticulously crafted using premium materials and 
                cutting-edge personalization technology. Your name, your style, your story.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-foreground">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Premium materials (14k Gold, Sterling Silver)
                </li>
                <li className="flex items-center text-foreground">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Precision laser engraving
                </li>
                <li className="flex items-center text-foreground">
                  <span className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Lifetime craftsmanship guarantee
                </li>
              </ul>
              <Button asChild className="btn-cta">
                <Link to="/about">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="slide-up">
              <img 
                src={precisionCraftsmanshipImage} 
                alt="Ultra-realistic jewelry stud showing precision craftsmanship and attention to detail"
                className="w-full rounded-2xl shadow-luxury"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-source-serif font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">
              Join thousands of satisfied customers who love their custom pendants
            </p>
          </div>

          {/* Interactive side-scrolling reviews showcase */}
          <div className="relative">
            {/* Navigation buttons */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollReviews('left')}
                disabled={!canScrollLeft}
                className={`rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95 transition-all duration-200 ${
                  canScrollLeft ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollReviews('right')}
                disabled={!canScrollRight}
                className={`rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/95 transition-all duration-200 ${
                  canScrollRight ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable reviews container */}
            <div 
              ref={reviewsScrollRef}
              className="overflow-x-auto pb-4 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex gap-6 px-12" style={{ width: 'max-content' }}>
                {homepageReviews.map((review) => (
                  <div 
                    key={review.id}
                    className="card-luxury p-6 min-w-[320px] max-w-[320px] text-left hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 transition-colors ${
                            star <= review.rating
                              ? 'fill-accent text-accent' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-accent mb-3 opacity-75" />
                    <p className="text-muted-foreground mb-4 italic line-clamp-3 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                    {(review.customText || review.color) && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {review.customText && (
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
                            "{review.customText}"
                          </span>
                        )}
                        {review.color && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs capitalize">
                            {review.color.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={review.userImage} 
                          alt={review.userName}
                          className={`w-10 h-10 rounded-full ${
                            review.userImage.startsWith('data:image/svg+xml') 
                              ? '' 
                              : 'object-cover ring-2 ring-gray-100'
                          }`}
                        />
                        {review.verified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-foreground block text-sm">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <span className="text-xs text-green-600 font-medium">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* View all reviews button */}
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="btn-outline-luxury">
              <Link to="/shop">
                View All Products & Reviews
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;