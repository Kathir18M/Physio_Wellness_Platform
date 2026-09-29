"""
Pydantic schemas for Patient Progress tracking and Summary metrics.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProgressRecordCreate(BaseModel):
    """Payload for logging a daily progress record."""

    pain_score: int = Field(..., ge=0, le=10, description="VAS pain score from 0 to 10")
    weight: float | None = Field(default=None, ge=20.0, le=300.0)
    mobility_score: int | None = Field(default=None, ge=0, le=100)
    strength_score: int | None = Field(default=None, ge=0, le=100)
    custom_measurements: str | None = Field(default=None, max_length=1000)
    notes: str | None = Field(default=None, max_length=2000)


class ProgressRecordRead(BaseModel):
    """Progress record response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    pain_score: int
    weight: float | None = None
    mobility_score: int | None = None
    strength_score: int | None = None
    custom_measurements: str | None = None
    notes: str | None = None
    recorded_at: datetime
    created_at: datetime


class GoalProgressRead(BaseModel):
    """Goal progress response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    goal_title: str
    target_value: float
    current_value: float
    unit: str
    is_achieved: bool
    target_date: datetime | None = None


class ProgressSummaryRead(BaseModel):
    """Summary metrics overview response schema."""

    model_config = ConfigDict(from_attributes=True)

    latest_pain_score: int
    avg_pain_score_weekly: float
    exercise_completion_rate: float  # e.g., 92.0
    appointment_attendance_rate: float  # e.g., 100.0
    mobility_improvement: str  # e.g., "+28%"
    streak_days: int
    goals: list[GoalProgressRead] = Field(default_factory=list)
