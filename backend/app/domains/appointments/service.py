"""
Appointment domain business logic service.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime, timedelta, timezone
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.appointments.exceptions import (
    AppointmentAuthorizationException,
    AppointmentNotFoundException,
    InvalidSlotTimeException,
    SlotConflictException,
)
from app.domains.appointments.models import Appointment, AppointmentStatus, AppointmentType
from app.domains.appointments.repository import AppointmentRepository
from app.domains.appointments.schemas import AppointmentCreate, AppointmentUpdate, TimeSlot
from app.domains.clinics.repository import ClinicRepository
from app.domains.therapists.repository import TherapistRepository
from app.domains.users.models import User, UserRole


class AppointmentService:
    """Business logic for appointment slot generation, booking, rescheduling, and cancellation."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.appointment_repo = AppointmentRepository(db)
        self.therapist_repo = TherapistRepository(db)
        self.clinic_repo = ClinicRepository(db)

    async def generate_available_slots(
        self,
        therapist_id: uuid.UUID,
        target_date: date,
    ) -> list[TimeSlot]:
        """
        Generate available time slots for a therapist on a given date.

        1. Fetches therapist working hours for date's day_of_week.
        2. Generates candidate slots.
        3. Queries booked appointments for that date.
        4. Filters out past or overlapping slots.
        """
        therapist = await self.therapist_repo.get_profile_by_id(therapist_id)
        if therapist is None or not therapist.is_accepting_patients:
            return []

        day_of_week = target_date.weekday()  # 0=Monday, 6=Sunday
        availabilities = await self.therapist_repo.get_availabilities_for_day(therapist_id, day_of_week)

        if not availabilities:
            # Default fallback working hours: 09:00 - 17:00 Monday to Friday (0..4)
            if day_of_week < 5:
                working_ranges = [("09:00", "17:00", 45)]
            else:
                return []
        else:
            working_ranges = [
                (a.start_time, a.end_time, a.slot_duration_minutes) for a in availabilities
            ]

        # Fetch booked appointments for date range
        start_of_day = datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0, tzinfo=timezone.utc)
        end_of_day = datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59, tzinfo=timezone.utc)
        booked = await self.appointment_repo.get_conflicting_appointments(
            therapist_id, start_of_day, end_of_day, for_update=False
        )

        slots: list[TimeSlot] = []
        now_utc = datetime.now(timezone.utc)

        for start_str, end_str, duration_min in working_ranges:
            start_h, start_m = map(int, start_str.split(":"))
            end_h, end_m = map(int, end_str.split(":"))

            range_start = datetime(target_date.year, target_date.month, target_date.day, start_h, start_m, tzinfo=timezone.utc)
            range_end = datetime(target_date.year, target_date.month, target_date.day, end_h, end_m, tzinfo=timezone.utc)

            current = range_start
            while current + timedelta(minutes=duration_min) <= range_end:
                slot_end = current + timedelta(minutes=duration_min)

                # Filter out slots in the past
                if current > now_utc:
                    # Check collision with booked appointments
                    is_conflict = any(
                        (b.start_time < slot_end and b.end_time > current) for b in booked
                    )
                    if not is_conflict:
                        slots.append(TimeSlot(start_time=current, end_time=slot_end, available=True))

                current = slot_end

        return slots

    async def book_appointment(
        self,
        patient: User,
        data: AppointmentCreate,
    ) -> Appointment:
        """
        Book an appointment enforcing timezone validation, working hours, and double-booking locks.
        """
        now_utc = datetime.now(timezone.utc)
        if data.start_time.tzinfo is None:
            start_time = data.start_time.replace(tzinfo=timezone.utc)
        else:
            start_time = data.start_time

        if start_time <= now_utc:
            raise InvalidSlotTimeException("Appointment time must be in the future.")

        therapist = await self.therapist_repo.get_profile_by_id(data.therapist_id)
        if therapist is None or not therapist.is_accepting_patients:
            raise InvalidSlotTimeException("Therapist is not accepting appointments.")

        if data.appointment_type == AppointmentType.CLINIC:
            if not data.clinic_id:
                raise InvalidSlotTimeException("Clinic location is required for in-clinic appointments.")
            clinic = await self.clinic_repo.get_by_id(data.clinic_id)
            if clinic is None or not clinic.is_active:
                raise InvalidSlotTimeException("Selected clinic is invalid or inactive.")

        # Default slot length: 45 minutes
        end_time = start_time + timedelta(minutes=45)

        # Atomic transaction row-lock check to prevent double booking
        conflicts = await self.appointment_repo.get_conflicting_appointments(
            therapist_id=data.therapist_id,
            start_time=start_time,
            end_time=end_time,
            for_update=True,
        )
        if conflicts:
            raise SlotConflictException("The selected time slot has already been booked by another patient.")

        appointment = await self.appointment_repo.create(
            patient_id=patient.id,
            therapist_id=data.therapist_id,
            clinic_id=data.clinic_id,
            appointment_type=data.appointment_type,
            start_time=start_time,
            end_time=end_time,
            notes=data.notes,
            status=AppointmentStatus.CONFIRMED,
        )
        return appointment

    async def list_user_appointments(self, user: User) -> Sequence[Appointment]:
        """List appointments visible to the authenticated user based on role."""
        if user.role in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            # Admin can view all
            stmt = await self.appointment_repo.list_patient_appointments(user.id)
            return stmt

        therapist_profile = await self.therapist_repo.get_profile_by_user_id(user.id)
        if therapist_profile:
            return await self.appointment_repo.list_therapist_appointments(therapist_profile.id)

        return await self.appointment_repo.list_patient_appointments(user.id)

    async def get_appointment_by_id(
        self,
        appointment_id: uuid.UUID,
        user: User,
    ) -> Appointment:
        """Fetch appointment by ID and check caller authorization."""
        appointment = await self.appointment_repo.get_by_id(appointment_id)
        if appointment is None:
            raise AppointmentNotFoundException(str(appointment_id))

        self._check_access(appointment, user)
        return appointment

    async def reschedule_appointment(
        self,
        appointment_id: uuid.UUID,
        user: User,
        data: AppointmentUpdate,
    ) -> Appointment:
        """Reschedule an existing appointment date/time."""
        appointment = await self.get_appointment_by_id(appointment_id, user)

        update_dict = data.model_dump(exclude_unset=True)

        if "start_time" in update_dict and update_dict["start_time"] is not None:
            new_start = update_dict["start_time"]
            if new_start.tzinfo is None:
                new_start = new_start.replace(tzinfo=timezone.utc)

            if new_start <= datetime.now(timezone.utc):
                raise InvalidSlotTimeException("Rescheduled time must be in the future.")

            new_end = new_start + timedelta(minutes=45)
            update_dict["start_time"] = new_start
            update_dict["end_time"] = new_end
            update_dict["status"] = AppointmentStatus.CONFIRMED

            # Check conflict excluding current appointment ID
            conflicts = await self.appointment_repo.get_conflicting_appointments(
                therapist_id=appointment.therapist_id,
                start_time=new_start,
                end_time=new_end,
                exclude_id=appointment.id,
                for_update=True,
            )
            if conflicts:
                raise SlotConflictException("The requested time slot is not available.")

        updated = await self.appointment_repo.update(appointment, update_dict)
        return updated

    async def cancel_appointment(
        self,
        appointment_id: uuid.UUID,
        user: User,
    ) -> Appointment:
        """Cancel an appointment."""
        appointment = await self.get_appointment_by_id(appointment_id, user)
        if appointment.status == AppointmentStatus.CANCELLED:
            return appointment

        updated = await self.appointment_repo.update(
            appointment, {"status": AppointmentStatus.CANCELLED}
        )
        return updated

    def _check_access(self, appointment: Appointment, user: User) -> None:
        """Helper to enforce role and ownership checks."""
        if user.role in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            return

        if appointment.patient_id == user.id:
            return

        if appointment.therapist and appointment.therapist.user_id == user.id:
            return

        raise AppointmentAuthorizationException()
