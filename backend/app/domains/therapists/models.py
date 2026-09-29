"""
TherapistProfile and TherapistAvailability ORM entities.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.appointments.models import Appointment
    from app.domains.clinics.models import Clinic
    from app.domains.users.models import User


class TherapistProfile(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Clinical practitioner profile entity."""

    __tablename__ = "therapist_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    clinic_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clinics.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    specialties: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,  # Comma-separated or JSON list
    )
    is_accepting_patients: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    # Relationships
    user: Mapped[User] = relationship("User")
    clinic: Mapped[Clinic | None] = relationship("Clinic", back_populates="therapists")
    availabilities: Mapped[list[TherapistAvailability]] = relationship(
        "TherapistAvailability",
        back_populates="therapist",
        cascade="all, delete-orphan",
    )
    appointments: Mapped[list[Appointment]] = relationship(
        "Appointment",
        back_populates="therapist",
    )


class TherapistAvailability(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Weekly working hours schedule for a therapist."""

    __tablename__ = "therapist_availabilities"

    therapist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("therapist_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    day_of_week: Mapped[int] = mapped_column(
        Integer,
        nullable=False,  # 0 = Monday, 6 = Sunday
        index=True,
    )
    start_time: Mapped[str] = mapped_column(
        String(10),
        nullable=False,  # Format "HH:MM" e.g., "09:00"
    )
    end_time: Mapped[str] = mapped_column(
        String(10),
        nullable=False,  # Format "HH:MM" e.g., "17:00"
    )
    slot_duration_minutes: Mapped[int] = mapped_column(
        Integer,
        default=45,
        nullable=False,
    )
    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    therapist: Mapped[TherapistProfile] = relationship(
        "TherapistProfile",
        back_populates="availabilities",
    )
