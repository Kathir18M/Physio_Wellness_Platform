"""
Pydantic schemas for Auth domain.
"""

from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field

from app.domains.users.models import UserRole
from app.domains.users.schemas import UserRead


class RegisterRequest(BaseModel):
    """Payload for user registration."""

    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    phone: str | None = Field(default=None, max_length=50)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    role: UserRole = Field(default=UserRole.PATIENT, description="PATIENT, THERAPIST, ADMIN, SUPER_ADMIN")


class LoginRequest(BaseModel):
    """Payload for user login."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response payload containing JWT access token & refresh token."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # Access token lifespan in seconds
    user: UserRead


class RefreshRequest(BaseModel):
    """Payload for refreshing an expired access token."""

    refresh_token: str


class LogoutRequest(BaseModel):
    """Payload for logging out and revoking refresh token."""

    refresh_token: str | None = None


class ForgotPasswordRequest(BaseModel):
    """Payload for requesting a password reset email."""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Payload for resetting password with a reset token."""

    token: str
    new_password: str = Field(..., min_length=8)


class VerifyEmailRequest(BaseModel):
    """Payload for verifying email with token."""

    token: str


class AuthActionResponse(BaseModel):
    """Generic response for auth mutations."""

    success: bool = True
    message: str
    token: str | None = None  # Returned for email verification or password reset foundation
