import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Label } from '@/components/ui/label';
import { MoveLeft } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
}

const ForgotPasswordForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard-app');
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-950">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="userId"
                type="email"
                placeholder="example@gmail.com"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <Button
              onClick={handleNavigateToDashboard}
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded cursor-pointer hover:opacity-90"
            >
              Email Link
            </Button>
          </form>
          <div className="mt-4">
            <a className="">
              <p className="text-center">
                <MoveLeft className="inline-block" />{' '}
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
