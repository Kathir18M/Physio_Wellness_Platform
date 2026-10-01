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
from app.domains.progress.repository import ProgressRepository
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
    progress_repo = ProgressRepository(db)
    records = await progress_repo.list_patient_history(current_user.id, limit=7)

    weekly_records = [
        {
            "recorded_at": r.recorded_at.isoformat(),
            "pain_level": r.pain_level,
            "mobility_score": r.mobility_score,
            "notes": r.notes or "",
        }
        for r in records
    ]

    avg_pain = sum(r.pain_level for r in records) / len(records) if records else 0.0
    metrics = {
        "user_id": str(current_user.id),
        "total_records_this_week": len(records),
        "avg_pain_level": round(avg_pain, 2),
        "pain_trend": "IMPROVING" if (records and records[0].pain_level <= avg_pain) else "STABLE",
    }

    return await ai_service.generate_progress_summary(
        metrics=metrics,
        weekly_records=weekly_records,
    )
