import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const handleNavigateToDashboard = () => {
    localStorage.setItem('user_role', 'employee');
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-950">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="id">User ID</Label>
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
                <Label htmlFor="id">Password</Label>
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
            <label>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center"></div>
                <a
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </label>

            <Button
              onClick={handleNavigateToDashboard}
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
