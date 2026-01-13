'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Manrope } from 'next/font/google';
import { useAuth } from '@/hooks/useAuth';
import { User, Briefcase, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateEmail, signInSchema } from '@/lib/validations';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Real-time email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    setFormData({ ...formData, email });
    
    if (!email) {
      setEmailError('');
      setIsEmailValid(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
      return;
    }

    // Check for disposable email domains
    const domain = email.split('@')[1]?.toLowerCase();
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'trashmail.com', 'temp-mail.org', 'fakeinbox.com', 'yopmail.com', 'getnada.com', 'maildrop.cc', 'mintemail.com'];
    
    if (domain && disposableDomains.includes(domain)) {
      setEmailError('Disposable email addresses are not allowed');
      setIsEmailValid(false);
      return;
    }

    // Additional validation checks
    if (email.includes('..')) {
      setEmailError('Email cannot contain consecutive dots');
      setIsEmailValid(false);
      return;
    }

    const localPart = email.split('@')[0];
    if (localPart && (localPart.length === 0 || localPart.length > 64)) {
      setEmailError('Email format is invalid');
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
    setError('');
    setEmailTouched(true);

    // Validate email before submission
    if (!formData.email) {
      setError('Email address is required');
      setEmailError('Email address is required');
      return;
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate using Zod schema
    try {
      signInSchema.parse(formData);
    } catch (validationError: any) {
      if (validationError.errors && validationError.errors.length > 0) {
        const firstError = validationError.errors[0];
        setError(firstError.message);
        if (firstError.path.includes('email')) {
          setEmailError(firstError.message);
        }
        return;
      }
    }

    try {
      await signIn(formData.email.toLowerCase().trim(), formData.password);
      
      toast.success('Login successful! Welcome back.');
      
      // Redirect to dashboard (you can customize based on role later)
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className={`${manrope.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#0CF574]/5 to-background px-4 py-12`}>
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">Welcome to NepLancer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with talented Nepali freelancers or find your next project
          </p>
        </div>

        {/* Traditional Login Form */}
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className={`appearance-none relative block w-full px-4 py-3 pr-10 border ${
                    emailTouched && emailError
                      ? 'border-red-300 focus:ring-red-500'
                      : emailTouched && isEmailValid
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-[#0CF574]'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  placeholder="yourmail@domain.com"
                />
                {emailTouched && formData.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
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

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                placeholder="••••••••"
              />
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-gray-900 hover:text-gray-700 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}