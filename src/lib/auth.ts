
import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
  id: string;
  email: string;
  role?: string;
};

// Enhanced input validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128; // Reasonable limits
};

const sanitizeInput = (input: string): string => {
  // Remove potentially harmful characters and limit length
  return input.replace(/[<>'"&]/g, '').trim().slice(0, 255);
};

const sanitizeName = (name: string): string => {
  // Allow only letters, spaces, hyphens, apostrophes for names
  return name.replace(/[^a-zA-Z\s\-']/g, '').trim().slice(0, 50);
};

export const authService = {
  async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    // Enhanced input validation and sanitization
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedFirstName = firstName ? sanitizeName(firstName) : undefined;
    const sanitizedLastName = lastName ? sanitizeName(lastName) : undefined;

    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new Error('Password must be between 8-128 characters long');
    }

    // Simplified password validation
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
        },
      },
    });

    if (error) throw error;
    
    return data;
  },

  async signIn(email: string, password: string) {
    // Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user role from database with timeout for performance
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      role: roleData?.role || 'user',
    };
  },

  async hasAdminRole(): Promise<boolean> {
    // Use getCurrentUser to avoid duplicate query
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  },

  // New optimized method that gets both user and admin status in one call
  async getUserWithAdminStatus(): Promise<{ user: AuthUser | null, isAdmin: boolean }> {
    const user = await this.getCurrentUser();
    return {
      user,
      isAdmin: user?.role === 'admin'
    };
  },
};
