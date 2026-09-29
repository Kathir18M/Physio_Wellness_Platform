/**
 * Admin API service.
 */

import { apiClient } from "@/lib/api-client";
import { User } from "@/types/auth";

export interface AdminMetrics {
  total_users: number;
  active_patients: number;
  active_therapists: number;
  total_appointments: number;
  completed_appointments: number;
  program_enrollments: number;
  revenue: number;
  active_subscriptions: number;
}

export interface AuditLogItem {
  id: string;
  admin_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface AdminReportSummary {
  metrics: AdminMetrics;
  recent_audit_logs: AuditLogItem[];
  system_health: string;
}

export const adminService = {
  /** Get dashboard aggregated metrics */
  getMetrics: () =>
    apiClient.get<AdminMetrics>("/api/v1/admin/dashboard/metrics"),

  /** List users with search, role, status filters, and pagination */
  getUsers: (search?: string, role?: string, isActive?: boolean, limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (isActive !== undefined) params.append("is_active", String(isActive));
    params.append("limit", String(limit));
    params.append("offset", String(offset));
    return apiClient.get<User[]>(`/api/v1/admin/users?${params.toString()}`);
  },

  /** Update user role (Super Admin only) */
  updateUserRole: (userId: string, role: string) =>
    apiClient.patch<User>(`/api/v1/admin/users/${userId}/role`, { role }),

  /** Toggle user active status */
  updateUserStatus: (userId: string, isActive: boolean) =>
    apiClient.patch<User>(`/api/v1/admin/users/${userId}/status`, { is_active: isActive }),

  /** Delete user account (Super Admin only) */
  deleteUser: (userId: string) =>
    apiClient.delete<{ message: string }>(`/api/v1/admin/users/${userId}`),

  /** Get audit logs */
  getAuditLogs: (limit = 50, offset = 0) =>
    apiClient.get<AuditLogItem[]>(`/api/v1/admin/audit-logs?limit=${limit}&offset=${offset}`),

  /** Get summary reports */
  getReports: () =>
    apiClient.get<AdminReportSummary>("/api/v1/admin/reports"),
};
