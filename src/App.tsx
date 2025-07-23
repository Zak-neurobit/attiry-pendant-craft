
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { CartDrawer } from "./components/CartDrawer";
import Footer from "./components/Footer";
import BirthdayPopup from "./components/BirthdayPopup";
import Home from "./pages/Home";
import { Shop } from "./pages/Shop";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Favourites } from "./pages/Favourites";
import { SearchResults } from "./pages/SearchResults";
import { Checkout } from "./pages/Checkout";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSetup } from "@/components/AdminSetup";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Products } from "@/pages/admin/Products";
import { Orders } from "@/pages/admin/Orders";
import { Analytics } from "@/pages/admin/Analytics";
import { Customers } from "@/pages/admin/Customers";
import { AISettings } from "@/pages/admin/AISettings";
import { Settings } from "@/pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <BirthdayPopup />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/shop" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <Shop />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/product/:slug" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <ProductDetail />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/cart" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <div className="p-8 text-center">Cart page coming soon...</div>
                </main>
                <Footer />
              </div>
            } />
            <Route path="/checkout" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <Checkout />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/account" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <div className="p-8 text-center">Account page coming soon...</div>
                </main>
                <Footer />
              </div>
            } />
            <Route path="/about" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <About />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/favourites" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <Favourites />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/search" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <SearchResults />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/admin-setup" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <AdminSetup />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/blog" element={
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1">
                  <div className="p-8 text-center">Blog coming soon...</div>
                </main>
                <Footer />
              </div>
            } />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="customers" element={<Customers />} />
              <Route path="ai-settings" element={<AISettings />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartDrawer />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
