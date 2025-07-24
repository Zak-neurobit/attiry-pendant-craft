
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { SEOHead } from '@/components/SEOHead';
import Footer from '@/components/Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
