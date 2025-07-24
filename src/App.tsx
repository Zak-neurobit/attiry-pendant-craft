
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import { About } from '@/pages/About';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Favourites } from '@/pages/Favourites';
import { FAQ } from '@/pages/FAQ';
import { Shipping } from '@/pages/Shipping';
import { Returns } from '@/pages/Returns';
import { SizeGuide } from '@/pages/SizeGuide';
import { Terms } from '@/pages/Terms';
import { SearchResults } from '@/pages/SearchResults';
import NotFound from '@/pages/NotFound';
import DesignRequest from '@/pages/DesignRequest';

// Account components
import { Account } from '@/pages/Account';

// Admin components
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { SecureAdminSetup } from '@/components/admin/SecureAdminSetup';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Products } from '@/pages/admin/Products';
import { ProductForm } from '@/pages/admin/products/ProductForm';
import { Orders } from '@/pages/admin/Orders';
import { Analytics } from '@/pages/admin/Analytics';
import Customers from '@/pages/admin/Customers';
import { APISettings } from '@/pages/admin/APISettings';
import AISettings from '@/pages/admin/AISettings';
import { Settings } from '@/pages/admin/Settings';

// Payment admin pages
import { PaymentsDashboard } from '@/pages/admin/payments/PaymentsDashboard';
import { AllPayments } from '@/pages/admin/payments/AllPayments';

// Auth components
import { AuthPage } from '@/components/auth/AuthPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes with Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="about" element={<About />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="favourites" element={<Favourites />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="shipping" element={<Shipping />} />
                <Route path="returns" element={<Returns />} />
                <Route path="size-guide" element={<SizeGuide />} />
                <Route path="terms" element={<Terms />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="design-request" element={<DesignRequest />} />
              </Route>
              
              {/* Account routes */}
              <Route path="/account/*" element={<Account />} />
              
              {/* Auth routes without Layout */}
              <Route path="/login" element={<AuthPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/setup" element={<SecureAdminSetup />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="customers" element={<Customers />} />
                
                {/* Payment Routes */}
                <Route path="payments" element={<PaymentsDashboard />} />
                <Route path="payments/all" element={<AllPayments />} />
                <Route path="payments/refunds" element={<div>Refunds Page Coming Soon</div>} />
                <Route path="payments/settlements" element={<div>Settlements Page Coming Soon</div>} />
                <Route path="payments/analytics" element={<div>Payment Analytics Coming Soon</div>} />
                <Route path="payments/bulk" element={<div>Bulk Operations Coming Soon</div>} />
                
                <Route path="api-settings" element={<APISettings />} />
                <Route path="ai-settings" element={<AISettings />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Catch all */}
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
