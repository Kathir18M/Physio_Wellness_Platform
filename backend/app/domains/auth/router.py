"""
Authentication API endpoints router.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.domains.auth.schemas import (
    AuthActionResponse,
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.domains.auth.service import AuthService
from app.domains.users.models import User
from app.shared.dependencies.auth import CurrentUser, security_scheme
from app.shared.dependencies.database import DbSession

optional_security = HTTPBearer(auto_error=False)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register(
    req: RegisterRequest,
    db: DbSession,
) -> TokenResponse:
    """Create a new user account and return authentication tokens."""
    service = AuthService(db)
    return await service.register(req)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain JWT tokens",
)
async def login(
    req: LoginRequest,
    db: DbSession,
) -> TokenResponse:
    """Validate credentials and return access and refresh tokens."""
    service = AuthService(db)
    return await service.login(req)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token using refresh token",
)
async def refresh(
    req: RefreshRequest,
    db: DbSession,
) -> TokenResponse:
    """Exchange a valid refresh token for a new token pair."""
    service = AuthService(db)
    return await service.refresh_tokens(req.refresh_token)


@router.post(
    "/logout",
    response_model=AuthActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Logout user and revoke session token",
)
async def logout(
    req: LogoutRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> AuthActionResponse:
    """Revoke the current session refresh token."""
    service = AuthService(db)
    return await service.logout(req.refresh_token, current_user.id)


@router.post(
    "/forgot-password",
    response_model=AuthActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Request password reset instructions",
)
async def forgot_password(
    req: ForgotPasswordRequest,
    db: DbSession,
) -> AuthActionResponse:
    """Generate a password reset token for the requested account."""
    service = AuthService(db)
    return await service.forgot_password(req)


@router.post(
    "/reset-password",
    response_model=AuthActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Reset password using reset token",
)
async def reset_password(
    req: ResetPasswordRequest,
    db: DbSession,
) -> AuthActionResponse:
    """Set a new password using a valid reset token."""
    service = AuthService(db)
    return await service.reset_password(req)


@router.post(
    "/verify-email",
    response_model=AuthActionResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify account email address",
)
async def verify_email(
    req: VerifyEmailRequest,
    db: DbSession,
) -> AuthActionResponse:
    """Confirm user email address using verification token."""
    service = AuthService(db)
    return await service.verify_email(req)
