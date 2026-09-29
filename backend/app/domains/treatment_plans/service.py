"""
TreatmentPlan service layer implementing clinical protocol assignment and access control.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.therapists.repository import TherapistRepository
from app.domains.treatment_plans.models import TreatmentPlan
from app.domains.treatment_plans.repository import TreatmentPlanRepository
from app.domains.treatment_plans.schemas import TreatmentPlanCreate, TreatmentPlanUpdate
from app.domains.users.models import User, UserRole
from app.shared.exceptions import ForbiddenException, NotFoundException


class TreatmentPlanService:
    """Service for managing clinical treatment plans and exercise assignments."""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = TreatmentPlanRepository(db)
        self.therapist_repo = TherapistRepository(db)

    async def create_treatment_plan(
        self,
        current_user: User,
        data: TreatmentPlanCreate,
    ) -> TreatmentPlan:
        """Create a treatment plan with assigned exercises (Therapist/Admin only)."""
        if current_user.role not in (UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise ForbiddenException("Only therapists or admins can prescribe treatment plans.")

        # Get practitioner profile
        therapist_profile = await self.therapist_repo.get_profile_by_user_id(current_user.id)
        if therapist_profile is None:
            therapist_profile = await self.therapist_repo.create_profile(user_id=current_user.id)

        plan = TreatmentPlan(
            patient_id=data.patient_id,
            therapist_id=therapist_profile.id,
            title=data.title,
            goal=data.goal,
            duration=data.duration,
            frequency=data.frequency,
            start_date=data.start_date,
            end_date=data.end_date,
            notes=data.notes,
            status="ACTIVE",
        )

        exercises_payload = [item.model_dump() for item in data.exercises]
        return await self.repository.create_plan(plan, exercises_payload)

    async def get_my_treatment_plans(self, current_user: User) -> Sequence[TreatmentPlan]:
        """Fetch treatment plans assigned to the current patient."""
        return await self.repository.list_by_patient(current_user.id)

    async def get_treatment_plan_by_id(
        self,
        plan_id: uuid.UUID,
        current_user: User,
    ) -> TreatmentPlan:
        """Fetch treatment plan enforcing patient owner or practitioner authorization."""
        plan = await self.repository.get_by_id(plan_id)
        if plan is None:
            raise NotFoundException(f"Treatment plan '{plan_id}' not found.")

        self._verify_access(plan, current_user)
        return plan

    async def update_treatment_plan(
        self,
        plan_id: uuid.UUID,
        data: TreatmentPlanUpdate,
        current_user: User,
    ) -> TreatmentPlan:
        """Update treatment plan parameters (Therapist/Admin only)."""
        if current_user.role not in (UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN):
            raise ForbiddenException("Only therapists or admins can update treatment plans.")

        plan = await self.repository.get_by_id(plan_id)
        if plan is None:
            raise NotFoundException(f"Treatment plan '{plan_id}' not found.")

        update_dict = data.model_dump(exclude_unset=True)
        return await self.repository.update(plan, update_dict)

    def _verify_access(self, plan: TreatmentPlan, user: User) -> None:
        """Verify access permissions."""
        if user.role in (UserRole.ADMIN, UserRole.SUPER_ADMIN):
            return

        if user.id == plan.patient_id:
            return

        if user.role == UserRole.THERAPIST and plan.therapist:
            if plan.therapist.user_id == user.id:
                return

        raise ForbiddenException("You are not authorized to view this treatment plan.")
