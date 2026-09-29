/**
 * Assessment API service.
 */

import { apiClient } from "@/lib/api-client";

export interface AssessmentCreatePayload {
  pain_area: string;
  pain_level: number;
  pain_duration: string;
  previous_injuries?: string;
  medical_history?: string;
  occupation?: string;
  activity_level?: string;
  sleep_quality?: string;
  lifestyle?: string;
  goals?: string;
  additional_notes?: string;
  therapist_id?: string;
}

export interface AssessmentTherapistUpdatePayload {
  mobility_score?: number;
  strength_score?: number;
  flexibility_score?: number;
  posture_score?: number;
  movement_notes?: string;
  clinical_notes?: string;
  recommendations?: string;
  status?: string;
}

export interface Assessment {
  id: string;
  patient_id: string;
  therapist_id?: string;
  status: string;
  pain_area: string;
  pain_level: number;
  pain_duration: string;
  previous_injuries?: string;
  medical_history?: string;
  occupation?: string;
  activity_level?: string;
  sleep_quality?: string;
  lifestyle?: string;
  goals?: string;
  additional_notes?: string;
  mobility_score?: number;
  strength_score?: number;
  flexibility_score?: number;
  posture_score?: number;
  movement_notes?: string;
  clinical_notes?: string;
  recommendations?: string;
  created_at: string;
  updated_at: string;
}

export const assessmentService = {
  /** Submit new health intake assessment */
  createAssessment: (payload: AssessmentCreatePayload) =>
    apiClient.post<Assessment>("/api/v1/assessments", payload),

  /** Get my submitted assessments */
  getMyAssessments: () => apiClient.get<Assessment[]>("/api/v1/assessments/me"),

  /** Get assessment by ID */
  getAssessmentById: (id: string) =>
    apiClient.get<Assessment>(`/api/v1/assessments/${id}`),

  /** Update clinical evaluation scores (Therapist/Admin) */
  updateClinicalEvaluation: (id: string, payload: AssessmentTherapistUpdatePayload) =>
    apiClient.patch<Assessment>(`/api/v1/assessments/${id}`, payload),
};
