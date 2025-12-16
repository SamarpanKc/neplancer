import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

// ==========================================
// FETCH NOTIFICATIONS
// ==========================================

export function useNotifications(userId: string | undefined, unreadOnly: boolean = false) {
  return useQuery({
    queryKey: ['notifications', userId, unreadOnly],
    queryFn: async () => {
      if (!userId) return [];

      const response = await fetch(
        `/api/notifications?userId=${userId}&unreadOnly=${unreadOnly}&limit=50`
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notifications');
      }
      
      const data = await response.json();
      return data.notifications as Notification[];
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// ==========================================
// UNREAD COUNT
// ==========================================

export function useUnreadNotificationsCount(userId: string | undefined) {
  const { data: notifications = [] } = useNotifications(userId, true);
  return notifications.length;
}

// ==========================================
// MARK AS READ MUTATION
// ==========================================

export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      notificationIds, 
      markAllAsRead 
    }: { 
      userId: string; 
      notificationIds?: string[]; 
      markAllAsRead?: boolean;
    }) => {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notificationIds, markAllAsRead }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark notifications as read');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ==========================================
// DELETE NOTIFICATION MUTATION
// ==========================================

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      notificationId, 
      deleteAll 
    }: { 
      userId: string; 
      notificationId?: string; 
      deleteAll?: boolean;
    }) => {
      const params = new URLSearchParams({ userId });
      if (notificationId) params.append('id', notificationId);
      if (deleteAll) params.append('deleteAll', 'true');

      const response = await fetch(`/api/notifications?${params.toString()}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete notification');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.userId] });
      toast.success('Notification deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ==========================================
// REAL-TIME NOTIFICATIONS
// ==========================================

export function useRealtimeNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Invalidate queries to refetch
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
          
          // Show toast notification
          const notification = payload.new as Notification;
          toast.info(notification.title, {
            description: notification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
