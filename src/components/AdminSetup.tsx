
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateInput = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
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
      // Check if any admin user already exists
      const { data: existingAdmins, error: adminCheckError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (adminCheckError) {
        throw new Error('Failed to check existing admin users');
      }

      if (existingAdmins && existingAdmins.length > 0) {
        toast({
          title: "Error",
          description: "An admin user already exists. Please contact support for additional admin access.",
          variant: "destructive",
        });
        return;
      }

      // Create the user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: '',
            last_name: '',
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('Failed to create user account');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: signUpData.user.id,
          email: email.trim().toLowerCase(),
          first_name: '',
          last_name: '',
        });

      if (profileError) {
        console.warn('Profile creation failed:', profileError);
      }

      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: signUpData.user.id,
          role: 'admin',
        });

      if (roleError) {
        throw new Error('Failed to assign admin role');
      }

      // Log the admin creation for security audit
      const { error: auditError } = await supabase
        .from('security_audit_log')
        .insert({
          action: 'admin_account_created',
          user_id: signUpData.user.id,
          details: { email: email.trim().toLowerCase() },
          ip_address: null, // Client-side, can't get real IP
          user_agent: navigator.userAgent,
        });

      if (auditError) {
        console.warn('Audit log failed:', auditError);
      }

      toast({
        title: "Success",
        description: "Admin account created successfully! Please check your email to verify your account.",
      });

      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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
            Create the first admin account for your store
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
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password (min 8 chars)"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
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
