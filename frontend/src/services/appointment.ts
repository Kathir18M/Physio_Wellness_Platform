/**
 * Appointments and Clinics API service.
 */

import { apiClient } from "@/lib/api-client";
import {
  Appointment,
  AppointmentCreatePayload,
  AppointmentUpdatePayload,
  Clinic,
  TherapistProfile,
  TimeSlot,
} from "@/types/appointment";

export const appointmentService = {
  /** Fetch clinics list */
  getClinics: () => apiClient.get<Clinic[]>("/api/v1/clinics"),

  /** Fetch active therapists */
  getTherapists: () => apiClient.get<TherapistProfile[]>("/api/v1/therapists"),

  /** Query available time slots for therapist and date YYYY-MM-DD */
  getAvailableSlots: (therapistId: string, dateStr: string) =>
    apiClient.get<TimeSlot[]>("/api/v1/appointments/slots", {
      params: { therapist_id: therapistId, date: dateStr },
    }),

  /** Book new appointment */
  bookAppointment: (payload: AppointmentCreatePayload) =>
    apiClient.post<Appointment>("/api/v1/appointments", payload),

  /** List user's appointments */
  getMyAppointable: () => apiClient.get<Appointment[]>("/api/v1/appointments/me"),

  /** Get appointment details */
  getAppointmentById: (id: string) =>
    apiClient.get<Appointment>(`/api/v1/appointments/${id}`),

  /** Reschedule appointment */
  rescheduleAppointment: (id: string, payload: AppointmentUpdatePayload) =>
    apiClient.patch<Appointment>(`/api/v1/appointments/${id}`, payload),

  /** Cancel appointment */
  cancelAppointment: (id: string) =>
    apiClient.post<Appointment>(`/api/v1/appointments/${id}/cancel`),
};
