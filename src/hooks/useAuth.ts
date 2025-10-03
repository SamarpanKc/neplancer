'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getStoredUser, removeStoredUser, removeAuthToken } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const logout = () => {
    removeStoredUser();
    removeAuthToken();
    setUser(null);
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
