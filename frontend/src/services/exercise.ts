/**
 * Exercise Library and Treatment Plan API service.
 */

import { apiClient } from "@/lib/api-client";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  body_part: string;
  difficulty: string;
  duration?: string;
  sets: number;
  repetitions: string;
  instructions?: string;
  precautions?: string;
  video_url?: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlanExerciseItem {
  id: string;
  treatment_plan_id: string;
  exercise_id: string;
  sets: number;
  repetitions: string;
  duration?: string;
  frequency?: string;
  order_index: number;
  exercise?: Exercise;
}

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  therapist_id: string;
  title: string;
  goal?: string;
  duration: string;
  frequency: string;
  start_date?: string;
  end_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  exercises?: TreatmentPlanExerciseItem[];
}

export interface TreatmentPlanCreatePayload {
  patient_id: string;
  title: string;
  goal?: string;
  duration?: string;
  frequency?: string;
  notes?: string;
  exercises: {
    exercise_id: string;
    sets?: number;
    repetitions?: string;
    duration?: string;
    frequency?: string;
    order_index?: number;
  }[];
}

export interface ExerciseCompletionPayload {
  notes?: string;
  treatment_plan_id?: string;
}

export const exerciseService = {
  /** Fetch exercise library items */
  getExercises: (params?: { body_part?: string; difficulty?: string }) =>
    apiClient.get<Exercise[]>("/api/v1/exercises", { params }),

  /** Fetch exercise by ID */
  getExerciseById: (id: string) => apiClient.get<Exercise>(`/api/v1/exercises/${id}`),

  /** Create new exercise (Therapist/Admin) */
  createExercise: (payload: Partial<Exercise>) =>
    apiClient.post<Exercise>("/api/v1/exercises", payload),

  /** Log exercise session completion */
  logCompletion: (id: string, payload: ExerciseCompletionPayload) =>
    apiClient.post<{ id: string; completed_at: string }>(`/api/v1/exercises/${id}/complete`, payload),

  /** Create treatment plan (Therapist/Admin) */
  createTreatmentPlan: (payload: TreatmentPlanCreatePayload) =>
    apiClient.post<TreatmentPlan>("/api/v1/treatment-plans", payload),

  /** Get my treatment plans */
  getMyTreatmentPlans: () => apiClient.get<TreatmentPlan[]>("/api/v1/treatment-plans/me"),

  /** Get treatment plan by ID */
  getTreatmentPlanById: (id: string) =>
    apiClient.get<TreatmentPlan>(`/api/v1/treatment-plans/${id}`),

  /** Update treatment plan status or notes */
  updateTreatmentPlan: (id: string, payload: Partial<TreatmentPlan>) =>
    apiClient.patch<TreatmentPlan>(`/api/v1/treatment-plans/${id}`, payload),
};
