'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, signOut as authSignOut, onAuthStateChange } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setLoading(false);
      })
      .catch((error) => {
        // Silently handle errors - just means user isn't logged in
        console.log('No active session:', error?.message || 'Not logged in');
        setUser(null);
        setLoading(false);
      });

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
    isClient: user?.role === 'client',
    isFreelancer: user?.role === 'freelancer',
  };
}
