
import React from 'react';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { SEOHead } from '@/components/SEOHead';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
