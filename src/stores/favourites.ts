import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface FavouritesState {
  favourites: string[];
  isLoading: boolean;
  addToFavourites: (productId: string) => Promise<void>;
  removeFromFavourites: (productId: string) => Promise<void>;
  isFavourite: (productId: string) => boolean;
  loadFavourites: () => Promise<void>;
}

export const useFavourites = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],
      isLoading: false,

      addToFavourites: async (productId) => {
        const current = get().favourites;
        if (current.includes(productId)) return;

        const newFavourites = [...current, productId];
        set({ favourites: newFavourites });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error } = await supabase
              .from('profiles')
              .update({ favourites: newFavourites })
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error updating favourites:', error);
              // Revert on error
              set({ favourites: current });
            }
          }
        } catch (error) {
          console.error('Error updating favourites:', error);
          // Revert on error
          set({ favourites: current });
        }
      },

      removeFromFavourites: async (productId) => {
        const current = get().favourites;
        const newFavourites = current.filter(id => id !== productId);
        set({ favourites: newFavourites });

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error } = await supabase
              .from('profiles')
              .update({ favourites: newFavourites })
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error updating favourites:', error);
              // Revert on error
              set({ favourites: current });
            }
          }
        } catch (error) {
          console.error('Error updating favourites:', error);
          // Revert on error
          set({ favourites: current });
        }
      },

      isFavourite: (productId) => {
        return get().favourites.includes(productId);
      },

      loadFavourites: async () => {
        set({ isLoading: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await supabase
              .from('profiles')
              .select('favourites')
              .eq('user_id', user.id)
              .single();
            
            if (data && !error) {
              set({ favourites: data.favourites || [] });
            }
          }
        } catch (error) {
          console.error('Error loading favourites:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'favourites-storage',
    }
  )
);