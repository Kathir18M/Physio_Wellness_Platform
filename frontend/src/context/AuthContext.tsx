"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { LoginPayload, RegisterPayload, TokenResponse, User, UserRole } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<TokenResponse>;
  register: (payload: RegisterPayload) => Promise<TokenResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on startup
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          // Token invalid or expired — attempt refresh or clear session
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            try {
              const tokens = await authService.refresh(refreshToken);
              localStorage.setItem("access_token", tokens.access_token);
              localStorage.setItem("refresh_token", tokens.refresh_token);
              setUser(tokens.user);
            } catch {
              clearSession();
            }
          } else {
            clearSession();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const clearSession = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const handleLogin = async (payload: LoginPayload): Promise<TokenResponse> => {
    const tokens = await authService.login(payload);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    setUser(tokens.user);
    return tokens;
  };

  const handleRegister = async (payload: RegisterPayload): Promise<TokenResponse> => {
    const tokens = await authService.register(payload);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    setUser(tokens.user);
    return tokens;
  };

  const handleLogout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refresh_token") ?? undefined;
    try {
      await authService.logout(refreshToken);
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
    }
  };

  const refreshUser = async (): Promise<User | null> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      return null;
    }
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
