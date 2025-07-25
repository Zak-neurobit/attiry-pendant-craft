import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from '@/components/ui/toaster';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductDetail } from '@/pages/ProductDetail';
import { Favourites } from '@/pages/Favourites';
import { Auth } from '@/pages/Auth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Products as AdminProducts } from '@/pages/admin/Products';
import { ProductEdit as AdminProductEdit } from '@/pages/admin/ProductEdit';
import { ProductCreate as AdminProductCreate } from '@/pages/admin/ProductCreate';
import { Dashboard as AdminDashboard } from '@/pages/admin/Dashboard';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <div className="App">
            <Toaster />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/shop" element={<Layout><Shop /></Layout>} />
              <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/favourites" element={<Layout><Favourites /></Layout>} />

              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
              <Route path="/admin/products/new" element={<AdminLayout><AdminProductCreate /></AdminLayout>} />
              <Route path="/admin/products/:productId/edit" element={<AdminLayout><AdminProductEdit /></AdminLayout>} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
