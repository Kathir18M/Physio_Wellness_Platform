"""
Program domain business logic service.
"""

from __future__ import annotations

import re
import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.programs.exceptions import (
    ProgramNotFoundException,
    ProgramSlugConflictException,
)
from app.domains.programs.models import Program
from app.domains.programs.repository import ProgramRepository
from app.domains.programs.schemas import ProgramCreate, ProgramUpdate


def _slugify(text: str) -> str:
    """Utility to generate a URL-friendly slug from string."""
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "program"


class ProgramService:
    """Business logic service for Program management."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = ProgramRepository(db)

    async def list_programs(
        self,
        category: str | None = None,
        active_only: bool = True,
    ) -> Sequence[Program]:
        """List active or all programs."""
        return await self.repo.list_programs(category=category, active_only=active_only)

    async def get_program_by_slug(self, slug: str) -> Program:
        """Fetch program by slug or raise ProgramNotFoundException."""
        program = await self.repo.get_by_slug(slug)
        if program is None or not program.is_active:
            raise ProgramNotFoundException(slug)
        return program

    async def get_program_by_id(self, program_id: uuid.UUID) -> Program:
        """Fetch program by ID or raise ProgramNotFoundException."""
        program = await self.repo.get_by_id(program_id)
        if program is None:
            raise ProgramNotFoundException(str(program_id))
        return program

    async def create_program(self, data: ProgramCreate) -> Program:
        """Create a new program and validate slug uniqueness."""
        slug = data.slug or _slugify(data.name)

        existing = await self.repo.get_by_slug(slug)
        if existing is not None:
            raise ProgramSlugConflictException(slug)

        modules_data = [m.model_dump() for m in data.modules] if data.modules else []

        program = await self.repo.create(
            name=data.name,
            slug=slug,
            description=data.description,
            category=data.category,
            duration=data.duration,
            price=data.price,
            thumbnail_url=data.thumbnail_url,
            is_active=data.is_active,
            modules_data=modules_data,
        )
        return program

    async def update_program(self, program_id: uuid.UUID, update_data: ProgramUpdate) -> Program:
        """Update an existing program entity."""
        program = await self.get_program_by_id(program_id)

        update_dict = update_data.model_dump(exclude_unset=True)

        if "slug" in update_dict and update_dict["slug"] is not None:
            new_slug = update_dict["slug"]
            existing = await self.repo.get_by_slug(new_slug)
            if existing and existing.id != program.id:
                raise ProgramSlugConflictException(new_slug)

        updated = await self.repo.update(program, update_dict)
        return updated

    async def delete_program(self, program_id: uuid.UUID) -> None:
        """Delete a program entity."""
        program = await self.get_program_by_id(program_id)
        await self.repo.delete(program)
