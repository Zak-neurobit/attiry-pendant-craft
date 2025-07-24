
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';

interface SearchResult {
  id: string;
  title: string;
  price: number;
  image_urls: string[];
  color_variants: string[];
}

interface IntelligentSearchBarProps {
  onProductSelect?: (productId: string) => void;
}

export const IntelligentSearchBar: React.FC<IntelligentSearchBarProps> = ({ onProductSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState(['pendant', 'gold', 'silver', 'necklace']);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, [user]);

  useEffect(() => {
    if (query.length > 2) {
      const debounceTimer = setTimeout(() => {
        searchProducts();
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [query]);

  const loadRecentSearches = async () => {
    if (!user) {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
      return;
    }

    try {
      const { data } = await supabase
        .from('user_behavior')
        .select('recent_searches')
        .eq('user_id', user.id)
        .single();

      if (data?.recent_searches) {
        setRecentSearches(data.recent_searches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 10);
    setRecentSearches(updated);

    if (!user) {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return;
    }

    try {
      await supabase
        .from('user_behavior')
        .upsert({
          user_id: user.id,
          recent_searches: updated,
        });
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const searchProducts = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, image_urls, color_variants')
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, tags.cs.{${query}}`)
        .eq('is_active', true)
        .limit(8);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
    setIsOpen(false);
  };

  const clearRecentSearch = (searchTerm: string) => {
    const updated = recentSearches.filter(s => s !== searchTerm);
    setRecentSearches(updated);
    
    if (!user) {
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
          {query.length > 2 && results.length > 0 && (
            <div className="p-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Products</h4>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onProductSelect?.(product.id)}
                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                >
                  <img
                    src={product.image_urls[0]}
                    alt={product.title}
                    className="w-8 h-8 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{product.title}</div>
                    <div className="text-xs text-gray-500">${product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {query.length <= 2 && (
            <>
              {recentSearches.length > 0 && (
                <div className="p-2 border-b">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Recent Searches
                  </h4>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleSearch(search)}
                    >
                      <span className="text-sm">{search}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearRecentSearch(search);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Popular Searches
                </h4>
                {popularSearches.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="p-2 hover:bg-gray-50 cursor-pointer rounded text-sm"
                  >
                    {search}
                  </div>
                ))}
              </div>
            </>
          )}

          {loading && (
            <div className="p-4 text-center text-sm text-gray-500">
              Searching...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
