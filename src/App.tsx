
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import { Favourites } from '@/pages/Favourites';
import Auth from '@/pages/Auth';
import { Products as AdminProducts } from '@/pages/admin/Products';
import AdminProductEdit from '@/pages/admin/ProductEdit';
import AdminProductCreate from '@/pages/admin/ProductCreate';
import { Dashboard as AdminDashboard } from '@/pages/admin/Dashboard';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductCreate />} />
              <Route path="/admin/products/:productId/edit" element={<AdminProductEdit />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
