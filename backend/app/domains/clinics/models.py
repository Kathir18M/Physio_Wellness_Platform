"""
Clinic ORM entity.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.appointments.models import Appointment
    from app.domains.therapists.models import TherapistProfile


class Clinic(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Physical wellness clinic location."""

    __tablename__ = "clinics"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    address: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    phone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    # Relationships
    therapists: Mapped[list[TherapistProfile]] = relationship(
        "TherapistProfile",
        back_populates="clinic",
    )
    appointments: Mapped[list[Appointment]] = relationship(
        "Appointment",
        back_populates="clinic",
    )
