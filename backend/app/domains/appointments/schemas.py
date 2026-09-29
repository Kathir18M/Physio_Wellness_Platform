"""
Pydantic schemas for Appointment booking, slots, and requests.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.domains.appointments.models import AppointmentStatus, AppointmentType
from app.domains.clinics.schemas import ClinicRead
from app.domains.therapists.schemas import TherapistProfileRead
from app.domains.users.schemas import UserRead


class TimeSlot(BaseModel):
    """Schema for generated available time slot."""

    start_time: datetime
    end_time: datetime
    available: bool = True


class AppointmentCreate(BaseModel):
    """Payload for booking a new appointment."""

    therapist_id: uuid.UUID
    clinic_id: uuid.UUID | None = Field(default=None, description="Required for CLINIC appointment_type")
    appointment_type: AppointmentType = Field(default=AppointmentType.ONLINE)
    start_time: datetime
    notes: str | None = Field(default=None, max_length=1000)


class AppointmentUpdate(BaseModel):
    """Payload for rescheduling or updating an appointment."""

    start_time: datetime | None = None
    notes: str | None = Field(default=None, max_length=1000)
    status: AppointmentStatus | None = None


class AppointmentRead(BaseModel):
    """Full appointment entity response envelope."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    therapist_id: uuid.UUID
    clinic_id: uuid.UUID | None = None
    appointment_type: AppointmentType
    start_time: datetime
    end_time: datetime
    status: AppointmentStatus
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    patient: UserRead | None = None
    therapist: TherapistProfileRead | None = None
    clinic: ClinicRead | None = None
