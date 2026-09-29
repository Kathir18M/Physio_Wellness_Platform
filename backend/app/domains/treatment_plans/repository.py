"""
Repository layer for TreatmentPlan database operations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.treatment_plans.models import TreatmentPlan, TreatmentPlanExercise


class TreatmentPlanRepository:
    """Data access repository for TreatmentPlan entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_plan(
        self,
        plan: TreatmentPlan,
        exercise_assignments: list[dict],
    ) -> TreatmentPlan:
        """Persist a new treatment plan with assigned exercises."""
        self.db.add(plan)
        await self.db.flush()

        for item in exercise_assignments:
            tx_exercise = TreatmentPlanExercise(
                treatment_plan_id=plan.id,
                exercise_id=item["exercise_id"],
                sets=item.get("sets", 3),
                repetitions=item.get("repetitions", "10 reps"),
                duration=item.get("duration", "5 mins"),
                frequency=item.get("frequency", "Daily"),
                order_index=item.get("order_index", 0),
            )
            self.db.add(tx_exercise)

        await self.db.flush()
        return await self.get_by_id(plan.id)

    async def get_by_id(self, plan_id: uuid.UUID) -> TreatmentPlan | None:
        """Fetch treatment plan by ID with patient, therapist, and assigned exercises."""
        stmt = (
            select(TreatmentPlan)
            .options(
                selectinload(TreatmentPlan.patient),
                selectinload(TreatmentPlan.therapist).selectinload(TreatmentPlan.therapist.user),
                selectinload(TreatmentPlan.exercises).selectinload(TreatmentPlanExercise.exercise),
            )
            .where(TreatmentPlan.id == plan_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_patient(self, patient_id: uuid.UUID) -> Sequence[TreatmentPlan]:
        """Fetch treatment plans for a patient."""
        stmt = (
            select(TreatmentPlan)
            .options(
                selectinload(TreatmentPlan.patient),
                selectinload(TreatmentPlan.therapist).selectinload(TreatmentPlan.therapist.user),
                selectinload(TreatmentPlan.exercises).selectinload(TreatmentPlanExercise.exercise),
            )
            .where(TreatmentPlan.patient_id == patient_id)
            .order_by(TreatmentPlan.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def update(self, plan: TreatmentPlan, update_dict: dict) -> TreatmentPlan:
        """Apply patch updates to treatment plan."""
        for key, value in update_dict.items():
            if value is not None and hasattr(plan, key):
                setattr(plan, key, value)
        await self.db.flush()
        return await self.get_by_id(plan.id)
