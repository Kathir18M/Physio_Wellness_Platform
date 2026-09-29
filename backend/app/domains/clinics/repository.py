"""
Clinic repository for database operations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.clinics.models import Clinic


class ClinicRepository:
    """Data access repository for Clinic entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, clinic_id: uuid.UUID) -> Clinic | None:
        """Fetch clinic by primary key."""
        stmt = select(Clinic).where(Clinic.id == clinic_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_clinics(self, city: str | None = None, active_only: bool = True) -> Sequence[Clinic]:
        """List active clinics with optional city filtering."""
        stmt = select(Clinic)
        if active_only:
            stmt = stmt.where(Clinic.is_active.is_(True))
        if city:
            stmt = stmt.where(Clinic.city.ilike(f"%{city}%"))
        stmt = stmt.order_by(Clinic.name.asc())
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create(
        self,
        name: str,
        address: str,
        city: str,
        phone: str,
        email: str | None = None,
    ) -> Clinic:
        """Create a new clinic record."""
        clinic = Clinic(
            name=name,
            address=address,
            city=city,
            phone=phone,
            email=email,
        )
        self.db.add(clinic)
        await self.db.flush()
        return clinic
