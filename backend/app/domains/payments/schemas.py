"""
Pydantic schemas for Payments and Webhook events.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PaymentCreatePayload(BaseModel):
    """Payload for initiating a payment checkout session."""

    order_id: uuid.UUID
    idempotency_key: str | None = Field(default=None, max_length=255)


class PaymentCheckoutResponse(BaseModel):
    """Checkout session response containing payment gateway URL and IDs."""

    provider: str
    checkout_session_id: str
    provider_payment_id: str
    checkout_url: str
    amount: float
    currency: str
    status: str


class PaymentVerifyPayload(BaseModel):
    """Payload for server-side payment verification."""

    provider_payment_id: str


class PaymentRead(BaseModel):
    """Payment record response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    order_id: uuid.UUID
    patient_id: uuid.UUID
    provider: str
    provider_payment_id: str
    amount: float
    currency: str
    status: str
    idempotency_key: str | None = None
    created_at: datetime
    updated_at: datetime


class PaymentEventRead(BaseModel):
    """Payment event log schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    payment_id: uuid.UUID | None = None
    event_type: str
    provider: str
    processed_at: datetime
