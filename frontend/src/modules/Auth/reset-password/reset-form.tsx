import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputPassword } from '@/components/ui/input-password';
import { Label } from '@/components/ui/label';
import { MoveLeft } from 'lucide-react';
import axios, { AxiosError } from 'axios';

const ResetForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      setError('Email is required');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        {
          email,
          newPassword: password,
        }
      );

      if (response.data.success) {
        setMessage('Password successfully reset!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      const axiosError = err as AxiosError<{ message: string }>;

      // Log detailed error information
      console.error('Error details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      if (axiosError.response?.status === 404) {
        setError('Reset password endpoint not found. Please contact support.');
      } else if (axiosError.response?.status === 400) {
        setError(
          axiosError.response.data?.message ||
            'Invalid request. Please check your input.'
        );
      } else if (axiosError.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (axiosError.code === 'ECONNREFUSED') {
        setError(
          'Unable to connect to the server. Please check your internet connection.'
        );
      } else {
        setError(
          axiosError.response?.data?.message ||
            'Failed to reset password. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <div className="p-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-950">
            Reset Password
          </h2>

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="grid gap-2">
                <InputPassword
                  id="password"
                  placeholder="*******"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || !email}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="grid gap-2">
                <InputPassword
                  id="confirmPassword"
                  placeholder="*******"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || !email}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded cursor-pointer hover:opacity-90"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-4">
            <p className="text-center">
              <MoveLeft className="inline-block" />{' '}
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:underline"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResetForm;
