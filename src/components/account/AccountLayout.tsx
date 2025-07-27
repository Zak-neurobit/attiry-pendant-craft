
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, MapPin, Package, BarChart3 } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/account/overview', icon: BarChart3 },
  { name: 'Personal Info', href: '/account/personal-info', icon: User },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Orders', href: '/account/orders', icon: Package },
];

interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavItems = ({ isMobile = false }) => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:pt-20">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <h1 className="text-xl font-semibold font-cormorant">My Account</h1>
              </div>
              <div className="flex-grow flex flex-col">
                <div className="px-4">
                  <NavItems />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
            <div className="flex items-center justify-between h-16 px-4">
              <h1 className="text-lg font-semibold font-cormorant">My Account</h1>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="mt-6">
                    <NavItems isMobile />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:pl-64">
            <main className="pt-20 lg:pt-8">
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
