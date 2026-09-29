"""
Appointment ORM entity and Enums.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.clinics.models import Clinic
    from app.domains.therapists.models import TherapistProfile
    from app.domains.users.models import User


class AppointmentType(str, enum.Enum):
    """Care delivery mode."""

    ONLINE = "ONLINE"
    CLINIC = "CLINIC"


class AppointmentStatus(str, enum.Enum):
    """Appointment lifecycle status."""

    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class Appointment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Appointment booking record."""

    __tablename__ = "appointments"
    __table_args__ = (
        Index("ix_appointments_therapist_slot", "therapist_id", "start_time", "end_time"),
    )

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
    clinic_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clinics.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    appointment_type: Mapped[AppointmentType] = mapped_column(
        Enum(AppointmentType, name="appointment_type"),
        default=AppointmentType.ONLINE,
        nullable=False,
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus, name="appointment_status"),
        default=AppointmentStatus.PENDING,
        nullable=False,
        index=True,
    )
    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    patient: Mapped[User] = relationship("User")
    therapist: Mapped[TherapistProfile] = relationship(
        "TherapistProfile",
        back_populates="appointments",
    )
    clinic: Mapped[Clinic | None] = relationship(
        "Clinic",
        back_populates="appointments",
    )
