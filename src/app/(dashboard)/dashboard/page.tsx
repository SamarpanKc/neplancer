'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';


import FreelancerProfileSetup from '@/app/client/profile/page';
import type { User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);

      
      setLoading(false);
    };

    initDashboard();
  }, []);

 
useEffect(() => {
  if (!currentUser) return;

  // Route to appropriate dashboard based on user role
  if (currentUser.role === 'freelancer') {
    if(!currentUser.profile_completed) {
      router.push('/client/profile');
    }else{
    router.push('/components/FreelancerDashboard');
    return;}
  }
else if (currentUser.role === 'client') {
  router.push('/components/ClientDashboard');
  return;
}
},[currentUser]);
  

 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CF574]"></div>
      </div>
    );
  }
  return null;
}
