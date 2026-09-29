"""
Repository layer for Assessment database CRUD operations.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.assessments.models import Assessment


class AssessmentRepository:
    """Data access repository for Assessment entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_assessment(self, assessment: Assessment) -> Assessment:
        """Persist a new assessment record."""
        self.db.add(assessment)
        await self.db.flush()
        return await self.get_by_id(assessment.id)

    async def get_by_id(self, assessment_id: uuid.UUID) -> Assessment | None:
        """Fetch assessment by primary key including Patient and Therapist relationships."""
        stmt = (
            select(Assessment)
            .options(
                selectinload(Assessment.patient),
                selectinload(Assessment.therapist).selectinload(Assessment.therapist.user),
            )
            .where(Assessment.id == assessment_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_patient(self, patient_id: uuid.UUID) -> Sequence[Assessment]:
        """Fetch assessments submitted by a specific patient."""
        stmt = (
            select(Assessment)
            .options(
                selectinload(Assessment.patient),
                selectinload(Assessment.therapist),
            )
            .where(Assessment.patient_id == patient_id)
            .order_by(Assessment.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def list_by_therapist(self, therapist_id: uuid.UUID) -> Sequence[Assessment]:
        """Fetch assessments assigned to a specific practitioner."""
        stmt = (
            select(Assessment)
            .options(
                selectinload(Assessment.patient),
                selectinload(Assessment.therapist),
            )
            .where(Assessment.therapist_id == therapist_id)
            .order_by(Assessment.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def update(self, assessment: Assessment, update_dict: dict) -> Assessment:
        """Apply patch dictionary to assessment entity."""
        for key, value in update_dict.items():
            if value is not None and hasattr(assessment, key):
                setattr(assessment, key, value)
        await self.db.flush()
        return await self.get_by_id(assessment.id)
