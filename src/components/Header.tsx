import { useState } from 'react';
import { Heart, Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-playfair font-bold text-foreground">
              Attiry
            </div>
            <div className="hidden sm:block text-xs text-muted-foreground uppercase tracking-widest">
              Custom Pendants
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
            <Link to="/blog" className="text-foreground hover:text-accent transition-colors">
              Blog
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
            </button>
            <Link 
              to="/cart" 
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Link>
            <Link to="/account" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <User className="h-5 w-5" />
            </Link>
            
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
              <Link 
                to="/blog" 
                className="text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="flex items-center space-x-4 pt-4">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;