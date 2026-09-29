"""
Assessment ORM entity for patient health questionnaires and clinical therapist evaluations.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.therapists.models import TherapistProfile
    from app.domains.users.models import User


class Assessment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Health assessment entity storing patient intake data and practitioner clinical scores."""

    __tablename__ = "assessments"

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    therapist_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("therapist_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Status: PENDING_REVIEW, UNDER_REVIEW, COMPLETED
    status: Mapped[str] = mapped_column(
        String(50),
        default="PENDING_REVIEW",
        nullable=False,
        index=True,
    )

    # Patient Assessment Fields
    pain_area: Mapped[str] = mapped_column(String(255), nullable=False)
    pain_level: Mapped[int] = mapped_column(Integer, nullable=False)  # 0 to 10
    pain_duration: Mapped[str] = mapped_column(String(255), nullable=False)
    previous_injuries: Mapped[str | None] = mapped_column(Text, nullable=True)
    medical_history: Mapped[str | None] = mapped_column(Text, nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(255), nullable=True)
    activity_level: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sleep_quality: Mapped[str | None] = mapped_column(String(255), nullable=True)
    lifestyle: Mapped[str | None] = mapped_column(Text, nullable=True)
    goals: Mapped[str | None] = mapped_column(Text, nullable=True)
    additional_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Therapist Assessment & Clinical Fields
    mobility_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0 to 100
    strength_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0 to 100
    flexibility_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0 to 100
    posture_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0 to 100
    movement_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    clinical_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    patient: Mapped[User] = relationship("User")
    therapist: Mapped[TherapistProfile | None] = relationship("TherapistProfile")
