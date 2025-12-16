import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Types
export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  session_id?: string;
  created_at: string;
}

export interface PlatformStats {
  stat_date: string;
  total_users: number;
  active_users: number;
  total_jobs: number;
  active_jobs: number;
  total_proposals: number;
  total_contracts: number;
  total_revenue: number;
  platform_fees: number;
}

export interface UserStats {
  stat_date: string;
  jobs_posted: number;
  proposals_submitted: number;
  proposals_accepted: number;
  contracts_completed: number;
  total_earned: number;
  total_spent: number;
  profile_views: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  fees: number;
}

export interface ActivityData {
  date: string;
  jobs: number;
  proposals: number;
  contracts: number;
}

// Track analytics event
export async function trackEvent(
  eventType: string,
  eventData?: Record<string, any>,
  userId?: string
) {
  try {
    const { data, error } = await supabase.rpc('track_analytics_event', {
      p_user_id: userId || null,
      p_event_type: eventType,
      p_event_data: eventData || {},
      p_session_id: getSessionId(),
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return { success: false, error };
  }
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  
  return sessionId;
}

// Hook: Get platform stats for date range
export function usePlatformStats(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['platform-stats', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_platform_stats', {
        p_start_date: startDate,
        p_end_date: endDate,
      });

      if (error) throw error;
      return data as PlatformStats[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook: Get user stats
export function useUserStats(userId: string, days: number = 30) {
  return useQuery({
    queryKey: ['user-stats', userId, days],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .gte('stat_date', startDate.toISOString().split('T')[0])
        .lte('stat_date', endDate.toISOString().split('T')[0])
        .order('stat_date', { ascending: false });

      if (error) throw error;
      return data as UserStats[];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook: Get revenue data for charts
export function useRevenueData(days: number = 30) {
  return useQuery({
    queryKey: ['revenue-data', days],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('platform_stats')
        .select('stat_date, total_revenue, platform_fees')
        .gte('stat_date', startDate.toISOString().split('T')[0])
        .lte('stat_date', endDate.toISOString().split('T')[0])
        .order('stat_date', { ascending: true });

      if (error) throw error;

      return (data || []).map(item => ({
        date: item.stat_date,
        revenue: Number(item.total_revenue),
        fees: Number(item.platform_fees),
      })) as RevenueData[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook: Get activity data for charts
export function useActivityData(days: number = 30) {
  return useQuery({
    queryKey: ['activity-data', days],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('platform_stats')
        .select('stat_date, total_jobs, total_proposals, total_contracts')
        .gte('stat_date', startDate.toISOString().split('T')[0])
        .lte('stat_date', endDate.toISOString().split('T')[0])
        .order('stat_date', { ascending: true });

      if (error) throw error;

      return (data || []).map(item => ({
        date: item.stat_date,
        jobs: item.total_jobs,
        proposals: item.total_proposals,
        contracts: item.total_contracts,
      })) as ActivityData[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Hook: Get current platform overview
export function usePlatformOverview() {
  return useQuery({
    queryKey: ['platform-overview'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('platform_stats')
        .select('*')
        .eq('stat_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data as PlatformStats | null;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook: Track page view
export function usePageView(pageName: string, userId?: string) {
  return useQuery({
    queryKey: ['page-view', pageName, userId],
    queryFn: async () => {
      await trackEvent('page_view', { page: pageName }, userId);
      return true;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

// Utility: Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Utility: Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Utility: Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Utility: Get date range labels
export function getDateRangeLabels(days: number): string[] {
  const labels: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  return labels;
}
