"""
Therapist service layer handling business logic and access authorization.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.therapists.models import TherapistProfile
from app.domains.therapists.repository import TherapistRepository
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException, NotFoundException


class TherapistService:
    """Business logic for therapist operations and patient access authorization."""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = TherapistRepository(db)

    async def get_or_create_therapist_profile(self, user: User) -> TherapistProfile:
        """Fetch or automatically initialize a therapist profile for a THERAPIST user."""
        profile = await self.repository.get_profile_by_user_id(user.id)
        if profile is None:
            if user.role not in (UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN):
                raise ForbiddenException("Only therapists or admins have practitioner profiles.")
            profile = await self.repository.create_profile(user_id=user.id)
        return profile

    async def get_assigned_patients(
        self,
        current_user: User,
        search_query: str | None = None,
    ) -> Sequence[dict]:
        """Retrieve patients assigned to the current therapist."""
        profile = await self.get_or_create_therapist_profile(current_user)
        return await self.repository.get_assigned_patients(
            therapist_id=profile.id,
            search_query=search_query,
        )

    async def get_assigned_patient_detail(
        self,
        current_user: User,
        patient_id: uuid.UUID,
    ) -> dict:
        """Retrieve patient details if assigned to current therapist or if admin."""
        is_admin = current_user.role in (UserRole.ADMIN, UserRole.SUPER_ADMIN)
        profile = await self.get_or_create_therapist_profile(current_user)

        patient_data = await self.repository.get_assigned_patient_detail(
            therapist_id=profile.id,
            patient_id=patient_id,
            is_admin=is_admin,
        )
        if patient_data is None:
            raise NotFoundException(f"Patient '{patient_id}' not found or not assigned to therapist.")
        return patient_data
