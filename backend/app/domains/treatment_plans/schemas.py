"""
Pydantic schemas for Treatment Plans and Exercise Assignments.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.domains.exercises.schemas import ExerciseRead
from app.domains.therapists.schemas import TherapistProfileRead
from app.domains.users.schemas import UserRead


class TreatmentPlanExerciseItemCreate(BaseModel):
    """Assignment payload for an exercise inside a treatment plan."""

    exercise_id: uuid.UUID
    sets: int = Field(default=3, ge=1, le=20)
    repetitions: str = Field(default="10 reps", max_length=50)
    duration: str | None = Field(default="5 mins", max_length=50)
    frequency: str | None = Field(default="Daily", max_length=50)
    order_index: int = Field(default=0, ge=0)


class TreatmentPlanExerciseItemRead(BaseModel):
    """Read schema for assigned exercise item."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    treatment_plan_id: uuid.UUID
    exercise_id: uuid.UUID
    sets: int
    repetitions: str
    duration: str | None = None
    frequency: str | None = None
    order_index: int
    exercise: ExerciseRead | None = None


class TreatmentPlanCreate(BaseModel):
    """Payload for practitioner creating a patient treatment plan."""

    patient_id: uuid.UUID
    title: str = Field(..., min_length=2, max_length=255, json_schema_extra={"example": "Lumbar Spine Recovery"})
    goal: str | None = Field(default=None, max_length=2000)
    duration: str = Field(default="8 weeks", max_length=100)
    frequency: str = Field(default="Daily", max_length=100)
    start_date: datetime | None = None
    end_date: datetime | None = None
    notes: str | None = Field(default=None, max_length=2000)
    exercises: list[TreatmentPlanExerciseItemCreate] = Field(default_factory=list)


class TreatmentPlanUpdate(BaseModel):
    """Payload for updating treatment plan attributes."""

    title: str | None = Field(default=None, max_length=255)
    goal: str | None = Field(default=None, max_length=2000)
    duration: str | None = Field(default=None, max_length=100)
    frequency: str | None = Field(default=None, max_length=100)
    status: str | None = Field(default=None, pattern=r"^(ACTIVE|COMPLETED|PAUSED|CANCELLED)$")
    notes: str | None = Field(default=None, max_length=2000)


class TreatmentPlanRead(BaseModel):
    """Response schema for treatment plan."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    therapist_id: uuid.UUID
    title: str
    goal: str | None = None
    duration: str
    frequency: str
    start_date: datetime | None = None
    end_date: datetime | None = None
    status: str
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    patient: UserRead | None = None
    therapist: TherapistProfileRead | None = None
    exercises: list[TreatmentPlanExerciseItemRead] = Field(default_factory=list)
