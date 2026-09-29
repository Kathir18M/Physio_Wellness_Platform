"""
User domain business logic service.
"""

from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.users.models import User
from app.domains.users.repository import UserRepository
from app.domains.users.schemas import UserUpdate
from app.shared.exceptions import ConflictException, NotFoundException


class UserService:
    """Business logic service for User management."""

    def __init__(self, db: AsyncSession) -> None:
        self.user_repo = UserRepository(db)

    async def get_user_by_id(self, user_id: uuid.UUID) -> User:
        """Retrieve user by UUID or raise NotFoundException."""
        user = await self.user_repo.get_by_id(user_id)
        if user is None:
            raise NotFoundException("User not found.")
        return user

    async def update_user_profile(
        self,
        user_id: uuid.UUID,
        update_data: UserUpdate,
    ) -> User:
        """Update current user profile attributes."""
        user = await self.get_user_by_id(user_id)

        update_dict = update_data.model_dump(exclude_unset=True)
        if "phone" in update_dict and update_dict["phone"] is not None:
            existing = await self.user_repo.get_by_phone(update_dict["phone"])
            if existing and existing.id != user.id:
                raise ConflictException("Phone number is already registered to another account.")

        updated_user = await self.user_repo.update(user, update_dict)
        return updated_user
