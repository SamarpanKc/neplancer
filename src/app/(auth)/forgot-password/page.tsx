'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Manrope } from 'next/font/google';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { validateEmail, forgotPasswordSchema } from '@/lib/validations';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Real-time email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value.trim();
    setEmail(emailValue);
    
    if (!emailValue) {
      setEmailError('');
      setIsEmailValid(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
      return;
    }

    // Check for disposable email domains
    const domain = emailValue.split('@')[1]?.toLowerCase();
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'trashmail.com', 'temp-mail.org', 'fakeinbox.com', 'yopmail.com', 'getnada.com', 'maildrop.cc', 'mintemail.com'];
    
    if (domain && disposableDomains.includes(domain)) {
      setEmailError('Disposable email addresses are not allowed');
      setIsEmailValid(false);
      return;
    }

    // Additional validation checks
    if (emailValue.includes('..')) {
      setEmailError('Email cannot contain consecutive dots');
      setIsEmailValid(false);
      return;
    }

    // Email is valid
    setEmailError('');
    setIsEmailValid(true);
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);

    // Validate email before submission
    if (!email) {
      setEmailError('Email address is required');
      toast.error('Email address is required');
      return;
    }

    if (!isEmailValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate using Zod schema
    try {
      forgotPasswordSchema.parse({ email });
    } catch (validationError: any) {
      if (validationError.errors && validationError.errors.length > 0) {
        const firstError = validationError.errors[0];
        setEmailError(firstError.message);
        toast.error(firstError.message);
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setIsSuccess(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${manrope.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#0CF574]/5 to-background px-4`}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-8">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Back to Login
              </button>
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-900 hover:bg-gray-50 transition-all duration-200"
              >
                Try Different Email
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${manrope.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#0CF574]/5 to-background px-4`}>
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-lg">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                  className={`w-full pl-11 pr-12 py-4 border-2 ${
                    emailTouched && emailError
                      ? 'border-red-300 focus:border-red-500'
                      : emailTouched && isEmailValid
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-200 focus:border-gray-900'
                  } rounded-xl focus:outline-none transition-colors text-gray-900`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {emailTouched && email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isEmailValid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {emailTouched && emailError && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </p>
              )}
              {emailTouched && isEmailValid && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Valid email address
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <Link href="/login" className="text-gray-900 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <p className="mt-6 text-center text-sm text-gray-500">
          🔒 Your security is our priority. The reset link will expire in 1 hour.
        </p>
      </div>
    </div>
  );
}
