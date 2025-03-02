'use client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password }
      );

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      const { accessToken, uid, first_name, position, profile_url } =
        response.data;

      if (!accessToken || !uid) {
        throw new Error(
          response?.data?.error || 'Login failed. Please try again.'
        );
      }

      const user = { accessToken, uid, first_name, position };

      // Store user data securely
      Cookies.set('access_token', accessToken, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      Cookies.set('profile_url', profile_url, { expires: 1 });

      try {
        localStorage.setItem('uid', uid.toString());
        localStorage.setItem('first_name', first_name);
        localStorage.setItem('email', email);
        localStorage.setItem('position', position);
      } catch (storageError) {
        console.warn('Storage error:', storageError);
      }

      toast.success('Login successful');
      navigate('/dashboard-app');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        (axios.isAxiosError(error) && error.response?.data?.error) ||
        'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both fields');
      return;
    }
    handleLogin();
  };

  return (
    <div className={`${className} overflow-hidden `} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                  Login to your Agropro account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*******"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block"></div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground mt-5">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
