'use client';

import { Toaster } from '@/components/ui/sonner';
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

  const saveToCookies = (
    accessToken: string,
    role_name: string,
    uid: string,
    first_name: string
  ) => {
    Cookies.set('access_token', accessToken, { expires: 1 });
    Cookies.set('role_name', role_name, { expires: 1 });
    Cookies.set('uid', uid, { expires: 1 });
    Cookies.set('first_name', first_name, { expires: 1 });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password }
      );
      if (!response.data.accessToken) {
        throw new Error('No access token received');
      }
      const { accessToken, role_id, uid, first_name } = response.data;
      saveToCookies(accessToken, role_id, uid, first_name);
      if (uid) {
        localStorage.setItem('uid', uid.toString());
        sessionStorage.setItem('uid', uid.toString());
        navigate('/dashboard-app');
        toast.success('Login successful');
      } else {
        toast.error(response?.data?.error || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={className} {...props}>
      <Toaster /> {/* Add Toaster here to display toast messages */}
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
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
          <div className="relative hidden bg-muted md:block">
            <img
              src="../assets/Agro.jpg"
              alt="Agro Logo"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
