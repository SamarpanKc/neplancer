'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Manrope } from 'next/font/google';
import { useAuth } from '@/hooks/useAuth';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer' as 'client' | 'freelancer',
    username: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.role === 'freelancer' && !formData.username.trim()) {
      setError('Username is required for freelancers');
      return;
    }

    if (formData.role === 'freelancer' && formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        username: formData.role === 'freelancer' ? formData.username : undefined,
      });

      // Redirect based on role
      if (formData.role === 'client') {
        router.push('/client/dashboard');
      } else {
        router.push('/freelancer/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className={`${manrope.className} min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-[#0CF574]/10 px-4 py-12`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        <div>
          <h1 className="text-6xl font-extrabold text-left -tracking-wider text-gray-900">Join Neplancer</h1>
          <p className="mt-2 text-left text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-gray-900 hover:text-gray-700 underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-md w-full space-y-8 mx-auto lg:mx-0">
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I want to
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                className={`flex-1 py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-200 ${
                  formData.role === 'freelancer'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 cursor-pointer'
                }`}
              >
                Find Work
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className={`flex-1 py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-200 ${
                  formData.role === 'client'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 cursor-pointer'
                }`}
              >
                Hire Talent
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Samarpan KC"
              />
            </div>

            {/* Username field - only for freelancers */}
            {formData.role === 'freelancer' && (
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="samarpan_kc"
                  minLength={3}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Unique username for your profile (lowercase letters, numbers, and underscores only)
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="yourmail@domain.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 ">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-900">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}