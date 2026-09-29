"""
Repository layer for Exercise library database operations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.exercises.models import Exercise
from app.domains.treatment_plans.models import ExerciseCompletionLog


class ExerciseRepository:
    """Data access repository for Exercise entities and completion logs."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_exercises(
        self,
        body_part: str | None = None,
        difficulty: str | None = None,
        active_only: bool = True,
    ) -> Sequence[Exercise]:
        """Fetch exercise library items with optional body_part or difficulty filters."""
        stmt = select(Exercise)
        if active_only:
            stmt = stmt.where(Exercise.is_active.is_(True))
        if body_part:
            stmt = stmt.where(Exercise.body_part.ilike(f"%{body_part}%"))
        if difficulty:
            stmt = stmt.where(Exercise.difficulty == difficulty)

        stmt = stmt.order_by(Exercise.name.asc())
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, exercise_id: uuid.UUID) -> Exercise | None:
        """Fetch exercise by primary key."""
        stmt = select(Exercise).where(Exercise.id == exercise_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_exercise(self, exercise: Exercise) -> Exercise:
        """Persist a new exercise record."""
        self.db.add(exercise)
        await self.db.flush()
        return exercise

    async def log_completion(self, log: ExerciseCompletionLog) -> ExerciseCompletionLog:
        """Persist daily exercise completion log."""
        self.db.add(log)
        await self.db.flush()
        return log
