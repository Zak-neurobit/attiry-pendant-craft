
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Product } from '@/lib/products';

export const Shop = () => {
  const { products, loading, error } = useSupabaseProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Convert Supabase product to Product interface
  const convertToProduct = (supabaseProduct: any): Product => ({
    id: supabaseProduct.id,
    slug: supabaseProduct.slug || `product-${supabaseProduct.id}`,
    name: supabaseProduct.title,
    price: supabaseProduct.price,
    originalPrice: supabaseProduct.compare_price > 0 ? supabaseProduct.compare_price : undefined,
    description: supabaseProduct.description || '',
    images: supabaseProduct.image_urls || ['/placeholder.svg'],
    rating: supabaseProduct.rating || 5,
    reviewCount: supabaseProduct.review_count || 0,
    colors: supabaseProduct.color_variants || ['gold', 'rose-gold', 'silver'],
    category: supabaseProduct.category || 'custom',
    isNew: new Date(supabaseProduct.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  });

  useEffect(() => {
    if (products) {
      let filtered = products.map(convertToProduct);

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort products
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          // Already sorted by created_at desc from the query
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [products, searchQuery, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error loading products</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Collection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our beautiful collection of personalized jewelry pieces
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center bg-card rounded-lg p-8 shadow-soft"
        >
          <h2 className="text-2xl font-serif font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-6">
            Let us create a custom piece just for you. Our skilled artisans can bring your vision to life.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90">
            Request Custom Design
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
