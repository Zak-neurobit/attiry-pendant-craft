
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/stores/cart';
import { useFavourites } from '@/stores/favourites';
import { SearchModal } from '@/components/SearchModal';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { items } = useCart();
  const { favourites } = useFavourites();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Check authentication state and admin role
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check if user has admin role in user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        setIsAdmin(!!roleData);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/design-request' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span 
                className="text-2xl text-black" 
                style={{ 
                  fontFamily: '"Great Vibes", cursive',
                  fontSize: '2rem'
                }}
              >
                Attiry
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Favourites */}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/favourites" className="relative">
                  <Heart className="h-5 w-5" />
                  {favourites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favourites.length}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* User Account */}
              <Button variant="ghost" size="icon" asChild>
                <Link to={user ? "/account" : "/auth"}>
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              {/* Admin Button - Only show for admin users */}
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/dashboard')}
                  className="hidden lg:flex"
                >
                  Admin
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200 bg-white">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Mobile Search */}
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="justify-start px-2 sm:hidden"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>

                {/* Mobile Admin Button */}
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigate('/admin/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="justify-start px-2 lg:hidden"
                  >
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
