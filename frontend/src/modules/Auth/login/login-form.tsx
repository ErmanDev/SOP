import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

interface LoginFormProps {
  onSubmit?: (credentials: { email: string; password: string }) => void;
}

interface LoginError {
  message: string;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const firstName = data.fullname.split(' ')[0];

      // Set cookies with 7-day expiration
      Cookies.set('profile_url', data.profile_url ?? '', { expires: 7 });
      Cookies.set('firstName', firstName, { expires: 7 });
      Cookies.set('email', data.email, { expires: 7 });
      Cookies.set('role_name', data.role_name, { expires: 7 });
      Cookies.set('accessToken', data.accessToken, { expires: 7 });

      navigate('/dashboard');
    } catch (err) {
      const error = err as LoginError;
      toast.error(error.message, {
        description: 'Please check your credentials and try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-950">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="000000"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <InputPassword
                  id="password"
                  type="password"
                  placeholder="*******"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <a
                href="/forgot-password"
                className="text-sm text-gray-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded cursor-pointer hover:opacity-90"
            >
              LOG IN
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
