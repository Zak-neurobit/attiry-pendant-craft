
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AdminSetup = () => {
  const [email, setEmail] = useState('zak.seid@gmail.com');
  const [password, setPassword] = useState('Neurobit@123');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First, try to sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: 'Zak',
            last_name: 'Seid',
          },
        },
      });

      if (signUpError && signUpError.message !== 'User already registered') {
        throw signUpError;
      }

      // Sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      const userId = signInData.user?.id;
      if (!userId) {
        throw new Error('No user ID returned');
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          email,
          first_name: 'Zak',
          last_name: 'Seid',
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        // Don't throw here as it's not critical
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin',
        });

      if (roleError) {
        console.error('Role error:', roleError);
        // Don't throw here as it's not critical
      }

      toast({
        title: "Success",
        description: "Admin account created successfully! You can now access the admin dashboard.",
      });

      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (error: any) {
      console.error('Admin setup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            Set up your admin account to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          <Button 
            onClick={handleCreateAdmin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
