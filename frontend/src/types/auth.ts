/**
 * TypeScript types for Authentication and User management.
 */

export type UserRole = "PATIENT" | "THERAPIST" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthActionResponse {
  success: boolean;
  message: string;
  token?: string | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface UserUpdatePayload {
  phone?: string;
  first_name?: string;
  last_name?: string;
}
