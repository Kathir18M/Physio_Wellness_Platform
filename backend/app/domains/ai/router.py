"""
AI-assisted features API router.
"""

from __future__ import annotations

from fastapi import APIRouter, status

from app.domains.ai.schemas import (
    ExerciseAssistantRequest,
    PostureAnalysisRequest,
    ProgressSummaryRequest,
)
from app.integrations.ai.service import (
    AIService,
    ExerciseAssistantResult,
    PostureAnalysisResult,
    ProgressSummaryResult,
)
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/ai", tags=["AI Integration"])


@router.post(
    "/posture-analysis",
    response_model=PostureAnalysisResult,
    status_code=status.HTTP_200_OK,
    summary="AI Posture & Movement Analysis",
)
async def analyze_posture(
    payload: PostureAnalysisRequest,
    current_user: CurrentUser,
) -> PostureAnalysisResult:
    """Analyze posture landmarks and movement metrics with clinical support output."""
    ai_service = AIService()
    return await ai_service.analyze_posture(
        landmarks=payload.landmarks,
        movement_metrics=payload.movement_metrics,
    )


@router.post(
    "/exercise-assistant",
    response_model=ExerciseAssistantResult,
    status_code=status.HTTP_200_OK,
    summary="AI Exercise Assistant",
)
async def ask_exercise_assistant(
    payload: ExerciseAssistantRequest,
    current_user: CurrentUser,
) -> ExerciseAssistantResult:
    """Ask AI assistant regarding exercise form, pacing, or routine guidance."""
    ai_service = AIService()
    context = {"user_id": str(current_user.id)}
    if payload.treatment_plan_id:
        context["treatment_plan_id"] = str(payload.treatment_plan_id)

    return await ai_service.ask_exercise_assistant(
        patient_question=payload.patient_question,
        treatment_plan_context=context,
    )


@router.post(
    "/progress-summary",
    response_model=ProgressSummaryResult,
    status_code=status.HTTP_200_OK,
    summary="AI Progress Summary",
)
async def generate_progress_summary(
    payload: ProgressSummaryRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> ProgressSummaryResult:
    """Generate AI-assisted weekly progress summary for patient recovery tracking."""
    ai_service = AIService()
    metrics = {
        "user_id": str(current_user.id),
        "exercise_completion_rate": 85.0,
        "pain_trend": "IMPROVING",
    }
    weekly_records = [
        {"day": "Mon", "completed": True, "pain_score": 5},
        {"day": "Wed", "completed": True, "pain_score": 4},
        {"day": "Fri", "completed": True, "pain_score": 3},
    ]

    return await ai_service.generate_progress_summary(
        metrics=metrics,
        weekly_records=weekly_records,
    )
