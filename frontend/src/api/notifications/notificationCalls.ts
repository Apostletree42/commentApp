import axiosInstance from '../config/axiosInstance';
import { Comment } from '../comments/commentCalls';
import { User } from '../auth/authCalls';

export interface Notification {
  id: string;
  createdAt: string;
  isRead: boolean;
  recipient: User;
  comment: Comment;
}

export interface NotificationQueryParams {
  limit?: number;
  page?: number;
  isRead?: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}

export const NOTIFICATION_CALLS = {
  getNotifications: {
    getKey: (params: NotificationQueryParams = {}) => ['notifications', 'list', params],
    call: async (params: NotificationQueryParams = {}): Promise<NotificationResponse> => {
      const response = await axiosInstance.get<NotificationResponse>('/notifications', {
        params,
      });
      return response.data;
    },
  },

  markAsRead: {
    getKey: (id: string) => ['notifications', id, 'read'],
    call: async (id: string): Promise<Notification> => {
      const response = await axiosInstance.post<Notification>(`/notifications/${id}/read`);
      return response.data;
    },
  },

  markAllAsRead: {
    getKey: () => ['notifications', 'read-all'],
    call: async (): Promise<void> => {
      await axiosInstance.post('/notifications/read-all');
    },
  },
};