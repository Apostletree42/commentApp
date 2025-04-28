import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  NOTIFICATION_CALLS,
  Notification,
  NotificationQueryParams,
  NotificationResponse,
} from './notificationCalls';

export const useNotifications = (params: NotificationQueryParams = {}, options = {}) => {
  return useQuery<NotificationResponse, Error>({
    queryKey: NOTIFICATION_CALLS.getNotifications.getKey(params),
    queryFn: () => NOTIFICATION_CALLS.getNotifications.call(params),
    ...options
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, string>({
    mutationFn: NOTIFICATION_CALLS.markAsRead.call,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: NOTIFICATION_CALLS.markAllAsRead.call,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
};

// Hook for sse setup
export const useNotificationEvents = () => {
  const queryClient = useQueryClient();

  const setupEventSource = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const eventSource = new EventSource(`/sse/notifications`, {
      withCredentials: true,
    });
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // If we receive new notif, invalidate the old notifs list
        if (data && data.type !== 'connection') {
          queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return eventSource;
  };

  return { setupEventSource };
};