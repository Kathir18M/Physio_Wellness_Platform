"""
Pydantic schemas for Exercises and Daily Exercise Completion tracking.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ExerciseCreate(BaseModel):
    """Payload for creating a new therapeutic exercise in library."""

    name: str = Field(..., min_length=2, max_length=255, json_schema_extra={"example": "Cat-Cow Stretch"})
    description: str | None = Field(default=None, max_length=2000)
    body_part: str = Field(..., min_length=2, max_length=100, json_schema_extra={"example": "Lower Back"})
    difficulty: str = Field(default="BEGINNER", pattern=r"^(BEGINNER|INTERMEDIATE|ADVANCED)$")
    duration: str | None = Field(default="5 mins", max_length=50)
    sets: int = Field(default=3, ge=1, le=20)
    repetitions: str = Field(default="10 reps", max_length=50)
    instructions: str | None = Field(default=None, max_length=3000)
    precautions: str | None = Field(default=None, max_length=2000)
    video_url: str | None = Field(default=None, max_length=500)
    thumbnail_url: str | None = Field(default=None, max_length=500)


class ExerciseRead(BaseModel):
    """Exercise response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str | None = None
    body_part: str
    difficulty: str
    duration: str | None = None
    sets: int
    repetitions: str
    instructions: str | None = None
    precautions: str | None = None
    video_url: str | None = None
    thumbnail_url: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class ExerciseCompletionCreate(BaseModel):
    """Payload for logging exercise session completion."""

    notes: str | None = Field(default=None, max_length=500)
    treatment_plan_id: uuid.UUID | None = Field(default=None)


class ExerciseCompletionRead(BaseModel):
    """Exercise completion log response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    exercise_id: uuid.UUID
    treatment_plan_id: uuid.UUID | None = None
    completed_at: datetime
    notes: str | None = None
