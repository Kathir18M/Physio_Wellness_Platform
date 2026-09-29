"""
SQLAlchemy models for Notifications domain.
"""

import enum
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class NotificationChannel(str, enum.Enum):
    IN_APP = "IN_APP"
    EMAIL = "EMAIL"
    WHATSAPP = "WHATSAPP"


class NotificationEventType(str, enum.Enum):
    APPOINTMENT_BOOKED = "APPOINTMENT_BOOKED"
    APPOINTMENT_REMINDER = "APPOINTMENT_REMINDER"
    APPOINTMENT_CANCELLED = "APPOINTMENT_CANCELLED"
    PAYMENT_SUCCESSFUL = "PAYMENT_SUCCESSFUL"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    TREATMENT_PLAN_CREATED = "TREATMENT_PLAN_CREATED"
    EXERCISE_ASSIGNED = "EXERCISE_ASSIGNED"
    EXERCISE_REMINDER = "EXERCISE_REMINDER"
    PROGRESS_REPORT_AVAILABLE = "PROGRESS_REPORT_AVAILABLE"


class NotificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    READ = "READ"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    event_type = Column(
        Enum(NotificationEventType),
        nullable=False,
        index=True,
    )
    channel = Column(
        Enum(NotificationChannel),
        nullable=False,
        default=NotificationChannel.IN_APP,
    )
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    status = Column(
        Enum(NotificationStatus),
        nullable=False,
        default=NotificationStatus.PENDING,
        index=True,
    )
    deduplication_key = Column(String(255), nullable=True, unique=True, index=True)
    retry_count = Column(Integer, nullable=False, default=0)
    max_retries = Column(Integer, nullable=False, default=3)
    error_message = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    sent_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
