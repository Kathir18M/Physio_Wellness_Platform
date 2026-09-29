"""
Subscription schemas.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.domains.programs.schemas import ProgramRead


class SubscriptionCancelPayload(BaseModel):
    """Payload for cancelling a subscription."""

    subscription_id: uuid.UUID | None = Field(default=None)


class SubscriptionRead(BaseModel):
    """Subscription response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    order_id: uuid.UUID
    program_id: uuid.UUID | None = None
    status: str
    current_period_start: datetime
    current_period_end: datetime | None = None
    cancelled_at: datetime | None = None
    created_at: datetime

    program: ProgramRead | None = None
