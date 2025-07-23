
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Index from '@/pages/Index';
import { Shop } from '@/pages/Shop';
import { About } from '@/pages/About';
import { Terms } from '@/pages/Terms';
import { Returns } from '@/pages/Returns';
import { SizeGuide } from '@/pages/SizeGuide';
import { FAQ } from '@/pages/FAQ';
import { Shipping } from '@/pages/Shipping';
import { Favourites } from '@/pages/Favourites';
import { SearchResults } from '@/pages/SearchResults';
import ProductDetail from '@/pages/ProductDetail';
import { Checkout } from '@/pages/Checkout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Products } from '@/pages/admin/Products';
import { Orders } from '@/pages/admin/Orders';
import { Customers } from '@/pages/admin/Customers';
import { Analytics } from '@/pages/admin/Analytics';
import { APISettings } from '@/pages/admin/APISettings';
import { Settings } from '@/pages/admin/Settings';
import { AISettings } from '@/pages/admin/AISettings';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="api-settings" element={<APISettings />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ai-settings" element={<AISettings />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
