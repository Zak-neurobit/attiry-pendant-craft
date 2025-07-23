import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BirthdayPopup from "./components/BirthdayPopup";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <BirthdayPopup />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<div className="p-8 text-center">Shop page coming soon...</div>} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<div className="p-8 text-center">Cart page coming soon...</div>} />
              <Route path="/checkout" element={<div className="p-8 text-center">Checkout coming soon...</div>} />
              <Route path="/account" element={<div className="p-8 text-center">Account page coming soon...</div>} />
              <Route path="/about" element={<div className="p-8 text-center">About page coming soon...</div>} />
              <Route path="/blog" element={<div className="p-8 text-center">Blog coming soon...</div>} />
              <Route path="/admin/*" element={<div className="p-8 text-center">Admin panel coming soon...</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
