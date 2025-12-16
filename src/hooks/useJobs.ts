import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Job } from '@/types';

// ==========================================
// FETCH ALL JOBS
// ==========================================

export function useJobs(filters?: {
  status?: string;
  category?: string;
  clientId?: string;
}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.clientId) params.append('clientId', filters.clientId);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch jobs');
      }
      const data = await response.json();
      return data.jobs as Job[];
    },
  });
}

// ==========================================
// FETCH SINGLE JOB
// ==========================================

export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch job');
      }
      const data = await response.json();
      return data.job as Job;
    },
    enabled: !!jobId, // Only run query if jobId exists
  });
}

// ==========================================
// CREATE JOB MUTATION
// ==========================================

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData: {
      clientId: string;
      title: string;
      description: string;
      budget: number;
      category: string;
      skills: string[];
      deadline?: string | null;
    }) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create job');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create job');
    },
  });
}

// ==========================================
// UPDATE JOB MUTATION
// ==========================================

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, ...updateData }: { 
      jobId: string;
      title?: string;
      description?: string;
      budget?: number;
      category?: string;
      skills?: string[];
      deadline?: string | null;
      status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
    }) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      toast.success('Job updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update job');
    },
  });
}

// ==========================================
// DELETE JOB MUTATION
// ==========================================

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete job');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });
}

// ==========================================
// OPTIMISTIC UPDATE EXAMPLE
// ==========================================

export function useToggleJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, status }: { 
      jobId: string; 
      status: 'open' | 'in_progress' | 'completed' | 'cancelled' 
    }) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job status');
      }

      return response.json();
    },
    // Optimistic update
    onMutate: async ({ jobId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['job', jobId] });

      // Snapshot previous value
      const previousJob = queryClient.getQueryData(['job', jobId]);

      // Optimistically update
      queryClient.setQueryData(['job', jobId], (old: any) => ({
        ...old,
        status,
      }));

      // Return context with snapshot
      return { previousJob };
    },
    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousJob) {
        queryClient.setQueryData(['job', variables.jobId], context.previousJob);
      }
      toast.error('Failed to update job status');
    },
    // Always refetch after error or success
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
