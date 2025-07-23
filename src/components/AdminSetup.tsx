
import { useState } from 'react';
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
      // First, try to sign in with existing credentials
      try {
        await authService.signIn('zak.seid@gmail.com', 'Neurobit@123');
        
        // Ensure admin role exists
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            await authService.createAdminUser(user.id);
          } catch (roleError) {
            // Role might already exist, that's fine
            console.log('Admin role already exists or created');
          }
        }
        
        toast({
          title: 'Success',
          description: 'Admin user signed in successfully! You can now access the admin dashboard.',
        });
        
        // Redirect to admin dashboard
        window.location.href = '/admin';
        return;
      } catch (signInError) {
        console.log('Sign in failed, attempting to create user');
      }

      // If sign in fails, create new user
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
          description: 'Admin user created successfully! You can now access the admin dashboard.',
        });
        
        // Redirect to admin dashboard
        window.location.href = '/admin';
      }
    } catch (error: any) {
      console.error('Admin setup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to set up admin user',
        variant: 'destructive',
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Admin Setup</h2>
        <p className="text-muted-foreground">
          Set up the admin account for zak.seid@gmail.com
        </p>
        <Button 
          onClick={createAdminUser} 
          disabled={isSettingUp}
          className="w-full"
          size="lg"
        >
          {isSettingUp ? 'Setting up admin...' : 'Setup Admin Account'}
        </Button>
        <p className="text-sm text-muted-foreground">
          This will create an admin account with access to the admin dashboard.
        </p>
      </div>
    </div>
  );
};
