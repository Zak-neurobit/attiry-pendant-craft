
import { create } from 'zustand';
import { authService, type AuthUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAdmin: false,

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      await authService.signIn(email, password);
      const user = await authService.getCurrentUser();
      const isAdmin = await authService.hasAdminRole();
      set({ user, isAdmin, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
    set({ loading: true });
    try {
      await authService.signUp(email, password, firstName, lastName);
      const user = await authService.getCurrentUser();
      const isAdmin = await authService.hasAdminRole();
      set({ user, isAdmin, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await authService.signOut();
      set({ user: null, isAdmin: false, loading: false });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  initialize: async () => {
    try {
      const user = await authService.getCurrentUser();
      const isAdmin = user ? await authService.hasAdminRole() : false;
      set({ user, isAdmin, loading: false });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, isAdmin: false, loading: false });
    }
  },
}));

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const { initialize } = useAuth.getState();
  
  if (event === 'SIGNED_OUT') {
    useAuth.setState({ user: null, isAdmin: false, loading: false });
  } else if (event === 'SIGNED_IN' && session) {
    // Defer the initialization to avoid blocking the auth state change
    setTimeout(() => {
      initialize();
    }, 0);
  }
});
