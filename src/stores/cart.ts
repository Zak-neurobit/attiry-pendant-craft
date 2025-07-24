
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  color: string;
  font?: string;
  chain?: string;
  customText: string;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            item.color === newItem.color &&
            item.font === newItem.font &&
            item.chain === newItem.chain &&
            item.customText === newItem.customText
        );

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const id = `${newItem.productId}-${newItem.color}-${newItem.chain}-${newItem.customText}-${Date.now()}`;
          set({ items: [...items, { ...newItem, id }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.originalPrice * item.quantity,
          0
        );
      },

      getDiscount: () => {
        // 25% discount on original prices
        return get().getSubtotal() * 0.25;
      },

      getTotal: () => {
        return get().getSubtotal() - get().getDiscount();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
