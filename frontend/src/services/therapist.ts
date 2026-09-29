/**
 * Therapist Portal API service.
 */

import { apiClient } from "@/lib/api-client";
import { Appointment } from "@/types/appointment";
import { User } from "@/types/auth";

export interface TherapistPatient {
  id: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  total_appointments: number;
  last_appointment?: string;
}

export interface TherapistPatientDetail {
  patient: User;
  appointments: Appointment[];
  total_appointments: number;
}

export interface TherapistProfile {
  id: string;
  user_id: string;
  clinic_id?: string;
  bio?: string;
  specialties?: string;
  is_accepting_patients: boolean;
  user?: User;
}

export const therapistService = {
  /** Fetch current practitioner profile */
  getProfile: () => apiClient.get<TherapistProfile>("/api/v1/therapists/me"),

  /** Fetch assigned patients roster */
  getPatients: (searchQuery?: string) =>
    apiClient.get<TherapistPatient[]>("/api/v1/therapists/patients", {
      params: { q: searchQuery },
    }),

  /** Fetch detailed patient profile and appointment history */
  getPatientDetail: (id: string) =>
    apiClient.get<TherapistPatientDetail>(`/api/v1/therapists/patients/${id}`),
};
