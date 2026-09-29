"""
Auth domain business logic service.
"""

from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_opaque_token,
    hash_password,
    verify_password,
)
from app.domains.auth.models import TokenType
from app.domains.auth.repository import AuthRepository
from app.domains.auth.schemas import (
    AuthActionResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.domains.users.models import User
from app.domains.users.repository import UserRepository
from app.domains.users.schemas import UserRead
from app.shared.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
)

logger = get_logger(__name__)


def _hash_token(token_str: str) -> str:
    """Helper to compute SHA256 digest of refresh tokens before storing in DB."""
    return hashlib.sha256(token_str.encode("utf-8")).hexdigest()


class AuthService:
    """Business logic service for Authentication and Session lifecycle."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.auth_repo = AuthRepository(db)

    async def register(self, req: RegisterRequest) -> TokenResponse:
        """Register a new user account and generate initial tokens."""
        existing_email = await self.user_repo.get_by_email(req.email)
        if existing_email is not None:
            raise ConflictException("An account with this email already exists.")

        if req.phone:
            existing_phone = await self.user_repo.get_by_phone(req.phone)
            if existing_phone is not None:
                raise ConflictException("An account with this phone number already exists.")

        hashed_pwd = hash_password(req.password)

        user = await self.user_repo.create(
            email=req.email,
            password_hash=hashed_pwd,
            role=req.role,
            phone=req.phone,
            first_name=req.first_name,
            last_name=req.last_name,
        )

        return await self._generate_auth_tokens(user)

    async def login(self, req: LoginRequest) -> TokenResponse:
        """Authenticate user by email & password and return token pair."""
        user = await self.user_repo.get_by_email(req.email)
        if user is None or not verify_password(req.password, user.password_hash):
            raise ForbiddenException("Invalid credentials.")

        if not user.is_active:
            raise ForbiddenException("Account is disabled. Please contact support.")

        return await self._generate_auth_tokens(user)

    async def refresh_tokens(self, refresh_token_str: str) -> TokenResponse:
        """Exchange a valid refresh token for a fresh token pair."""
        payload = decode_token(refresh_token_str)
        if payload.get("type") != "refresh":
            raise ForbiddenException("Invalid token type for refresh.")

        sub = payload.get("sub")
        if not sub:
            raise ForbiddenException("Invalid token payload.")

        token_hash = _hash_token(refresh_token_str)
        token_record = await self.auth_repo.get_refresh_token(token_hash)
        if token_record is None or token_record.is_revoked:
            raise ForbiddenException("Refresh token has been revoked or is invalid.")

        now = datetime.now(timezone.utc)
        if token_record.expires_at < now:
            raise ForbiddenException("Refresh token has expired.")

        user = await self.user_repo.get_by_id(uuid.UUID(sub))
        if user is None or not user.is_active:
            raise ForbiddenException("User account not found or disabled.")

        # Revoke used refresh token (refresh token rotation)
        await self.auth_repo.revoke_refresh_token(token_hash)

        return await self._generate_auth_tokens(user)

    async def logout(self, refresh_token_str: str | None, user_id: uuid.UUID) -> AuthActionResponse:
        """Revoke refresh token session."""
        if refresh_token_str:
            token_hash = _hash_token(refresh_token_str)
            await self.auth_repo.revoke_refresh_token(token_hash)
        else:
            await self.auth_repo.revoke_all_user_refresh_tokens(user_id)

        return AuthActionResponse(message="Successfully logged out.")

    async def forgot_password(self, req: ForgotPasswordRequest) -> AuthActionResponse:
        """Generate a password reset token for the given user email."""
        user = await self.user_repo.get_by_email(req.email)
        if user is None:
            # Do not reveal whether user exists for security
            return AuthActionResponse(
                message="If an account exists for this email, password reset instructions have been sent."
            )

        token = generate_opaque_token()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        await self.auth_repo.create_auth_token(
            user_id=user.id,
            token=token,
            token_type=TokenType.PASSWORD_RESET,
            expires_at=expires_at,
        )

        logger.info("Password reset token generated for user_id=%s", user.id)
        return AuthActionResponse(
            message="Password reset token generated successfully.",
            token=token,  # Exposed foundation token
        )

    async def reset_password(self, req: ResetPasswordRequest) -> AuthActionResponse:
        """Reset user password using a valid reset token."""
        auth_token = await self.auth_repo.get_auth_token(
            token=req.token,
            token_type=TokenType.PASSWORD_RESET,
        )
        if auth_token is None:
            raise BadRequestException("Invalid or expired password reset token.")

        if auth_token.expires_at < datetime.now(timezone.utc):
            raise BadRequestException("Password reset token has expired.")

        user = await self.user_repo.get_by_id(auth_token.user_id)
        if user is None:
            raise NotFoundException("User not found.")

        # Update password hash
        new_hash = hash_password(req.new_password)
        await self.user_repo.update(user, {"password_hash": new_hash})

        # Mark reset token used & revoke all sessions for security
        await self.auth_repo.mark_auth_token_used(auth_token.id)
        await self.auth_repo.revoke_all_user_refresh_tokens(user.id)

        return AuthActionResponse(message="Password reset successfully. Please log in with your new password.")

    async def verify_email(self, req: VerifyEmailRequest) -> AuthActionResponse:
        """Verify user email using verification token."""
        auth_token = await self.auth_repo.get_auth_token(
            token=req.token,
            token_type=TokenType.EMAIL_VERIFICATION,
        )
        if auth_token is None:
            raise BadRequestException("Invalid or expired email verification token.")

        if auth_token.expires_at < datetime.now(timezone.utc):
            raise BadRequestException("Email verification token has expired.")

        user = await self.user_repo.get_by_id(auth_token.user_id)
        if user is None:
            raise NotFoundException("User not found.")

        await self.user_repo.update(user, {"is_verified": True})
        await self.auth_repo.mark_auth_token_used(auth_token.id)

        return AuthActionResponse(message="Email verified successfully.")

    async def _generate_auth_tokens(self, user: User) -> TokenResponse:
        """Internal helper to create access/refresh token pair and store refresh token in DB."""
        access_token = create_access_token(subject=user.id, role=user.role.value)
        refresh_token_str, expires_at = create_refresh_token(subject=user.id)

        token_hash = _hash_token(refresh_token_str)
        await self.auth_repo.create_refresh_token(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserRead.model_validate(user),
        )
