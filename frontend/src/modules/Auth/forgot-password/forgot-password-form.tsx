import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoveLeft } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/email/send-email',
        {
          to: email,
          subject: 'Password Reset Request',
          text: 'Please use the link below to reset your password.',
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <div style="margin: 25px 0;">
              <a href="http://localhost:5173/reset-password" 
                 style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>Your POS Team</p>
          </div>
        `,
        }
      );

      if (response.data.success) {
        Cookies.set('email', email, { expires: 7, secure: true });
        setMessage('Password reset link has been sent to your email!');
      } else {
        setError(
          response.data.message ?? 'Failed to send email. Please try again.'
        );
      }
    } catch (err: unknown) {
      console.error('Error sending email:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            'Failed to send email. Please try again.'
        );
      } else {
        setError('Failed to send email. Please try again.');
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
            Forgot Password
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
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded cursor-pointer hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordForm;
