"""
Pydantic schemas for Therapists, Availability schedules, and Therapist-Patient views.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.domains.clinics.schemas import ClinicRead
from app.domains.users.schemas import UserRead


class TherapistAvailabilityCreate(BaseModel):
    """Payload for setting therapist working hours."""

    day_of_week: int = Field(..., ge=0, le=6, description="0=Monday, 6=Sunday")
    start_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", json_schema_extra={"example": "09:00"})
    end_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", json_schema_extra={"example": "17:00"})
    slot_duration_minutes: int = Field(default=45, ge=15, le=120)


class TherapistAvailabilityRead(BaseModel):
    """Schema for therapist working hours."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    therapist_id: uuid.UUID
    day_of_week: int
    start_time: str
    end_time: str
    slot_duration_minutes: int
    is_available: bool


class TherapistProfileRead(BaseModel):
    """Schema for therapist profile including associated User and Clinic."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    clinic_id: uuid.UUID | None = None
    bio: str | None = None
    specialties: str | None = None
    is_accepting_patients: bool
    user: UserRead | None = None
    clinic: ClinicRead | None = None
    availabilities: list[TherapistAvailabilityRead] = Field(default_factory=list)


class TherapistPatientRead(BaseModel):
    """Schema for therapist patient summary listing."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    phone: str | None = None
    role: str
    is_active: bool
    created_at: datetime
    total_appointments: int
    last_appointment: datetime | None = None


class TherapistPatientDetailRead(BaseModel):
    """Detailed patient view including clinical appointments history."""

    model_config = ConfigDict(from_attributes=True)

    patient: UserRead
    appointments: list[Any] = Field(default_factory=list)
    total_appointments: int
