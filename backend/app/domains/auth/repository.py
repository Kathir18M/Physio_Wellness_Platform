"""
Auth repository for database interactions (refresh tokens, verification/reset tokens).
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.auth.models import AuthToken, RefreshToken, TokenType


class AuthRepository:
    """Data access repository for authentication token entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ── Refresh Tokens ──────────────────────────────────────────────
    async def create_refresh_token(
        self,
        user_id: uuid.UUID,
        token_hash: str,
        expires_at: datetime,
    ) -> RefreshToken:
        """Store a new refresh token record."""
        token_record = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        self.db.add(token_record)
        await self.db.flush()
        return token_record

    async def get_refresh_token(self, token_hash: str) -> RefreshToken | None:
        """Fetch active refresh token by hash."""
        stmt = select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.is_revoked.is_(False),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def revoke_refresh_token(self, token_hash: str) -> None:
        """Mark a specific refresh token as revoked."""
        stmt = (
            update(RefreshToken)
            .where(RefreshToken.token_hash == token_hash)
            .values(is_revoked=True)
        )
        await self.db.execute(stmt)

    async def revoke_all_user_refresh_tokens(self, user_id: uuid.UUID) -> None:
        """Revoke all refresh tokens for a user (e.g. password reset / logout all)."""
        stmt = (
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id)
            .values(is_revoked=True)
        )
        await self.db.execute(stmt)

    # ── Auth Verification & Reset Tokens ────────────────────────────
    async def create_auth_token(
        self,
        user_id: uuid.UUID,
        token: str,
        token_type: TokenType,
        expires_at: datetime,
    ) -> AuthToken:
        """Create a single-use email verification or password reset token."""
        auth_token = AuthToken(
            user_id=user_id,
            token=token,
            type=token_type,
            expires_at=expires_at,
        )
        self.db.add(auth_token)
        await self.db.flush()
        return auth_token

    async def get_auth_token(
        self,
        token: str,
        token_type: TokenType,
    ) -> AuthToken | None:
        """Fetch unused and unexpired auth token."""
        stmt = select(AuthToken).where(
            AuthToken.token == token,
            AuthToken.type == token_type,
            AuthToken.is_used.is_(False),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def mark_auth_token_used(self, token_id: uuid.UUID) -> None:
        """Mark a verification/reset token as consumed."""
        stmt = (
            update(AuthToken)
            .where(AuthToken.id == token_id)
            .values(is_used=True)
        )
        await self.db.execute(stmt)
