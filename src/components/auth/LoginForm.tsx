
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    
    // Reset attempt count for the specific test email
    if (email.toLowerCase() === 'zak.seid@gmail.com') {
      setAttemptCount(0);
    }
    
    // Rate limiting
    if (attemptCount >= 5) {
      toast({
        title: "Account Temporarily Locked",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email.trim().toLowerCase(), password);
      
      // Reset attempt count on successful login
      setAttemptCount(0);
      
      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      navigate('/');
    } catch (error: any) {
      // Only increment attempt count for other emails
      if (email.toLowerCase() !== 'zak.seid@gmail.com') {
        setAttemptCount(prev => prev + 1);
      }
      
      let errorMessage = "Invalid email or password";
      if (error.message.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account";
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attemptCount >= 3 && attemptCount < 5 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: {5 - attemptCount} attempts remaining before temporary lockout.
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
                disabled={attemptCount >= 5}
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={attemptCount >= 5}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={attemptCount >= 5}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || attemptCount >= 5}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
