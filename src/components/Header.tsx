
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, Menu, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/stores/cart';
import { useFavourites } from '@/stores/favourites';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Header = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { favourites } = useFavourites();
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const Navigation = ({ mobile = false }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-4' : 'hidden md:flex space-x-8'}`}>
      <Link 
        to="/" 
        className="text-foreground hover:text-accent transition-colors"
      >
        Home
      </Link>
      <Link 
        to="/shop" 
        className="text-foreground hover:text-accent transition-colors"
      >
        Shop
      </Link>
      <Link 
        to="/about" 
        className="text-foreground hover:text-accent transition-colors"
      >
        About
      </Link>
      <Link 
        to="/faq" 
        className="text-foreground hover:text-accent transition-colors"
      >
        FAQ
      </Link>
    </nav>
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Made smaller and black */}
        <Link to="/" className="flex items-center">
          <span className="text-3xl md:text-4xl font-greatvibes text-black font-bold">
            Attiry
          </span>
        </Link>

        {/* Desktop Navigation */}
        <Navigation />

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          {/* Favourites */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/favourites" className="relative">
              <Heart className="h-5 w-5" />
              {favourites.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {favourites.length}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Cart */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => {
              const { openCart } = useCart.getState();
              openCart();
            }}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* Admin Button (only for specific admin emails) */}
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.email}</p>
                    {isAdmin && (
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <Navigation mobile />
                {user && isAdmin && (
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  </div>
                )}
                {!user && (
                  <div className="flex flex-col space-y-2">
                    <Button asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
