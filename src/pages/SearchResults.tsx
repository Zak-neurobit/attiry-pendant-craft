import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_urls: string[];
  color_variants: string[];
}

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchInput, setSearchInput] = useState(query);

  const searchProducts = async (searchQuery: string, sort: string = 'relevance') => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,keywords.cs.{${searchQuery}}`)
        .eq('is_active', true);

      // Apply sorting
      if (sort === 'price_low') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_high') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (data && !error) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProducts(query, sortBy);
  }, [query, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSalePrice = (originalPrice: number) => {
    return originalPrice * 0.75; // 25% discount
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground">
          {part}
        </mark>
      ) : part
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Search Results
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {/* Results Info and Sort */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? 'Searching...' : (
                query ? `${products.length} results for "${query}"` : 'Enter a search term'
              )}
            </p>
            
            {products.length > 0 && (
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4" />
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg">Searching...</div>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No products found</h2>
            <p className="text-muted-foreground mb-8">
              {query ? `We couldn't find any products matching "${query}".` : 'Enter a search term to find products.'}
            </p>
            <Button asChild>
              <Link to="/shop">Browse All Products</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group"
              >
                <Link
                  to={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
                  state={{ product }}
                  className="block"
                >
                  <div className="bg-card rounded-lg shadow-soft overflow-hidden border transition-transform duration-300 group-hover:scale-105">
                    <div className="relative aspect-square">
                      <img
                        src={product.image_urls?.[0] || '/placeholder.svg'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">
                        {highlightText(product.title, query)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {highlightText(product.description || '', query)}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(getSalePrice(product.price))}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          25% OFF
                        </span>
                      </div>

                      {product.color_variants && product.color_variants.length > 0 && (
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="text-xs text-muted-foreground">Colors:</span>
                          <div className="flex space-x-1">
                            {product.color_variants.slice(0, 3).map((color) => (
                              <div
                                key={color}
                                className={`w-4 h-4 rounded-full border border-border ${
                                  color === 'gold' ? 'bg-yellow-400' : 
                                  color === 'rose_gold' ? 'bg-rose-400' : 
                                  'bg-gray-400'
                                }`}
                              />
                            ))}
                            {product.color_variants.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{product.color_variants.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};