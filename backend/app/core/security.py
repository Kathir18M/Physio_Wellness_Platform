"""
Security module: Password hashing, verification, JWT token generation, and decoding.
"""

from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.logging import get_logger
from app.shared.exceptions import BadRequestException, ForbiddenException

logger = get_logger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Password Hashing ──────────────────────────────────────────────
def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ── Token Generation & Verification ─────────────────────────────
def create_access_token(
    subject: str | uuid.UUID,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a signed JWT access token."""
    now = datetime.now(timezone.utc)
    expires = now + (
        expires_delta
        if expires_delta is not None
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    claims: dict[str, Any] = {
        "sub": str(subject),
        "role": role,
        "type": "access",
        "iss": settings.TOKEN_ISSUER,
        "iat": now.timestamp(),
        "exp": expires.timestamp(),
    }
    return jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(
    subject: str | uuid.UUID,
    expires_delta: timedelta | None = None,
) -> tuple[str, datetime]:
    """Create a signed JWT refresh token along with its expiry datetime."""
    now = datetime.now(timezone.utc)
    expires = now + (
        expires_delta
        if expires_delta is not None
        else timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    claims: dict[str, Any] = {
        "sub": str(subject),
        "type": "refresh",
        "jti": str(uuid.uuid4()),
        "iss": settings.TOKEN_ISSUER,
        "iat": now.timestamp(),
        "exp": expires.timestamp(),
    }
    token = jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, expires


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT token payload."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            issuer=settings.TOKEN_ISSUER,
        )
        return payload
    except JWTError as exc:
        logger.warning("Token decoding failed: %s", exc)
        raise ForbiddenException("Invalid or expired token.") from exc


def generate_opaque_token() -> str:
    """Generate a secure url-safe random token for email verification / password reset."""
    return secrets.token_urlsafe(32)
