/**
 * Health service — wraps the GET /health backend endpoint.
 */

import { apiClient } from "@/lib/api-client";
import type { HealthResponse } from "@/types";

export async function getHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>("/health");
}
