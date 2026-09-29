"""
Exercise ORM entity representing therapeutic movement items in the clinical library.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.treatment_plans.models import TreatmentPlanExercise


class Exercise(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Clinical exercise definition entity."""

    __tablename__ = "exercises"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    body_part: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # e.g. "Lower Back", "Knee"
    difficulty: Mapped[str] = mapped_column(String(50), default="BEGINNER", nullable=False)  # BEGINNER, INTERMEDIATE, ADVANCED
    duration: Mapped[str | None] = mapped_column(String(50), nullable=True)  # e.g. "5 mins"
    sets: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    repetitions: Mapped[str] = mapped_column(String(50), default="10 reps", nullable=False)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    precautions: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    # Relationships
    treatment_plan_assignments: Mapped[list[TreatmentPlanExercise]] = relationship(
        "TreatmentPlanExercise",
        back_populates="exercise",
        cascade="all, delete-orphan",
    )
