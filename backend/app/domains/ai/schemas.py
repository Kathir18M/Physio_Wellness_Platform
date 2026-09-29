"""
Pydantic schemas for AI features domain APIs.
"""

from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.integrations.ai.service import (
    ExerciseAssistantResult,
    PostureAnalysisResult,
    ProgressSummaryResult,
)


class PostureAnalysisRequest(BaseModel):
    landmarks: Dict[str, Any] = Field(..., description="Keypoint pose landmark coordinates")
    movement_metrics: Optional[Dict[str, Any]] = Field(default=None, description="Optional angle/symmetry metrics")


class ExerciseAssistantRequest(BaseModel):
    patient_question: str = Field(..., min_length=3, description="Question regarding exercise technique or routine")
    treatment_plan_id: Optional[UUID] = Field(default=None, description="Optional associated treatment plan ID")


class ProgressSummaryRequest(BaseModel):
    patient_id: Optional[UUID] = Field(default=None, description="Optional target patient ID (defaults to self)")
    days: int = Field(default=7, ge=1, le=30, description="Time window in days for summary")
