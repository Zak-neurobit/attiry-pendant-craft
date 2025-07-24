
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateInput = () => {
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) return;
    
    // Rate limiting - block after 5 failed attempts
    if (attemptCount >= 5) {
      toast({
        title: "Account Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      
      // Log successful login
      console.log('Admin login successful:', { email, timestamp: new Date().toISOString() });
      
      toast({
        title: "Success",
        description: "Successfully signed in as admin",
      });
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Admin login failed:', { email, error: error.message, timestamp: new Date().toISOString() });
      
      setAttemptCount(prev => prev + 1);
      
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          </div>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attemptCount >= 3 && attemptCount < 5 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: {5 - attemptCount} attempts remaining before account lockout.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter admin email"
                disabled={attemptCount >= 5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                disabled={attemptCount >= 5}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || attemptCount >= 5}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Need to set up admin access?{' '}
              <button
                onClick={() => navigate('/admin/setup')}
                className="text-primary hover:underline"
              >
                Admin Setup
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
