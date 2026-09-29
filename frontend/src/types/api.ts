/**
 * Shared TypeScript interfaces matching the backend response schemas.
 */

/** GET /health response */
export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  timestamp: string;
}

/** Machine-readable error detail */
export interface ErrorDetail {
  code: string;
  message: string;
}

/** Standard error envelope */
export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}

/** Standard success envelope */
export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T | null;
}

/** Generic paginated response (future use) */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
