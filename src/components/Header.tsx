
import { useState, useEffect } from 'react';
import { Heart, Search, ShoppingBag, User, Menu, X, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { useAuth } from '@/stores/auth';
import { SearchModal } from '@/components/SearchModal';

const Header = () => {
  const { getTotalItems, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="text-center py-2 text-sm text-muted-foreground border-b border-border/50">
          🎉 BIRTHDAY SALE! Flat 25% Off On ALL PRODUCTS! Use code: BIRTHDAY25
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <div className="text-4xl font-great-vibes text-foreground leading-none">
                Attiry
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest">
                Custom Pendants
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-foreground hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-foreground hover:text-accent transition-colors">
              About
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-foreground hover:text-accent transition-colors flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link 
              to="/favourites" 
              className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block"
              aria-label="View favourites"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <button 
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button 
              onClick={handleProfileClick}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label={user ? "Go to account" : "Sign in"}
            >
              <User className="h-5 w-5" />
            </button>
            
            {/* Mobile menu toggle */}
            <button 
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-foreground hover:text-accent transition-colors py-2 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="flex items-center space-x-4 pt-4">
                <button 
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search products"
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link 
                  to="/favourites" 
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="View favourites"
                >
                  <Heart className="h-5 w-5" />
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
