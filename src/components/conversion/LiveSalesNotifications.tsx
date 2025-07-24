
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { analytics } from '@/services/analytics';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LiveSalesNotificationsProps {
  enabled?: boolean;
}

export const LiveSalesNotifications: React.FC<LiveSalesNotificationsProps> = ({ enabled = true }) => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    const loadRecentOrders = async () => {
      const orders = await analytics.getRecentOrders();
      setRecentOrders(orders);
    };

    loadRecentOrders();

    const interval = setInterval(() => {
      if (recentOrders.length > 0) {
        showRandomNotification();
      }
    }, Math.random() * 10000 + 20000); // 20-30 seconds

    return () => clearInterval(interval);
  }, [enabled, recentOrders]);

  const showRandomNotification = () => {
    if (recentOrders.length === 0) return;

    const order = recentOrders[Math.floor(Math.random() * recentOrders.length)];
    const firstName = order.customer_name.split(' ')[0];
    const city = order.shipping_address?.city || 'Unknown';
    const productName = order.order_items[0]?.products?.title || 'Product';

    toast(`${firstName} from ${city} just bought ${productName}`, {
      duration: 5000,
      action: {
        label: 'View',
        onClick: () => {
          // Navigate to product page if available
          console.log('Navigate to product');
        },
      },
    });
  };

  return null; // This component doesn't render anything visible
};
