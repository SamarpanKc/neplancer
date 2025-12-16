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
  signIn: (email: string, password: string) => Promise<void>;
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
          const result = await auth.signIn(email, password);
          const user = await auth.getCurrentUser();
          set({ 
            user: user as User, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signUp: async (data: SignUpData) => {
        set({ isLoading: true });
        try {
          await auth.signUp(data);
          const user = await auth.getCurrentUser();
          set({ 
            user: user as User, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await auth.signOut();
          set({ 
            user: null, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
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
        } catch (error) {
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