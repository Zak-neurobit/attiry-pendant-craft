
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Layout } from "./components/layout/Layout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";

// i18n and currency initialization
import "./i18n";
import { CurrencyProvider } from "./components/providers/CurrencyProvider";

// Public Pages
import Home from "./pages/Home";
import { Shop } from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";
import { SizeGuide } from "./pages/SizeGuide";
import { Shipping } from "./pages/Shipping";
import { Returns } from "./pages/Returns";
import { Terms } from "./pages/Terms";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { SearchResults } from "./pages/SearchResults";
import DesignRequest from "./pages/DesignRequest";
import { Favourites } from "./pages/Favourites";
import { Account } from "./pages/Account";
import NotFound from "./pages/NotFound";

// Auth Components
import { AuthPage } from "./components/auth/AuthPage";

// Admin Pages
import { Dashboard } from "./pages/admin/Dashboard";
import { Products } from "./pages/admin/Products";
import { Orders } from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import { Analytics } from "./pages/admin/Analytics";
import { Settings } from "./pages/admin/Settings";
import AISettings from "./pages/admin/AISettings";
import { APISettings } from "./pages/admin/APISettings";
import { PaymentsDashboard } from "./pages/admin/payments/PaymentsDashboard";
import { AllPayments } from "./pages/admin/payments/AllPayments";
import { ProductForm } from "./pages/admin/products/ProductForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CurrencyProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="products/:slug" element={<ProductDetail />} />
                <Route path="about" element={<About />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="size-guide" element={<SizeGuide />} />
                <Route path="shipping" element={<Shipping />} />
                <Route path="returns" element={<Returns />} />
                <Route path="terms" element={<Terms />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="design-request" element={<DesignRequest />} />
                <Route path="favourites" element={<Favourites />} />
                <Route path="account/*" element={<Account />} />
                <Route path="auth" element={<AuthPage />} />
                <Route path="login" element={<AuthPage />} />
                <Route path="signup" element={<AuthPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="payments" element={<PaymentsDashboard />} />
                <Route path="payments/all" element={<AllPayments />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ai-settings" element={<AISettings />} />
                <Route path="api-settings" element={<APISettings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </CurrencyProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;
