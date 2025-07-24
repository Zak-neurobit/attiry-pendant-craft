
import { supabase } from '@/integrations/supabase/client';

// Remove hardcoded admin emails - use database-driven roles instead
export const isAdminEmail = async (email: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== email) {
      return false;
    }

    // Check if user has admin role in database
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return !!roleData;
  } catch (error) {
    console.error('Error in isAdminEmail:', error);
    return false;
  }
};

export const checkAdminAccess = async (userEmail?: string): Promise<boolean> => {
  if (!userEmail) return false;
  return await isAdminEmail(userEmail);
};

// Secure admin check using current authenticated user
export const hasAdminRole = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return !!roleData;
  } catch (error) {
    console.error('Error in hasAdminRole:', error);
    return false;
  }
};
