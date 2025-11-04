'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Manrope } from 'next/font/google';
import { signIn, loginAsClient, loginAsFreelancer } from '@/lib/auth';
import { User, Briefcase, Sparkles } from 'lucide-react';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);

      // Redirect based on role
      if (result.user.role === 'client') {
        router.push('/client/post-job');
      } else {
        router.push('/freelancer/browse-jobs');
      }
      
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'client' | 'freelancer') => {
    setLoading(true);
    setError('');
    
    try {
      if (type === 'client') {
        await loginAsClient();
        router.push('/client/post-job');
      } else {
        await loginAsFreelancer();
        router.push('/freelancer/browse-jobs');
      }
      router.refresh();
    } catch {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${manrope.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#0CF574]/5 to-background px-4 py-12`}>
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0CF574]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#0CF574]" />
            <span className="text-sm font-semibold text-gray-900">DEMO MODE - No Signup Required</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">Welcome to NepLancer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with talented Nepali freelancers or find your next project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Quick Demo Login - Client */}
          <button
            onClick={() => handleDemoLogin('client')}
            disabled={loading}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#0CF574] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                DEMO ACCESS
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Continue as Client</h3>
              <p className="text-gray-600 mb-4">
                Post jobs, hire freelancers, and manage projects
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Post unlimited jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Browse freelancer profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Manage contracts</span>
                </div>
              </div>
            </div>
          </button>

          {/* Quick Demo Login - Freelancer */}
          <button
            onClick={() => handleDemoLogin('freelancer')}
            disabled={loading}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#0CF574] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-4 right-4">
              <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                DEMO ACCESS
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-[#0CF574] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Continue as Freelancer</h3>
              <p className="text-gray-600 mb-4">
                Find jobs, submit proposals, and grow your career
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Browse available jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Submit proposals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Track earnings</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-gray-500 font-medium">Or sign in with email</span>
          </div>
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
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                placeholder="you@example.com"
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-gray-900 hover:text-gray-700 underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🎯 Demo mode is fully functional with mock data - perfect for exploring the platform
          </p>
        </div>
      </div>
    </div>
  );
}
