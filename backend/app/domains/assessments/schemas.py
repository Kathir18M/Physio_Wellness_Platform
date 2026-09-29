"""
Pydantic schemas for patient health assessments and practitioner evaluations.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.domains.therapists.schemas import TherapistProfileRead
from app.domains.users.schemas import UserRead


class AssessmentCreate(BaseModel):
    """Payload submitted by patient during intake questionnaire."""

    pain_area: str = Field(..., min_length=2, max_length=255, json_schema_extra={"example": "Lower Back (L4-L5)"})
    pain_level: int = Field(..., ge=0, le=10, description="Visual Analog Scale pain score from 0 to 10")
    pain_duration: str = Field(..., min_length=2, max_length=255, json_schema_extra={"example": "3 to 6 weeks"})
    previous_injuries: str | None = Field(default=None, max_length=2000)
    medical_history: str | None = Field(default=None, max_length=2000)
    occupation: str | None = Field(default=None, max_length=255)
    activity_level: str | None = Field(default=None, max_length=255)
    sleep_quality: str | None = Field(default=None, max_length=255)
    lifestyle: str | None = Field(default=None, max_length=2000)
    goals: str | None = Field(default=None, max_length=2000)
    additional_notes: str | None = Field(default=None, max_length=2000)
    therapist_id: uuid.UUID | None = Field(default=None, description="Optional assigned therapist profile ID")


class AssessmentTherapistUpdate(BaseModel):
    """Payload updated by practitioner or admin during clinical evaluation."""

    mobility_score: int | None = Field(default=None, ge=0, le=100)
    strength_score: int | None = Field(default=None, ge=0, le=100)
    flexibility_score: int | None = Field(default=None, ge=0, le=100)
    posture_score: int | None = Field(default=None, ge=0, le=100)
    movement_notes: str | None = Field(default=None, max_length=3000)
    clinical_notes: str | None = Field(default=None, max_length=3000)
    recommendations: str | None = Field(default=None, max_length=3000)
    status: str | None = Field(default=None, pattern=r"^(PENDING_REVIEW|UNDER_REVIEW|COMPLETED)$")


class AssessmentRead(BaseModel):
    """Full assessment entity response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    therapist_id: uuid.UUID | None = None
    status: str

    # Patient fields
    pain_area: str
    pain_level: int
    pain_duration: str
    previous_injuries: str | None = None
    medical_history: str | None = None
    occupation: str | None = None
    activity_level: str | None = None
    sleep_quality: str | None = None
    lifestyle: str | None = None
    goals: str | None = None
    additional_notes: str | None = None

    # Therapist fields
    mobility_score: int | None = None
    strength_score: int | None = None
    flexibility_score: int | None = None
    posture_score: int | None = None
    movement_notes: str | None = None
    clinical_notes: str | None = None
    recommendations: str | None = None

    created_at: datetime
    updated_at: datetime

    patient: UserRead | None = None
    therapist: TherapistProfileRead | None = None
