
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Bot,
  Settings,
  Key,
  CreditCard,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Upload,
  FileText,
  ArrowLeft,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { 
    name: 'Products', 
    href: '/admin/products', 
    icon: Package,
    subItems: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/new' },
    ]
  },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { 
    name: 'Payments', 
    href: '/admin/payments', 
    icon: CreditCard,
    subItems: [
      { name: 'Dashboard', href: '/admin/payments' },
      { name: 'All Payments', href: '/admin/payments/all' },
      { name: 'Refunds', href: '/admin/payments/refunds' },
      { name: 'Settlements', href: '/admin/payments/settlements' },
      { name: 'Analytics', href: '/admin/payments/analytics' },
      { name: 'Bulk Operations', href: '/admin/payments/bulk' },
    ]
  },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'API Settings', href: '/admin/api-settings', icon: Key },
  { name: 'AI Settings', href: '/admin/ai-settings', icon: Bot },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-sm">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold font-cormorant text-foreground">Attiry Admin</h1>
      </div>
      <nav className="mt-8 px-4 space-y-2">
        <Link
          to="/"
          className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors mb-4"
        >
          <ArrowLeft className="mr-3 h-4 w-4" />
          Back to Store
        </Link>
        
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isParentActive = hasSubItems && item.subItems.some(sub => location.pathname === sub.href);
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive || isParentActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
                
                {hasSubItems && isParentActive && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.href}
                          className={cn(
                            'flex items-center px-3 py-1 text-xs rounded-md transition-colors',
                            location.pathname === subItem.href
                              ? 'bg-accent/50 text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground'
                          )}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
