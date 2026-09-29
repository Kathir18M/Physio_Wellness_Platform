"""
Treatment Plans API router for clinical protocol prescription and patient care plans.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, status

from app.domains.treatment_plans.schemas import (
    TreatmentPlanCreate,
    TreatmentPlanRead,
    TreatmentPlanUpdate,
)
from app.domains.treatment_plans.service import TreatmentPlanService
from app.domains.users.models import UserRole
from app.shared.dependencies.auth import CurrentUser, require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/treatment-plans", tags=["Treatment Plans"])

require_therapist_or_admin = Depends(
    require_roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
)


@router.post(
    "",
    response_model=TreatmentPlanRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[require_therapist_or_admin],
    summary="Create patient treatment plan with assigned exercises (Therapist/Admin only)",
)
async def create_treatment_plan(
    data: TreatmentPlanCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> TreatmentPlanRead:
    """Prescribe a new clinical treatment plan for a patient."""
    service = TreatmentPlanService(db)
    plan = await service.create_treatment_plan(current_user, data)
    return TreatmentPlanRead.model_validate(plan)


@router.get(
    "/me",
    response_model=list[TreatmentPlanRead],
    status_code=status.HTTP_200_OK,
    summary="List treatment plans for currently authenticated patient",
)
async def get_my_treatment_plans(
    db: DbSession,
    current_user: CurrentUser,
) -> Sequence[TreatmentPlanRead]:
    """Fetch active and past treatment plans assigned to the patient."""
    service = TreatmentPlanService(db)
    plans = await service.get_my_treatment_plans(current_user)
    return [TreatmentPlanRead.model_validate(p) for p in plans]


@router.get(
    "/{id}",
    response_model=TreatmentPlanRead,
    status_code=status.HTTP_200_OK,
    summary="Get treatment plan details by ID",
)
async def get_treatment_plan_by_id(
    id: uuid.UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> TreatmentPlanRead:
    """Retrieve details and assigned exercise list for a treatment plan."""
    service = TreatmentPlanService(db)
    plan = await service.get_treatment_plan_by_id(id, current_user)
    return TreatmentPlanRead.model_validate(plan)


@router.patch(
    "/{id}",
    response_model=TreatmentPlanRead,
    status_code=status.HTTP_200_OK,
    dependencies=[require_therapist_or_admin],
    summary="Update treatment plan status or parameters (Therapist/Admin only)",
)
async def update_treatment_plan(
    id: uuid.UUID,
    data: TreatmentPlanUpdate,
    db: DbSession,
    current_user: CurrentUser,
) -> TreatmentPlanRead:
    """Update title, duration, status, or notes on a treatment plan."""
    service = TreatmentPlanService(db)
    updated = await service.update_treatment_plan(id, data, current_user)
    return TreatmentPlanRead.model_validate(updated)
