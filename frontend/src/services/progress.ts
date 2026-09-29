/**
 * Patient Progress Tracking API service.
 */

import { apiClient } from "@/lib/api-client";

export interface ProgressRecordCreatePayload {
  pain_score: number;
  weight?: number;
  mobility_score?: number;
  strength_score?: number;
  custom_measurements?: string;
  notes?: string;
}

export interface ProgressRecord {
  id: string;
  patient_id: string;
  pain_score: number;
  weight?: number;
  mobility_score?: number;
  strength_score?: number;
  custom_measurements?: string;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export interface GoalProgress {
  id: string;
  patient_id: string;
  goal_title: string;
  target_value: number;
  current_value: number;
  unit: string;
  is_achieved: boolean;
  target_date?: string;
}

export interface ProgressSummary {
  latest_pain_score: number;
  avg_pain_score_weekly: number;
  exercise_completion_rate: number;
  appointment_attendance_rate: number;
  mobility_improvement: string;
  streak_days: number;
  goals: GoalProgress[];
}

export const progressService = {
  /** Log daily progress record */
  createRecord: (payload: ProgressRecordCreatePayload) =>
    apiClient.post<ProgressRecord>("/api/v1/progress", payload),

  /** Get latest progress summary & goals */
  getMyProgress: () => apiClient.get<ProgressSummary>("/api/v1/progress/me"),

  /** Get historical progress records */
  getHistory: () => apiClient.get<ProgressRecord[]>("/api/v1/progress/me/history"),

  /** Get weekly summary metrics */
  getSummary: () => apiClient.get<ProgressSummary>("/api/v1/progress/me/summary"),
};
