"""
Repository layer for ProgressRecord and GoalProgress database operations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.progress.models import GoalProgress, ProgressRecord


class ProgressRepository:
    """Data access repository for progress records and goals."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_record(self, record: ProgressRecord) -> ProgressRecord:
        """Persist a new progress record."""
        self.db.add(record)
        await self.db.flush()
        return record

    async def get_latest_record(self, patient_id: uuid.UUID) -> ProgressRecord | None:
        """Fetch the most recent progress record for a patient."""
        stmt = (
            select(ProgressRecord)
            .where(ProgressRecord.patient_id == patient_id)
            .order_by(ProgressRecord.recorded_at.desc())
            .limit(1)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_patient_history(
        self,
        patient_id: uuid.UUID,
        limit: int = 30,
    ) -> Sequence[ProgressRecord]:
        """Fetch historical progress records for a patient."""
        stmt = (
            select(ProgressRecord)
            .where(ProgressRecord.patient_id == patient_id)
            .order_by(ProgressRecord.recorded_at.desc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def list_patient_goals(self, patient_id: uuid.UUID) -> Sequence[GoalProgress]:
        """Fetch clinical goals assigned to a patient."""
        stmt = (
            select(GoalProgress)
            .where(GoalProgress.patient_id == patient_id)
            .order_by(GoalProgress.created_at.asc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create_goal(self, goal: GoalProgress) -> GoalProgress:
        """Create a new clinical goal."""
        self.db.add(goal)
        await self.db.flush()
        return goal
