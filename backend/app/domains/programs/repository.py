"""
Program repository for database operations.
"""

from __future__ import annotations

import uuid
from typing import Any, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.programs.models import Program, ProgramModule


class ProgramRepository:
    """Data access repository for Program and ProgramModule entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, program_id: uuid.UUID) -> Program | None:
        """Fetch program by UUID including modules."""
        stmt = (
            select(Program)
            .options(selectinload(Program.modules))
            .where(Program.id == program_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Program | None:
        """Fetch program by unique URL slug including modules."""
        stmt = (
            select(Program)
            .options(selectinload(Program.modules))
            .where(Program.slug == slug)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_programs(
        self,
        category: str | None = None,
        active_only: bool = True,
    ) -> Sequence[Program]:
        """List programs with optional category filtering and active status."""
        stmt = select(Program).options(selectinload(Program.modules))

        if active_only:
            stmt = stmt.where(Program.is_active.is_(True))

        if category:
            stmt = stmt.where(Program.category.ilike(f"%{category}%"))

        stmt = stmt.order_by(Program.created_at.desc())
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create(
        self,
        name: str,
        slug: str,
        description: str,
        category: str,
        duration: str,
        price: float,
        thumbnail_url: str | None = None,
        is_active: bool = True,
        modules_data: list[dict[str, Any]] | None = None,
    ) -> Program:
        """Persist a new Program entity and attached modules."""
        program = Program(
            name=name,
            slug=slug,
            description=description,
            category=category,
            duration=duration,
            price=price,
            thumbnail_url=thumbnail_url,
            is_active=is_active,
        )
        self.db.add(program)
        await self.db.flush()

        if modules_data:
            for mod in modules_data:
                module = ProgramModule(
                    program_id=program.id,
                    name=mod["name"],
                    description=mod.get("description"),
                    order_index=mod.get("order_index", 0),
                )
                self.db.add(module)
            await self.db.flush()

        return await self.get_by_id(program.id)  # re-fetch with loaded relationship

    async def update(
        self,
        program: Program,
        update_dict: dict[str, Any],
    ) -> Program:
        """Update fields on an existing Program."""
        for key, value in update_dict.items():
            if hasattr(program, key) and value is not None:
                setattr(program, key, value)
        await self.db.flush()
        return program

    async def delete(self, program: Program) -> None:
        """Delete a program entity (cascades to modules)."""
        await self.db.delete(program)
        await self.db.flush()
