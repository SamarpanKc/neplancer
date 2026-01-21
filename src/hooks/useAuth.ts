// hooks/useAuth.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as auth from '@/lib/auth';

interface User {
  id: string;
  email: string;
  role?: 'client' | 'freelancer';
  fullName?: string;
  name?: string;
  avatarUrl?: string;
  profile_completed?: boolean;
  bank_details_completed?: boolean;
  is_admin?: boolean;
  admin_level?: string;
  stats?: {
    // Freelancer stats
    completedJobs?: number;
    totalEarnings?: number;
    rating?: number;
    // Client stats
    jobsPosted?: number;
    totalSpent?: number;
  };
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'client' | 'freelancer';
  // Freelancer fields
  username?: string;
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
  title?: string;
  // Client fields
  clientType?: 'individual' | 'company';
  companyName?: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          await auth.signIn(email, password);
          const user = await auth.getCurrentUser();
          set({ 
            user: user as User, 
            isLoading: false,
            isInitialized: true
          });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signUp: async (data: SignUpData) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
          }

          // Store email for verification resend if needed
          if (result.emailConfirmationRequired) {
            localStorage.setItem('pendingVerificationEmail', data.email);
          }

          // If session exists, get user data
          if (result.session) {
            const user = await auth.getCurrentUser();
            set({ 
              user: user as User, 
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }

          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          // Call the logout API endpoint to clear server-side cookies
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          
          // Also call the auth signOut
          await auth.signOut();
          
          // Clear user state
          set({ 
            user: null, 
            isLoading: false,
            isInitialized: true
          });
          
          // Clear all local storage
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('pendingVerificationEmail');
            // Clear any other Supabase-related items
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.includes('supabase') || key.includes('sb-'))) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
          }
          
          // Force a page reload to clear all client-side state
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Sign out error:', error);
          // Force clear state even on error
          set({ 
            user: null, 
            isLoading: false,
            isInitialized: true
          });
          if (typeof localStorage !== 'undefined') {
            localStorage.clear();
          }
          // Force reload even on error
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      },

      initialize: async () => {
        set({ isLoading: true });
        try {
          const user = await auth.getCurrentUser();
          set({ 
            user: user as User | null,
            isLoading: false,
            isInitialized: true 
          });
        } catch (_error) {
          set({ 
            user: null,
            isLoading: false,
            isInitialized: true 
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

// Helper selectors
export const useAuthUser = () => useAuth((state) => state.user);
export const useIsAuthenticated = () => useAuth((state) => !!state.user);
export const useIsClient = () => useAuth((state) => state.user?.role === 'client');
export const useIsFreelancer = () => useAuth((state) => state.user?.role === 'freelancer');
export const useIsAdmin = () => useAuth((state) => state.user?.is_admin === true);