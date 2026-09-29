"""
Clinics API router.
"""

from __future__ import annotations

from typing import Sequence

from fastapi import APIRouter, Depends, status

from app.domains.clinics.repository import ClinicRepository
from app.domains.clinics.schemas import ClinicCreate, ClinicRead
from app.domains.users.models import UserRole
from app.shared.dependencies.auth import require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/clinics", tags=["Clinics"])

require_admin = Depends(require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN))


@router.get(
    "",
    response_model=list[ClinicRead],
    status_code=status.HTTP_200_OK,
    summary="List active clinic locations",
)
async def list_clinics(
    db: DbSession,
) -> Sequence[ClinicRead]:
    """Public endpoint listing active physical clinic locations."""
    repo = ClinicRepository(db)
    clinics = await repo.list_clinics(active_only=True)
    return [ClinicRead.model_validate(c) for c in clinics]


@router.post(
    "",
    response_model=ClinicRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[require_admin],
    summary="Create a new clinic location (Admin only)",
)
async def create_clinic(
    data: ClinicCreate,
    db: DbSession,
) -> ClinicRead:
    """Admin-only endpoint to add a clinic location."""
    repo = ClinicRepository(db)
    clinic = await repo.create(
        name=data.name,
        address=data.address,
        city=data.city,
        phone=data.phone,
        email=data.email,
    )
    return ClinicRead.model_validate(clinic)
