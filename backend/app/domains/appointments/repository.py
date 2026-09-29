"""
Appointment repository for database queries and double-booking conflict prevention.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.appointments.models import Appointment, AppointmentStatus, AppointmentType
from app.domains.therapists.models import TherapistProfile


class AppointmentRepository:
    """Data access repository for Appointment booking entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, appointment_id: uuid.UUID) -> Appointment | None:
        """Fetch appointment by ID including patient, therapist, user, and clinic relationships."""
        stmt = (
            select(Appointment)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.therapist).selectinload(TherapistProfile.user),
                selectinload(Appointment.clinic),
            )
            .where(Appointment.id == appointment_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_patient_appointments(
        self,
        patient_id: uuid.UUID,
    ) -> Sequence[Appointment]:
        """List all appointments for a patient sorted by start_time descending."""
        stmt = (
            select(Appointment)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.therapist).selectinload(TherapistProfile.user),
                selectinload(Appointment.clinic),
            )
            .where(Appointment.patient_id == patient_id)
            .order_by(Appointment.start_time.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def list_therapist_appointments(
        self,
        therapist_id: uuid.UUID,
    ) -> Sequence[Appointment]:
        """List all appointments assigned to a therapist sorted by start_time descending."""
        stmt = (
            select(Appointment)
            .options(
                selectinload(Appointment.patient),
                selectinload(Appointment.therapist).selectinload(TherapistProfile.user),
                selectinload(Appointment.clinic),
            )
            .where(Appointment.therapist_id == therapist_id)
            .order_by(Appointment.start_time.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_conflicting_appointments(
        self,
        therapist_id: uuid.UUID,
        start_time: datetime,
        end_time: datetime,
        exclude_id: uuid.UUID | None = None,
        for_update: bool = True,
    ) -> Sequence[Appointment]:
        """
        Check for overlapping non-cancelled appointments for a therapist.

        Overlap formula: (Appointment.start_time < new_end_time) AND (Appointment.end_time > new_start_time)
        Uses ``with_for_update()`` to lock rows during transaction and prevent double-booking race conditions.
        """
        stmt = select(Appointment).where(
            Appointment.therapist_id == therapist_id,
            Appointment.status != AppointmentStatus.CANCELLED,
            Appointment.start_time < end_time,
            Appointment.end_time > start_time,
        )

        if exclude_id is not None:
            stmt = stmt.where(Appointment.id != exclude_id)

        if for_update:
            stmt = stmt.with_for_update()

        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create(
        self,
        patient_id: uuid.UUID,
        therapist_id: uuid.UUID,
        appointment_type: AppointmentType,
        start_time: datetime,
        end_time: datetime,
        clinic_id: uuid.UUID | None = None,
        notes: str | None = None,
        status: AppointmentStatus = AppointmentStatus.CONFIRMED,
    ) -> Appointment:
        """Create and persist a new Appointment entity."""
        appointment = Appointment(
            patient_id=patient_id,
            therapist_id=therapist_id,
            clinic_id=clinic_id,
            appointment_type=appointment_type,
            start_time=start_time,
            end_time=end_time,
            status=status,
            notes=notes,
        )
        self.db.add(appointment)
        await self.db.flush()
        return await self.get_by_id(appointment.id)

    async def update(
        self,
        appointment: Appointment,
        update_dict: dict[str, any],
    ) -> Appointment:
        """Update fields on an existing Appointment entity."""
        for key, value in update_dict.items():
            if hasattr(appointment, key) and value is not None:
                setattr(appointment, key, value)
        await self.db.flush()
        return appointment
