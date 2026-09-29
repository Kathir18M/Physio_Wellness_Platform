"""
Programs API endpoints router.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, Query, status

from app.domains.programs.schemas import ProgramCreate, ProgramRead, ProgramUpdate
from app.domains.programs.service import ProgramService
from app.domains.users.models import UserRole
from app.shared.dependencies.auth import require_roles
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/programs", tags=["Programs"])

require_admin = Depends(require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN))


@router.get(
    "",
    response_model=list[ProgramRead],
    status_code=status.HTTP_200_OK,
    summary="List active rehabilitation programs",
)
async def list_programs(
    db: DbSession,
    category: str | None = Query(default=None, description="Filter by category"),
) -> Sequence[ProgramRead]:
    """Public endpoint to list active rehabilitation programs."""
    service = ProgramService(db)
    programs = await service.list_programs(category=category, active_only=True)
    return [ProgramRead.model_validate(p) for p in programs]


@router.get(
    "/{slug}",
    response_model=ProgramRead,
    status_code=status.HTTP_200_OK,
    summary="Get active program details by URL slug",
)
async def get_program_by_slug(
    slug: str,
    db: DbSession,
) -> ProgramRead:
    """Public endpoint to fetch detailed program information by slug."""
    service = ProgramService(db)
    program = await service.get_program_by_slug(slug)
    return ProgramRead.model_validate(program)


@router.post(
    "",
    response_model=ProgramRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[require_admin],
    summary="Create a new rehabilitation program (Admin only)",
)
async def create_program(
    data: ProgramCreate,
    db: DbSession,
) -> ProgramRead:
    """Admin-only endpoint to create a program with sub-modules."""
    service = ProgramService(db)
    program = await service.create_program(data)
    return ProgramRead.model_validate(program)


@router.patch(
    "/{id}",
    response_model=ProgramRead,
    status_code=status.HTTP_200_OK,
    dependencies=[require_admin],
    summary="Update an existing rehabilitation program (Admin only)",
)
async def update_program(
    id: uuid.UUID,
    data: ProgramUpdate,
    db: DbSession,
) -> ProgramRead:
    """Admin-only endpoint to update program parameters."""
    service = ProgramService(db)
    program = await service.update_program(id, data)
    return ProgramRead.model_validate(program)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[require_admin],
    summary="Delete a rehabilitation program (Admin only)",
)
async def delete_program(
    id: uuid.UUID,
    db: DbSession,
) -> None:
    """Admin-only endpoint to delete a program and its sub-modules."""
    service = ProgramService(db)
    await service.delete_program(id)
