"""
Therapist repository for database operations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.appointments.models import Appointment
from app.domains.therapists.models import TherapistAvailability, TherapistProfile
from app.domains.users.models import User


class TherapistRepository:
    """Data access repository for TherapistProfile and TherapistAvailability."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_profile_by_id(self, therapist_id: uuid.UUID) -> TherapistProfile | None:
        """Fetch therapist profile by ID including User, Clinic, and Availabilities."""
        stmt = (
            select(TherapistProfile)
            .options(
                selectinload(TherapistProfile.user),
                selectinload(TherapistProfile.clinic),
                selectinload(TherapistProfile.availabilities),
            )
            .where(TherapistProfile.id == therapist_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_profile_by_user_id(self, user_id: uuid.UUID) -> TherapistProfile | None:
        """Fetch therapist profile by linked user account ID."""
        stmt = (
            select(TherapistProfile)
            .options(
                selectinload(TherapistProfile.user),
                selectinload(TherapistProfile.clinic),
                selectinload(TherapistProfile.availabilities),
            )
            .where(TherapistProfile.user_id == user_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_therapists(
        self,
        clinic_id: uuid.UUID | None = None,
        accepting_only: bool = True,
    ) -> Sequence[TherapistProfile]:
        """List therapist profiles with optional clinic filter."""
        stmt = select(TherapistProfile).options(
            selectinload(TherapistProfile.user),
            selectinload(TherapistProfile.clinic),
            selectinload(TherapistProfile.availabilities),
        )

        if accepting_only:
            stmt = stmt.where(TherapistProfile.is_accepting_patients.is_(True))

        if clinic_id:
            stmt = stmt.where(TherapistProfile.clinic_id == clinic_id)

        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_availabilities_for_day(
        self,
        therapist_id: uuid.UUID,
        day_of_week: int,
    ) -> Sequence[TherapistAvailability]:
        """Fetch working hours for a specific day of the week (0=Monday, 6=Sunday)."""
        stmt = select(TherapistAvailability).where(
            TherapistAvailability.therapist_id == therapist_id,
            TherapistAvailability.day_of_week == day_of_week,
            TherapistAvailability.is_available.is_(True),
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create_profile(
        self,
        user_id: uuid.UUID,
        clinic_id: uuid.UUID | None = None,
        bio: str | None = None,
        specialties: str | None = None,
    ) -> TherapistProfile:
        """Create a therapist profile record."""
        profile = TherapistProfile(
            user_id=user_id,
            clinic_id=clinic_id,
            bio=bio,
            specialties=specialties,
        )
        self.db.add(profile)
        await self.db.flush()
        return await self.get_profile_by_id(profile.id)

    async def create_availability(
        self,
        therapist_id: uuid.UUID,
        day_of_week: int,
        start_time: str,
        end_time: str,
        slot_duration_minutes: int = 45,
    ) -> TherapistAvailability:
        """Create a working hours availability schedule."""
        availability = TherapistAvailability(
            therapist_id=therapist_id,
            day_of_week=day_of_week,
            start_time=start_time,
            end_time=end_time,
            slot_duration_minutes=slot_duration_minutes,
        )
        self.db.add(availability)
        await self.db.flush()
        return availability

    async def get_assigned_patients(
        self,
        therapist_id: uuid.UUID,
        search_query: str | None = None,
    ) -> Sequence[dict]:
        """Fetch distinct patients who have booked appointments with the given therapist."""
        stmt = (
            select(
                User.id,
                User.email,
                User.phone,
                User.role,
                User.is_active,
                User.created_at,
                func.count(Appointment.id).label("total_appointments"),
                func.max(Appointment.start_time).label("last_appointment"),
            )
            .join(Appointment, Appointment.patient_id == User.id)
            .where(Appointment.therapist_id == therapist_id)
            .group_by(User.id)
        )

        if search_query:
            query_filter = f"%{search_query}%"
            stmt = stmt.where(
                or_(
                    User.email.ilike(query_filter),
                    User.phone.ilike(query_filter),
                )
            )

        result = await self.db.execute(stmt)
        rows = result.all()

        return [
            {
                "id": row.id,
                "email": row.email,
                "phone": row.phone,
                "role": row.role,
                "is_active": row.is_active,
                "created_at": row.created_at,
                "total_appointments": row.total_appointments,
                "last_appointment": row.last_appointment,
            }
            for row in rows
        ]

    async def get_assigned_patient_detail(
        self,
        therapist_id: uuid.UUID,
        patient_id: uuid.UUID,
        is_admin: bool = False,
    ) -> dict | None:
        """Fetch patient details and appointment history for an assigned patient."""
        # 1. Verify user exists
        user_stmt = select(User).where(User.id == patient_id)
        user_res = await self.db.execute(user_stmt)
        user = user_res.scalar_one_or_none()
        if user is None:
            return None

        # 2. Query appointments for this patient and therapist (or all if admin)
        apt_stmt = select(Appointment).where(Appointment.patient_id == patient_id)
        if not is_admin:
            apt_stmt = apt_stmt.where(Appointment.therapist_id == therapist_id)

        apt_res = await self.db.execute(apt_stmt)
        appointments = apt_res.scalars().all()

        # If non-admin and patient has 0 appointments with this therapist, deny access
        if not is_admin and len(appointments) == 0:
            return None

        return {
            "patient": user,
            "appointments": appointments,
            "total_appointments": len(appointments),
        }
