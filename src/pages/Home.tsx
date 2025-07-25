
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { Star, Shield, Truck, HeartHandshake } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { RecentlyViewed } from '@/components/personalization/RecentlyViewed';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const Home = () => {
  const { products, loading } = useProducts();

  // Get featured products (first 4 from database)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20 pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-foreground mb-6 leading-tight">
                Custom Name
                <span className="block text-accent">Pendants</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Handcrafted jewelry that tells your story. Each piece is uniquely designed 
                and expertly crafted just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/shop">
                  <Button size="lg" className="w-full sm:w-auto bg-cta-bg hover:bg-cta-bg/90 text-white font-semibold px-8 py-4 text-lg">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-4 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square">
                <img
                  src="/src/assets/hero-pendant.jpg"
                  alt="Custom Name Pendant"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-accent text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  Handcrafted
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={staggerItem} className="text-center">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Lifetime Warranty</h3>
              <p className="text-muted-foreground">Every piece comes with our lifetime craftsmanship guarantee</p>
            </motion.div>
            
            <motion.div variants={staggerItem} className="text-center">
              <Truck className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Complimentary worldwide shipping on all orders</p>
            </motion.div>
            
            <motion.div variants={staggerItem} className="text-center">
              <HeartHandshake className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Personal Service</h3>
              <p className="text-muted-foreground">Dedicated support throughout your custom design journey</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular custom name pendants, each uniquely crafted with premium materials
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={staggerItem}>
                  <Card className="overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-64 bg-gray-300"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="text-center">
            <Link to="/shop">
              <Button variant="outline" size="lg" className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-4">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-r from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Loved by Customers Worldwide
            </h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-lg font-semibold ml-2">4.9/5 from 2,847 reviews</span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                text: "Absolutely beautiful craftsmanship! My custom pendant exceeded all expectations.",
                author: "Sarah M.",
                rating: 5
              },
              {
                text: "The attention to detail is incredible. This will be a treasured family heirloom.",
                author: "Michael R.",
                rating: 5
              },
              {
                text: "Fast shipping and amazing quality. The personalization was perfect!",
                author: "Emma L.",
                rating: 5
              }
            ].map((review, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="p-6 h-full">
                  <CardContent className="p-0">
                    <div className="flex mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{review.text}"</p>
                    <p className="font-semibold text-foreground">- {review.author}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
