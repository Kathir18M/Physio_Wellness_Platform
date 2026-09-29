"""
Assessments API router handling patient intake submissions and practitioner evaluations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, status

from app.domains.assessments.schemas import (
    AssessmentCreate,
    AssessmentRead,
    AssessmentTherapistUpdate,
)
from app.domains.assessments.service import AssessmentService
from app.domains.users.models import UserRole
from app.shared.dependencies.auth import CurrentUser, require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/assessments", tags=["Assessments"])

require_therapist_or_admin = Depends(
    require_roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
)


@router.post(
    "",
    response_model=AssessmentRead,
    status_code=status.HTTP_201_CREATED,
    summary="Submit patient health assessment questionnaire",
)
async def create_assessment(
    data: AssessmentCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> AssessmentRead:
    """Submit a new patient intake questionnaire."""
    service = AssessmentService(db)
    assessment = await service.create_assessment(current_user, data)
    return AssessmentRead.model_validate(assessment)


@router.get(
    "/me",
    response_model=list[AssessmentRead],
    status_code=status.HTTP_200_OK,
    summary="List assessments for currently authenticated patient",
)
async def get_my_assessments(
    db: DbSession,
    current_user: CurrentUser,
) -> Sequence[AssessmentRead]:
    """Retrieve intake assessments submitted by the current user."""
    service = AssessmentService(db)
    assessments = await service.get_my_assessments(current_user)
    return [AssessmentRead.model_validate(a) for a in assessments]


@router.get(
    "/{id}",
    response_model=AssessmentRead,
    status_code=status.HTTP_200_OK,
    summary="Get assessment by ID (Owner, assigned therapist, or admin)",
)
async def get_assessment_by_id(
    id: uuid.UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> AssessmentRead:
    """Retrieve an assessment record enforcing authorization checks."""
    service = AssessmentService(db)
    assessment = await service.get_assessment_by_id(id, current_user)
    return AssessmentRead.model_validate(assessment)


@router.patch(
    "/{id}",
    response_model=AssessmentRead,
    status_code=status.HTTP_200_OK,
    dependencies=[require_therapist_or_admin],
    summary="Update clinical evaluation scores & notes (Therapist/Admin only)",
)
async def update_clinical_assessment(
    id: uuid.UUID,
    data: AssessmentTherapistUpdate,
    db: DbSession,
    current_user: CurrentUser,
) -> AssessmentRead:
    """Update practitioner clinical scores, movement notes, and treatment recommendations."""
    service = AssessmentService(db)
    updated = await service.update_clinical_evaluation(id, data, current_user)
    return AssessmentRead.model_validate(updated)
