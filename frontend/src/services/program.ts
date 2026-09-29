/**
 * Programs domain API client service.
 */

import { apiClient } from "@/lib/api-client";
import { Program, ProgramCreatePayload } from "@/types/program";

export const programService = {
  /** Fetch all active programs, optionally filtered by category */
  getPrograms: (category?: string) =>
    apiClient.get<Program[]>("/api/v1/programs", {
      params: category ? { category } : undefined,
    }),

  /** Fetch active program details by slug */
  getProgramBySlug: (slug: string) =>
    apiClient.get<Program>(`/api/v1/programs/${slug}`),

  /** Create a new program (Admin only) */
  createProgram: (payload: ProgramCreatePayload) =>
    apiClient.post<Program>("/api/v1/programs", payload),

  /** Delete a program (Admin only) */
  deleteProgram: (id: string) =>
    apiClient.delete<void>(`/api/v1/programs/${id}`),
};
