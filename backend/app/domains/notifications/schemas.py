"""
Pydantic schemas for Notifications domain.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.domains.notifications.models import (
    NotificationChannel,
    NotificationEventType,
    NotificationStatus,
)


class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    event_type: NotificationEventType
    channel: NotificationChannel
    title: str
    body: str
    status: NotificationStatus
    deduplication_key: Optional[str] = None
    retry_count: int
    max_retries: int
    error_message: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationSendEventRequest(BaseModel):
    user_id: UUID
    event_type: NotificationEventType
    title: str
    body: str
    channels: List[NotificationChannel] = Field(
        default_factory=lambda: [NotificationChannel.IN_APP]
    )
    deduplication_key: Optional[str] = None
    recipient_email: Optional[str] = None
    recipient_phone: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None


class UnreadCountResponse(BaseModel):
    unread_count: int
