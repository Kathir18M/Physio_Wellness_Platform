"""
ProgressRecord and GoalProgress ORM entities.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.domains.users.models import User


class ProgressRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Daily patient progress log record."""

    __tablename__ = "progress_records"

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    pain_score: Mapped[int] = mapped_column(Integer, nullable=False)  # 0 to 10
    weight: Mapped[float | None] = mapped_column(Float, nullable=True)  # in kg/lbs
    mobility_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0 to 100
    strength_score: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 0 to 100
    custom_measurements: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON or key-value string
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    patient: Mapped[User] = relationship("User")


class GoalProgress(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Patient clinical goal tracking item."""

    __tablename__ = "goal_progress"

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    goal_title: Mapped[str] = mapped_column(String(255), nullable=False)
    target_value: Mapped[float] = mapped_column(Float, nullable=False)
    current_value: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), default="%", nullable=False)  # e.g., "%", "degrees", "kg"
    is_achieved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    target_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    patient: Mapped[User] = relationship("User")
