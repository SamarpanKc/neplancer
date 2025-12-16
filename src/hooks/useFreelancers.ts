import { useQuery } from '@tantml:invoke name="create_file">
<parameter name="content">import { useQuery } from '@tanstack/react-query';
import type { Freelancer } from '@/types';

// ==========================================
// FETCH ALL FREELANCERS
// ==========================================

export function useFreelancers(filters?: {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['freelancers', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.skills?.length) params.append('skills', filters.skills.join(','));
      if (filters?.minRate) params.append('minRate', filters.minRate.toString());
      if (filters?.maxRate) params.append('maxRate', filters.maxRate.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/freelancers?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch freelancers');
      }
      const data = await response.json();
      return data.freelancers as Freelancer[];
    },
  });
}

// ==========================================
// FETCH SINGLE FREELANCER
// ==========================================

export function useFreelancer(freelancerId: string | null) {
  return useQuery({
    queryKey: ['freelancer', freelancerId],
    queryFn: async () => {
      if (!freelancerId) return null;
      
      const response = await fetch(`/api/freelancers/${freelancerId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch freelancer');
      }
      const data = await response.json();
      return data.freelancer as Freelancer;
    },
    enabled: !!freelancerId,
  });
}
