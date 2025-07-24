
import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
  id: string;
  email: string;
  role?: string;
};

// Input validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 255); // Prevent excessively long inputs
};

export const authService = {
  async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedFirstName = firstName ? sanitizeInput(firstName).slice(0, 50) : undefined;
    const sanitizedLastName = lastName ? sanitizeInput(lastName).slice(0, 50) : undefined;

    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(password)) {
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

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          email: sanitizedEmail,
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
        });

      if (profileError) {
        console.warn('Profile creation failed:', profileError);
        // Don't throw here as the user was created successfully
      }
    }

    return data;
  },

  async signIn(email: string, password: string) {
    // Input validation
    const sanitizedEmail = sanitizeInput(email);

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

    // Get user role
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !!data;
  },
};
