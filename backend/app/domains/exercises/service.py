"""
Exercise service layer for clinical exercise library and daily completion tracking.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.exercises.models import Exercise
from app.domains.exercises.repository import ExerciseRepository
from app.domains.exercises.schemas import ExerciseCompletionCreate, ExerciseCreate
from app.domains.treatment_plans.models import ExerciseCompletionLog
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException, NotFoundException


class ExerciseService:
    """Service handling exercise library management and daily completion logs."""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = ExerciseRepository(db)

    async def list_exercises(
        self,
        body_part: str | None = None,
        difficulty: str | None = None,
    ) -> Sequence[Exercise]:
        """Fetch exercise library records."""
        return await self.repository.list_exercises(body_part=body_part, difficulty=difficulty)

    async def get_exercise_by_id(self, exercise_id: uuid.UUID) -> Exercise:
        """Fetch exercise by ID."""
        exercise = await self.repository.get_by_id(exercise_id)
        if exercise is None:
            raise NotFoundException(f"Exercise '{exercise_id}' not found.")
        return exercise

    async def create_exercise(
        self,
        current_user: User,
        data: ExerciseCreate,
    ) -> Exercise:
        """Create a new exercise in library (Therapist/Admin only)."""
        if current_user.role not in (UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise ForbiddenException("Only therapists or admins can create exercises in the library.")

        exercise = Exercise(
            name=data.name,
            description=data.description,
            body_part=data.body_part,
            difficulty=data.difficulty,
            duration=data.duration,
            sets=data.sets,
            repetitions=data.repetitions,
            instructions=data.instructions,
            precautions=data.precautions,
            video_url=data.video_url,
            thumbnail_url=data.thumbnail_url,
            is_active=True,
        )
        return await self.repository.create_exercise(exercise)

    async def log_completion(
        self,
        exercise_id: uuid.UUID,
        current_user: User,
        data: ExerciseCompletionCreate,
    ) -> ExerciseCompletionLog:
        """Log daily exercise completion event for patient."""
        # Ensure exercise exists
        await self.get_exercise_by_id(exercise_id)

        log = ExerciseCompletionLog(
            patient_id=current_user.id,
            exercise_id=exercise_id,
            treatment_plan_id=data.treatment_plan_id,
            completed_at=datetime.now(timezone.utc),
            notes=data.notes,
        )
        return await self.repository.log_completion(log)
