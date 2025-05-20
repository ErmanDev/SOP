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
      console.log('Attempting to send password reset email to:', email);

      const response = await axios.post(
        'http://localhost:5000/api/email/send-email',
        {
          to: email,
          subject: 'Password Reset Request - QuickMart POS',
          text: `Please click this link to reset your password: http://localhost:5173/reset-password?email=${encodeURIComponent(
            email
          )}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #1f2937; margin-bottom: 10px;">Password Reset Request</h2>
              <p style="color: #4b5563; margin-bottom: 5px;">Hello,</p>
              <p style="color: #4b5563;">We received a request to reset your password for your QuickMart POS account.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/reset-password?email=${encodeURIComponent(
                email
              )}" 
                 style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Reset Your Password
              </a>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              <p style="margin-bottom: 10px;">If you didn't request this password reset, you can safely ignore this email.</p>
              <p style="margin-bottom: 10px;">For security reasons, this link will expire in 1 hour.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="color: #9ca3af;">Best regards,<br>QuickMart POS Team</p>
            </div>
          </div>
        `,
        }
      );

      console.log('Email API Response:', response.data);

      if (response.data.success) {
        Cookies.set('email', email, { expires: 7, secure: true });
        setMessage(
          "Password reset link has been sent to your email! Please check your spam folder if you don't see it in your inbox."
        );
        setEmail('');
      } else {
        setError(
          response.data.message || 'Failed to send email. Please try again.'
        );
      }
    } catch (err) {
      console.error('Detailed error sending email:', err);
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data;
        console.error('API Error Response:', errorResponse);

        if (err.code === 'ECONNREFUSED') {
          setError(
            'Unable to connect to the email server. Please try again later.'
          );
        } else if (err.response?.status === 404) {
          setError('Email service not found. Please contact support.');
        } else if (err.response?.status === 429) {
          setError(
            'Too many requests. Please wait a few minutes and try again.'
          );
        } else {
          setError(
            `Email sending failed: ${
              err.response?.data?.message ?? err.message ?? 'Unknown error'
            }`
          );
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
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
