import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./components/ScrollToTop";

// Currency initialization
import { CurrencyProvider } from "./components/providers/CurrencyProvider";

// Critical pages (load immediately)
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages for better performance
const Shop = lazy(() => import("./pages/Shop").then(module => ({ default: module.Shop })));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const FAQ = lazy(() => import("./pages/FAQ").then(module => ({ default: module.FAQ })));
const SizeGuide = lazy(() => import("./pages/SizeGuide").then(module => ({ default: module.SizeGuide })));
const Shipping = lazy(() => import("./pages/Shipping").then(module => ({ default: module.Shipping })));
const Returns = lazy(() => import("./pages/Returns").then(module => ({ default: module.Returns })));
const Terms = lazy(() => import("./pages/Terms").then(module => ({ default: module.Terms })));
const Privacy = lazy(() => import("./pages/Privacy").then(module => ({ default: module.Privacy })));
const Cart = lazy(() => import("./pages/Cart").then(module => ({ default: module.Cart })));
const Checkout = lazy(() => import("./pages/Checkout").then(module => ({ default: module.Checkout })));
const SearchResults = lazy(() => import("./pages/SearchResults").then(module => ({ default: module.SearchResults })));
const DesignRequest = lazy(() => import("./pages/DesignRequest"));
const Favourites = lazy(() => import("./pages/Favourites").then(module => ({ default: module.Favourites })));
const Account = lazy(() => import("./pages/Account").then(module => ({ default: module.Account })));
const AuthPage = lazy(() => import("./components/auth/AuthPage").then(module => ({ default: module.AuthPage })));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute").then(module => ({ default: module.ProtectedRoute })));
const Dashboard = lazy(() => import("./pages/admin/Dashboard").then(module => ({ default: module.Dashboard })));
const Products = lazy(() => import("./pages/admin/Products").then(module => ({ default: module.Products })));
const Orders = lazy(() => import("./pages/admin/Orders").then(module => ({ default: module.Orders })));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Analytics = lazy(() => import("./pages/admin/Analytics").then(module => ({ default: module.Analytics })));
const Settings = lazy(() => import("./pages/admin/Settings").then(module => ({ default: module.Settings })));
const AISettings = lazy(() => import("./pages/admin/AISettings"));
const APISettings = lazy(() => import("./pages/admin/APISettings").then(module => ({ default: module.APISettings })));
const PaymentsDashboard = lazy(() => import("./pages/admin/payments/PaymentsDashboard").then(module => ({ default: module.PaymentsDashboard })));
const AllPayments = lazy(() => import("./pages/admin/payments/AllPayments").then(module => ({ default: module.AllPayments })));
const ProductForm = lazy(() => import("./pages/admin/products/ProductForm").then(module => ({ default: module.ProductForm })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component for Suspense fallbacks
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CurrencyProvider>
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Suspense fallback={<PageLoader />}><Shop /></Suspense>} />
                <Route path="product/:slug" element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />
                <Route path="products/:slug" element={<Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>} />
                <Route path="about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
                <Route path="faq" element={<Suspense fallback={<PageLoader />}><FAQ /></Suspense>} />
                <Route path="size-guide" element={<Suspense fallback={<PageLoader />}><SizeGuide /></Suspense>} />
                <Route path="shipping" element={<Suspense fallback={<PageLoader />}><Shipping /></Suspense>} />
                <Route path="returns" element={<Suspense fallback={<PageLoader />}><Returns /></Suspense>} />
                <Route path="terms" element={<Suspense fallback={<PageLoader />}><Terms /></Suspense>} />
                <Route path="privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
                <Route path="cart" element={<Suspense fallback={<PageLoader />}><Cart /></Suspense>} />
                <Route path="checkout" element={<Suspense fallback={<PageLoader />}><Checkout /></Suspense>} />
                <Route path="search" element={<Suspense fallback={<PageLoader />}><SearchResults /></Suspense>} />
                <Route path="design-request" element={<Suspense fallback={<PageLoader />}><DesignRequest /></Suspense>} />
                <Route path="favourites" element={<Suspense fallback={<PageLoader />}><Favourites /></Suspense>} />
                <Route path="account/*" element={<Suspense fallback={<PageLoader />}><Account /></Suspense>} />
                <Route path="auth" element={<Suspense fallback={<PageLoader />}><AuthPage /></Suspense>} />
                <Route path="login" element={<Suspense fallback={<PageLoader />}><AuthPage /></Suspense>} />
                <Route path="signup" element={<Suspense fallback={<PageLoader />}><AuthPage /></Suspense>} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <Suspense fallback={<PageLoader />}>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </Suspense>
              }>
                <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
                <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
                <Route path="products" element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
                <Route path="products/new" element={<Suspense fallback={<PageLoader />}><ProductForm /></Suspense>} />
                <Route path="products/edit/:id" element={<Suspense fallback={<PageLoader />}><ProductForm /></Suspense>} />
                <Route path="orders" element={<Suspense fallback={<PageLoader />}><Orders /></Suspense>} />
                <Route path="customers" element={<Suspense fallback={<PageLoader />}><Customers /></Suspense>} />
                <Route path="analytics" element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
                <Route path="payments" element={<Suspense fallback={<PageLoader />}><PaymentsDashboard /></Suspense>} />
                <Route path="payments/all" element={<Suspense fallback={<PageLoader />}><AllPayments /></Suspense>} />
                <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
                <Route path="ai-settings" element={<Suspense fallback={<PageLoader />}><AISettings /></Suspense>} />
                <Route path="api-settings" element={<Suspense fallback={<PageLoader />}><APISettings /></Suspense>} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </CurrencyProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
);

export default App;