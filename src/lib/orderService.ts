import { supabase } from '@/integrations/supabase/client';
import { CartItem, formatCartItemForDatabase } from '@/stores/cart';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderData {
  items: CartItem[];
  customerInfo: CustomerInfo;
  subtotal: number;
  discountAmount?: number;
  total: number;
  shippingCost?: number;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

export const createOrder = async (orderData: OrderData): Promise<CreateOrderResponse> => {
  try {
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Prepare shipping address
    const shippingAddress = {
      street: orderData.customerInfo.street,
      city: orderData.customerInfo.city,
      state: orderData.customerInfo.state,
      zip: orderData.customerInfo.zip,
      country: orderData.customerInfo.country,
    };

    // Create the order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        customer_email: orderData.customerInfo.email,
        customer_name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        shipping_address: shippingAddress,
        subtotal: orderData.subtotal,
        discount_amount: orderData.discountAmount || 0,
        total: orderData.total,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return {
        success: false,
        error: orderError?.message || 'Failed to create order'
      };
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      ...formatCartItemForDatabase(item)
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      
      // Rollback: delete the order if items failed
      await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);
      
      return {
        success: false,
        error: itemsError.message || 'Failed to create order items'
      };
    }

    // Log analytics event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'order_created',
        event_data: {
          order_id: order.id,
          total: orderData.total,
          items_count: orderData.items.length,
          customer_email: orderData.customerInfo.email
        },
        user_id: user?.id || null
      });

    return {
      success: true,
      orderId: order.id
    };

  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred'
    };
  }
};

// Get orders for current user
export const getUserOrders = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            title,
            image_urls
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch orders' 
    };
  }
};

// Get order by ID (for order confirmation page)
export const getOrderById = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            title,
            image_urls
          )
        )
      `)
      .eq('id', orderId)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch order' 
    };
  }
};