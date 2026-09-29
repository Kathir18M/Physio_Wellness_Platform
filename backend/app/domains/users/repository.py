"""
User repository for database interactions.
"""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.users.models import User, UserRole


class UserRepository:
    """Data access repository for User entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        """Fetch user by primary key UUID."""
        stmt = select(User).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        """Fetch user by unique email address (case-insensitive search)."""
        stmt = select(User).where(User.email == email.lower())
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_phone(self, phone: str) -> User | None:
        """Fetch user by phone number."""
        stmt = select(User).where(User.phone == phone)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(
        self,
        email: str,
        password_hash: str,
        role: UserRole = UserRole.PATIENT,
        phone: str | None = None,
        first_name: str | None = None,
        last_name: str | None = None,
        is_verified: bool = False,
    ) -> User:
        """Instantiate and persist a new User."""
        user = User(
            email=email.lower(),
            password_hash=password_hash,
            role=role,
            phone=phone,
            first_name=first_name,
            last_name=last_name,
            is_verified=is_verified,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def update(self, user: User, update_dict: dict[str, Any]) -> User:
        """Update fields on a User entity."""
        for key, value in update_dict.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        await self.db.flush()
        return user
