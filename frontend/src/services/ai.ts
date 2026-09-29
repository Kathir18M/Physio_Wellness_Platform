/**
 * AI Integration API service.
 */

import { apiClient } from "@/lib/api-client";

export interface PostureAnalysisResult {
  alignment_score: number;
  head_tilt_angle_deg: number;
  shoulder_asymmetry_deg: number;
  findings: string[];
  recommendations: string[];
  clinical_support_note: string;
  disclaimer: string;
  prompt_version: string;
}

export interface ExerciseAssistantResult {
  response_text: string;
  safety_guidance: string;
  disclaimer: string;
  prompt_version: string;
}

export interface ProgressSummaryResult {
  weekly_summary: string;
  compliance_score: number;
  key_milestones: string[];
  disclaimer: string;
  prompt_version: string;
}

export const aiService = {
  /** Request AI Posture & Movement Analysis */
  analyzePosture: (landmarks: Record<string, any>, metrics?: Record<string, any>) =>
    apiClient.post<PostureAnalysisResult>("/api/v1/ai/posture-analysis", {
      landmarks,
      movement_metrics: metrics,
    }),

  /** Ask AI Exercise Assistant */
  askExerciseAssistant: (patientQuestion: string, treatmentPlanId?: string) =>
    apiClient.post<ExerciseAssistantResult>("/api/v1/ai/exercise-assistant", {
      patient_question: patientQuestion,
      treatment_plan_id: treatmentPlanId,
    }),

  /** Generate AI Weekly Progress Summary */
  generateProgressSummary: (days = 7) =>
    apiClient.post<ProgressSummaryResult>("/api/v1/ai/progress-summary", {
      days,
    }),
};
