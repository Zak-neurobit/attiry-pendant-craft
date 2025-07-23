
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  );
};
