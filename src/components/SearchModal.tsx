import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_urls: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price, image_urls')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,keywords.cs.{${searchQuery}}`)
        .eq('is_active', true)
        .limit(5);

      if (data && !error) {
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === -1 || selectedIndex === suggestions.length) {
        // Navigate to search results
        navigate(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      } else if (suggestions[selectedIndex]) {
        // Navigate to product
        const product = suggestions[selectedIndex];
        const slug = product.title.toLowerCase().replace(/\s+/g, '-');
        navigate(`/product/${slug}`, { state: { product } });
        onClose();
      }
    }
  };

  const handleSuggestionClick = (product: Product) => {
    const slug = product.title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/product/${slug}`, { state: { product } });
    onClose();
  };

  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const modalVariants = {
    closed: { opacity: 0, scale: 0.95, y: -20 },
    open: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-background border rounded-lg shadow-lg z-50 mx-4"
          >
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 focus-visible:ring-0 text-lg"
                  role="search"
                  aria-label="Search products"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {(suggestions.length > 0 || isLoading) && (
              <ScrollArea className="max-h-96">
                <div className="p-2">
                  {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : (
                    <>
                      {suggestions.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                            selectedIndex === index ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                          onClick={() => handleSuggestionClick(product)}
                        >
                          <img
                            src={product.image_urls?.[0] || '/placeholder.svg'}
                            alt={product.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-1">
                              {product.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            {formatPrice(product.price * 0.75)}
                          </div>
                        </motion.div>
                      ))}
                      
                      {query.trim() && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors border-t ${
                            selectedIndex === suggestions.length ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                          onClick={handleViewAllResults}
                        >
                          <span className="text-sm font-medium">
                            See all results for "{query}"
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            )}

            {!isLoading && query.trim() && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No products found for "{query}"</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};