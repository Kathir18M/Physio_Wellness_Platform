/**
 * TypeScript types for Appointments, Clinics, and Therapists.
 */

import { User } from "@/types/auth";

export type AppointmentType = "ONLINE" | "CLINIC";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TherapistAvailability {
  id: string;
  therapist_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_available: boolean;
}

export interface TherapistProfile {
  id: string;
  user_id: string;
  clinic_id?: string | null;
  bio?: string | null;
  specialties?: string | null;
  is_accepting_patients: boolean;
  user?: User | null;
  clinic?: Clinic | null;
  availabilities?: TherapistAvailability[];
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface AppointmentCreatePayload {
  therapist_id: string;
  clinic_id?: string | null;
  appointment_type: AppointmentType;
  start_time: string;
  notes?: string;
}

export interface AppointmentUpdatePayload {
  start_time?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export interface Appointment {
  id: string;
  patient_id: string;
  therapist_id: string;
  clinic_id?: string | null;
  appointment_type: AppointmentType;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  patient?: User | null;
  therapist?: TherapistProfile | null;
  clinic?: Clinic | null;
}
