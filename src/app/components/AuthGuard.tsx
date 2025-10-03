'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: 'client' | 'freelancer';
}

export function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requireRole && user.role !== requireRole) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requireRole, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (requireRole && user.role !== requireRole)) {
    return null;
  }

  return <>{children}</>;
}
