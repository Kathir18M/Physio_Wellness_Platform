/**
 * Authentication and User API service.
 */

import { apiClient } from "@/lib/api-client";
import {
  AuthActionResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  TokenResponse,
  User,
  UserUpdatePayload,
  VerifyEmailPayload,
} from "@/types/auth";

export const authService = {
  /** Register a new user */
  register: (payload: RegisterPayload) =>
    apiClient.post<TokenResponse>("/api/v1/auth/register", payload),

  /** Login user with email & password */
  login: (payload: LoginPayload) =>
    apiClient.post<TokenResponse>("/api/v1/auth/login", payload),

  /** Refresh access token using stored refresh token */
  refresh: (refreshToken: string) =>
    apiClient.post<TokenResponse>("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    }),

  /** Logout current user */
  logout: (refreshToken?: string) =>
    apiClient.post<AuthActionResponse>("/api/v1/auth/logout", {
      refresh_token: refreshToken,
    }),

  /** Request password reset email */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<AuthActionResponse>("/api/v1/auth/forgot-password", payload),

  /** Reset password using token */
  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<AuthActionResponse>("/api/v1/auth/reset-password", payload),

  /** Verify email address */
  verifyEmail: (payload: VerifyEmailPayload) =>
    apiClient.post<AuthActionResponse>("/api/v1/auth/verify-email", payload),

  /** Fetch current user profile */
  getCurrentUser: () => apiClient.get<User>("/api/v1/users/me"),

  /** Update current user profile */
  updateProfile: (payload: UserUpdatePayload) =>
    apiClient.patch<User>("/api/v1/users/me", payload),
};
