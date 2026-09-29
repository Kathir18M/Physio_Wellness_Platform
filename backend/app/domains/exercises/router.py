"""
Exercises API router for clinical exercise library and daily completion tracking.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, Query, status

from app.domains.exercises.schemas import (
    ExerciseCompletionCreate,
    ExerciseCompletionRead,
    ExerciseCreate,
    ExerciseRead,
)
from app.domains.exercises.service import ExerciseService
from app.domains.users.models import UserRole
from app.shared.dependencies.auth import CurrentUser, require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/exercises", tags=["Exercises"])

require_therapist_or_admin = Depends(
    require_roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
)


@router.get(
    "",
    response_model=list[ExerciseRead],
    status_code=status.HTTP_200_OK,
    summary="List active therapeutic exercises in clinical library",
)
async def list_exercises(
    db: DbSession,
    body_part: str | None = Query(None, description="Filter by target body part"),
    difficulty: str | None = Query(None, description="Filter by difficulty (BEGINNER|INTERMEDIATE|ADVANCED)"),
) -> Sequence[ExerciseRead]:
    """Retrieve exercise library records."""
    service = ExerciseService(db)
    exercises = await service.list_exercises(body_part=body_part, difficulty=difficulty)
    return [ExerciseRead.model_validate(e) for e in exercises]


@router.get(
    "/{id}",
    response_model=ExerciseRead,
    status_code=status.HTTP_200_OK,
    summary="Get exercise details by ID",
)
async def get_exercise_by_id(
    id: uuid.UUID,
    db: DbSession,
) -> ExerciseRead:
    """Retrieve details for a specific exercise in the library."""
    service = ExerciseService(db)
    exercise = await service.get_exercise_by_id(id)
    return ExerciseRead.model_validate(exercise)


@router.post(
    "",
    response_model=ExerciseRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[require_therapist_or_admin],
    summary="Add new exercise to clinical library (Therapist/Admin only)",
)
async def create_exercise(
    data: ExerciseCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> ExerciseRead:
    """Create a new exercise definition in the system library."""
    service = ExerciseService(db)
    exercise = await service.create_exercise(current_user, data)
    return ExerciseRead.model_validate(exercise)


@router.post(
    "/{id}/complete",
    response_model=ExerciseCompletionRead,
    status_code=status.HTTP_201_CREATED,
    summary="Log daily exercise completion event for patient",
)
async def log_exercise_completion(
    id: uuid.UUID,
    data: ExerciseCompletionCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> ExerciseCompletionRead:
    """Log that the authenticated user completed a prescribed exercise session."""
    service = ExerciseService(db)
    log = await service.log_completion(id, current_user, data)
    return ExerciseCompletionRead.model_validate(log)
