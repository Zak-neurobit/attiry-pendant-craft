
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Shield } from 'lucide-react';

export const SecureAdminSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [initToken, setInitToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const { toast } = useToast();

  // Check if there's a valid initialization token available
  useEffect(() => {
    checkInitializationTokens();
  }, []);

  const checkInitializationTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_initialization')
        .select('initialization_token')
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (error) {
        console.error('Error checking tokens:', error);
        return;
      }

      setHasValidToken(data && data.length > 0);
      if (data && data.length > 0) {
        setInitToken(data[0].initialization_token);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const validateInput = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    // Password validation
    if (password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateAdmin = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      // First create the user through Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        throw new Error('Failed to create user');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email,
          first_name: 'Admin',
          last_name: 'User',
        });

      if (profileError) {
        console.warn('Profile creation failed:', profileError);
      }

      // Assign admin role using the secure function
      const { data: adminResult, error: adminError } = await supabase
        .rpc('create_initial_admin', {
          p_email: email,
          p_password: password,
          p_initialization_token: initToken,
        });

      if (adminError) {
        throw adminError;
      }

      if (adminResult?.error) {
        throw new Error(adminResult.error);
      }

      // Manually insert admin role (since function handles validation)
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin',
        });

      if (roleError) {
        console.warn('Role assignment warning:', roleError);
      }

      toast({
        title: "Success",
        description: "Admin account created successfully! Please sign in.",
      });

      // Redirect to admin login
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 2000);
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

  if (!hasValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Admin Setup Unavailable</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                No valid initialization token found. Admin setup is only available immediately after deployment or when authorized by a system administrator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Secure Admin Setup</CardTitle>
          </div>
          <CardDescription>
            Create the initial admin account for this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This is a one-time setup process. The admin account will have full access to the system.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password (8+ characters)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>
          
          <Button 
            onClick={handleCreateAdmin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
