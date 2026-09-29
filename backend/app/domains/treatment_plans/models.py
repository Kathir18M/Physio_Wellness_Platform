"""
TreatmentPlan, TreatmentPlanExercise, and ExerciseCompletionLog ORM entities.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.exercises.models import Exercise
    from app.domains.therapists.models import TherapistProfile
    from app.domains.users.models import User


class TreatmentPlan(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Clinical treatment plan prescribed by practitioner for patient."""

    __tablename__ = "treatment_plans"

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    therapist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("therapist_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration: Mapped[str] = mapped_column(String(100), default="8 weeks", nullable=False)
    frequency: Mapped[str] = mapped_column(String(100), default="Daily", nullable=False)
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False, index=True)  # ACTIVE, COMPLETED, PAUSED, CANCELLED
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    patient: Mapped[User] = relationship("User")
    therapist: Mapped[TherapistProfile] = relationship("TherapistProfile")
    exercises: Mapped[list[TreatmentPlanExercise]] = relationship(
        "TreatmentPlanExercise",
        back_populates="treatment_plan",
        cascade="all, delete-orphan",
        order_by="TreatmentPlanExercise.order_index",
    )


class TreatmentPlanExercise(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Junction table mapping therapeutic exercises to a patient treatment plan."""

    __tablename__ = "treatment_plan_exercises"

    treatment_plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("treatment_plans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    exercise_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("exercises.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    sets: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    repetitions: Mapped[str] = mapped_column(String(50), default="10 reps", nullable=False)
    duration: Mapped[str | None] = mapped_column(String(50), nullable=True)
    frequency: Mapped[str | None] = mapped_column(String(50), default="Daily", nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    treatment_plan: Mapped[TreatmentPlan] = relationship("TreatmentPlan", back_populates="exercises")
    exercise: Mapped[Exercise] = relationship("Exercise", back_populates="treatment_plan_assignments")


class ExerciseCompletionLog(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Log tracking patient daily exercise completion events."""

    __tablename__ = "exercise_completion_logs"

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    exercise_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("exercises.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    treatment_plan_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("treatment_plans.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    patient: Mapped[User] = relationship("User")
    exercise: Mapped[Exercise] = relationship("Exercise")
