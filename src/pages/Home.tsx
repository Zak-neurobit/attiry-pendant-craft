
import { useState, useEffect } from 'react';
import { ChevronRight, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/products';
import heroImage from '@/assets/hero-pendant.jpg';
import collectionImage from '@/assets/collection-hero.jpg';
import productGold from '@/assets/product-gold.jpg';
import productRoseGold from '@/assets/product-rose-gold.jpg';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredProducts: Product[] = [
    {
      id: '1',
      slug: 'custom-gold-name-pendant',
      name: 'Custom Gold Name Pendant',
      price: 74.99,
      originalPrice: 99.99,
      description: 'Elegant gold-plated pendant with custom name engraving.',
      images: [productGold],
      rating: 5,
      reviewCount: 124,
      isNew: true,
      colors: ['gold', 'rose-gold', 'silver'],
      category: 'gold'
    },
    {
      id: '2',
      slug: 'rose-gold-script-pendant',
      name: 'Rose Gold Script Pendant',
      price: 69.99,
      originalPrice: 92.99,
      description: 'Beautiful rose gold pendant featuring elegant script lettering.',
      images: [productRoseGold],
      rating: 5,
      reviewCount: 89,
      colors: ['rose-gold', 'gold', 'silver'],
      category: 'rose-gold'
    },
    {
      id: '3',
      slug: 'classic-silver-nameplate',
      name: 'Classic Silver Nameplate',
      price: 59.99,
      originalPrice: 79.99,
      description: 'Timeless sterling silver nameplate with precision engraving.',
      images: [productGold],
      rating: 5,
      reviewCount: 156,
      colors: ['silver', 'gold', 'copper'],
      category: 'silver'
    },
    {
      id: '4',
      slug: 'vintage-copper-pendant',
      name: 'Vintage Copper Pendant',
      price: 64.99,
      originalPrice: 86.99,
      description: 'Unique copper finish pendant with vintage styling.',
      images: [productRoseGold],
      rating: 5,
      reviewCount: 67,
      colors: ['copper', 'gold', 'silver'],
      category: 'copper'
    }
  ];

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
          />
          <div className="absolute inset-0 bg-background/20" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="fade-in">
              <h1 className="text-5xl md:text-7xl font-source-serif font-bold text-foreground mb-6 leading-tight">
                Luxury Custom Name Pendants
                <span className="block text-accent">& Personalized Jewelry</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Handcrafted personalized jewelry for couples and loved ones. 
                Each piece tells your unique story with premium materials and precision craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-cta text-lg px-8 py-4">
                  <Link to="/shop">
                    Shop Collection
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-outline-luxury text-lg px-8 py-4">
                  <Link to="/about">
                    Our Story
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
            </div>
            <Button asChild variant="outline" className="btn-outline-luxury hidden md:flex">
              <Link to="/shop">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
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

export default Home;
