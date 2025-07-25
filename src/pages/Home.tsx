
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - extends to top */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/src/assets/hero-pendant.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight">
              Your Name, <br />
              <span className="text-accent">Your Story</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
              Handcrafted name pendants that capture your essence. 
              Premium materials, personalized perfection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg" 
                className="bg-cta hover:bg-cta/90 text-cta-foreground px-8 py-4 text-lg"
              >
                <Link to="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Link to="/design-request">
                  Custom Design
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $50</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Lifetime Warranty</h3>
              <p className="text-sm text-muted-foreground">Against defects</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Handcrafted</h3>
              <p className="text-sm text-muted-foreground">Made with love</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">5-Star Reviews</h3>
              <p className="text-sm text-muted-foreground">1000+ happy customers</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">
              Featured Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular designs, each piece carefully crafted to tell your unique story.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <Card className="group overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src="/src/assets/product-gold.jpg"
                  alt="Gold Collection"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">Gold Collection</h3>
                  <p className="text-sm opacity-90">Timeless elegance</p>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src="/src/assets/product-rose-gold.jpg"
                  alt="Rose Gold Collection"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">Rose Gold Collection</h3>
                  <p className="text-sm opacity-90">Modern romance</p>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="relative overflow-hidden">
                <img
                  src="/src/assets/collection-hero.jpg"
                  alt="Silver Collection"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">Silver Collection</h3>
                  <p className="text-sm opacity-90">Classic sophistication</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground">
              <Link to="/shop">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-background to-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-6">
              Ready to Create Your Perfect Pendant?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who wear their stories with pride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground">
                <Link to="/shop">Start Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/design-request">Custom Design</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
