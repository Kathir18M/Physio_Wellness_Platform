/**
 * Notification API service.
 */

import { apiClient } from "@/lib/api-client";

export type NotificationChannel = "IN_APP" | "EMAIL" | "WHATSAPP";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "READ";
export type NotificationEventType =
  | "APPOINTMENT_BOOKED"
  | "APPOINTMENT_REMINDER"
  | "APPOINTMENT_CANCELLED"
  | "PAYMENT_SUCCESSFUL"
  | "PAYMENT_FAILED"
  | "TREATMENT_PLAN_CREATED"
  | "EXERCISE_ASSIGNED"
  | "EXERCISE_REMINDER"
  | "PROGRESS_REPORT_AVAILABLE";

export interface NotificationItem {
  id: string;
  user_id: string;
  event_type: NotificationEventType;
  channel: NotificationChannel;
  title: string;
  body: string;
  status: NotificationStatus;
  deduplication_key?: string;
  retry_count: number;
  max_retries: number;
  error_message?: string;
  metadata_json?: Record<string, any>;
  sent_at?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export const notificationService = {
  /** Fetch patient's notifications */
  getMyNotifications: (unreadOnly = false, limit = 50, offset = 0) =>
    apiClient.get<NotificationItem[]>(
      `/api/v1/notifications/me?unread_only=${unreadOnly}&limit=${limit}&offset=${offset}`
    ),

  /** Get total unread count */
  getUnreadCount: () =>
    apiClient.get<UnreadCountResponse>("/api/v1/notifications/unread-count"),

  /** Mark single notification as read */
  markAsRead: (id: string) =>
    apiClient.patch<NotificationItem>(`/api/v1/notifications/${id}/read`),

  /** Mark all notifications as read */
  markAllAsRead: () =>
    apiClient.post<{ updated_count: number; message: string }>(
      "/api/v1/notifications/mark-all-read"
    ),
};
