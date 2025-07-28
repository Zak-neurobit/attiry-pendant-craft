import { useState, useEffect } from 'react';
import { ChevronRight, Star, Quote, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SimpleProductCard } from '@/components/SimpleProductCard';
import { CurrencyIndicator } from '@/components/CurrencyIndicator';
import heroImage from '@/assets/hero-pendant.jpg';
import collectionImage from '@/assets/collection-hero.jpg';
import productGold from '@/assets/product-gold.jpg';
import productRoseGold from '@/assets/product-rose-gold.jpg';

// STATIC PRODUCTS - NO DATABASE CALLS AT ALL
const STATIC_PRODUCTS = [
  {
    id: 'static-1',
    slug: 'aria-name-pendant',
    name: 'Aria Name Pendant',
    price: 299.99,
    originalPrice: 399.99,
    description: 'Elegantly crafted Aria name pendant featuring flowing, graceful letterforms.',
    images: [productGold],
    rating: 5,
    reviewCount: 150,
    isNew: false,
    colors: ['gold', 'silver', 'rose-gold'],
    category: 'custom-pendants',
    stock: 50,
    sku: 'ARI-001'
  },
  {
    id: 'static-2',
    slug: 'habibi-arabic-pendant',
    name: 'Habibi Arabic Name Pendant',
    price: 349.99,
    originalPrice: 449.99,
    description: 'Experience the beauty of Arabic calligraphy with our exquisite Habibi name pendant.',
    images: [productRoseGold],
    rating: 5,
    reviewCount: 125,
    isNew: true,
    colors: ['silver', 'rose-gold'],
    category: 'custom-pendants',
    stock: 40,
    sku: 'HAB-003'
  },
  {
    id: 'static-3',
    slug: 'elena-pendant',
    name: 'Elena Name Pendant',
    price: 279.99,
    description: 'Beautiful Elena name pendant with elegant script styling.',
    images: [productGold],
    rating: 5,
    reviewCount: 200,
    isNew: false,
    colors: ['gold', 'silver'],
    category: 'custom-pendants',
    stock: 30,
    sku: 'ELE-001'
  },
  {
    id: 'static-4',
    slug: 'zara-pendant',
    name: 'Zara Name Pendant',
    price: 299.99,
    description: 'Stylish Zara name pendant perfect for everyday wear.',
    images: [productRoseGold],
    rating: 5,
    reviewCount: 180,
    isNew: false,
    colors: ['rose-gold', 'gold'],
    category: 'custom-pendants',
    stock: 45,
    sku: 'ZAR-001'
  }
];

const HomeStatic = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Log to console for debugging
  useEffect(() => {
    console.log('🏠 STATIC HOME: Component mounted');
    console.log('🏠 STATIC HOME: Products count:', STATIC_PRODUCTS.length);
    console.log('🏠 STATIC HOME: Products:', STATIC_PRODUCTS);
  }, []);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Absolutely stunning quality! My custom pendant exceeded all expectations.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=64&h=64&fit=crop&crop=face'
    },
    {
      name: 'Emily Chen',
      text: 'Perfect gift for my daughter. The craftsmanship is incredible.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    },
    {
      name: 'Maria Rodriguez',
      text: 'Fast shipping and beautiful packaging. Highly recommend!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Parallax Background */}
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

        {/* Currency Indicator */}
        <div className="absolute top-6 left-6 z-20">
          <CurrencyIndicator variant="compact" />
        </div>

        {/* Hero Content */}
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

        {/* Scroll Indicator */}
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
              <p className="text-xs text-green-600 mt-2">
                ✅ STATIC MODE - No database calls | Products: {STATIC_PRODUCTS.length}
              </p>
            </div>
            <Button asChild variant="outline" className="btn-outline-luxury hidden md:flex">
              <Link to="/shop">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Products Grid - NO LOADING STATE, DIRECT RENDER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_PRODUCTS.map((product, index) => {
              console.log(`🎯 STATIC: Rendering product ${index + 1}: ${product.name}`);
              return (
                <div 
                  key={product.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <SimpleProductCard product={product} priority={index < 2} />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
              <p className="text-green-700 font-medium">
                ✅ Static Mode Active - No Network Calls
              </p>
              <p className="text-green-600 text-sm">
                If you see these products, rendering works! Database integration can be fixed separately.
              </p>
            </div>
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
                src={collectionImage} 
                alt="Luxury pendant collection - Custom jewelry craftsmanship"
                className="w-full rounded-2xl shadow-luxury"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="card-luxury p-6 text-center fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Quote className="h-8 w-8 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-foreground">
                    {testimonial.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeStatic;