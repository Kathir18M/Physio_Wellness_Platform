"""
Therapists API router with patient management and practitioner profile endpoints.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, Query, status

from app.domains.therapists.repository import TherapistRepository
from app.domains.therapists.schemas import (
    TherapistAvailabilityCreate,
    TherapistAvailabilityRead,
    TherapistPatientDetailRead,
    TherapistPatientRead,
    TherapistProfileRead,
)
from app.domains.therapists.service import TherapistService
from app.domains.users.models import User, UserRole
from app.shared.dependencies.auth import CurrentUser, get_current_user, require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/therapists", tags=["Therapists"])

require_therapist_or_admin = Depends(
    require_roles(UserRole.THERAPIST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
)


@router.get(
    "",
    response_model=list[TherapistProfileRead],
    status_code=status.HTTP_200_OK,
    summary="List active physical therapists",
)
async def list_therapists(
    db: DbSession,
) -> Sequence[TherapistProfileRead]:
    """Public endpoint listing therapists accepting patients."""
    repo = TherapistRepository(db)
    profiles = await repo.list_therapists(accepting_only=True)
    return [TherapistProfileRead.model_validate(p) for p in profiles]


@router.get(
    "/me",
    response_model=TherapistProfileRead,
    status_code=status.HTTP_200_OK,
    dependencies=[require_therapist_or_admin],
    summary="Get current therapist practitioner profile",
)
async def get_my_therapist_profile(
    db: DbSession,
    current_user: CurrentUser,
) -> TherapistProfileRead:
    """Retrieve practitioner profile for currently authenticated therapist."""
    service = TherapistService(db)
    profile = await service.get_or_create_therapist_profile(current_user)
    return TherapistProfileRead.model_validate(profile)


@router.get(
    "/patients",
    response_model=list[TherapistPatientRead],
    status_code=status.HTTP_200_OK,
    dependencies=[require_therapist_or_admin],
    summary="List patients assigned to current therapist",
)
async def get_assigned_patients(
    db: DbSession,
    current_user: CurrentUser,
    q: str | None = Query(None, description="Search query by email or phone"),
) -> Sequence[TherapistPatientRead]:
    """Fetch distinct patient roster assigned to the requesting practitioner."""
    service = TherapistService(db)
    patients = await service.get_assigned_patients(current_user, search_query=q)
    return [TherapistPatientRead.model_validate(p) for p in patients]


@router.get(
    "/patients/{id}",
    response_model=TherapistPatientDetailRead,
    status_code=status.HTTP_200_OK,
    dependencies=[require_therapist_or_admin],
    summary="Get patient details & appointment history",
)
async def get_assigned_patient_detail(
    id: uuid.UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> TherapistPatientDetailRead:
    """Fetch clinical detail view for an assigned patient."""
    service = TherapistService(db)
    detail = await service.get_assigned_patient_detail(current_user, patient_id=id)
    return TherapistPatientDetailRead.model_validate(detail)


@router.get(
    "/{id}",
    response_model=TherapistProfileRead,
    status_code=status.HTTP_200_OK,
    summary="Get therapist profile details",
)
async def get_therapist_profile(
    id: uuid.UUID,
    db: DbSession,
) -> TherapistProfileRead:
    """Public endpoint to fetch therapist details."""
    repo = TherapistRepository(db)
    profile = await repo.get_profile_by_id(id)
    if profile is None:
        from app.shared.exceptions import NotFoundException
        raise NotFoundException(f"Therapist '{id}' not found.")
    return TherapistProfileRead.model_validate(profile)


@router.post(
    "/{id}/availability",
    response_model=TherapistAvailabilityRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[require_therapist_or_admin],
    summary="Set therapist working hours (Admin/Therapist only)",
)
async def set_therapist_availability(
    id: uuid.UUID,
    data: TherapistAvailabilityCreate,
    db: DbSession,
) -> TherapistAvailabilityRead:
    """Add working hours schedule to a therapist profile."""
    repo = TherapistRepository(db)
    availability = await repo.create_availability(
        therapist_id=id,
        day_of_week=data.day_of_week,
        start_time=data.start_time,
        end_time=data.end_time,
        slot_duration_minutes=data.slot_duration_minutes,
    )
    return TherapistAvailabilityRead.model_validate(availability)
