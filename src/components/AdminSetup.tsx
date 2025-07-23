import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { authService } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const AdminSetup = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    setIsSettingUp(true);
    try {
      // Sign up the admin user
      await authService.signUp(
        'zak.seid@gmail.com', 
        'Neurobit@123',
        'Zak',
        'Seid'
      );

      // Get the user to add admin role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await authService.createAdminUser(user.id);
        toast({
          title: 'Success',
          description: 'Admin user created successfully!',
        });
      }
    } catch (error: any) {
      console.error('Admin setup error:', error);
      // If user already exists, just log them in
      if (error.message?.includes('already registered')) {
        try {
          await authService.signIn('zak.seid@gmail.com', 'Neurobit@123');
          toast({
            title: 'Success',
            description: 'Admin user signed in successfully!',
          });
        } catch (signInError: any) {
          toast({
            title: 'Error',
            description: signInError.message || 'Failed to sign in admin user',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create admin user',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={createAdminUser} 
        disabled={isSettingUp}
        className="w-full"
      >
        {isSettingUp ? 'Setting up admin...' : 'Create Admin User (zak.seid@gmail.com)'}
      </Button>
    </div>
  );
};