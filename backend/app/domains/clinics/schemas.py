"""
Pydantic schemas for Clinics.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ClinicCreate(BaseModel):
    """Payload for creating a clinic location."""

    name: str = Field(..., max_length=255)
    address: str = Field(..., max_length=255)
    city: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=50)
    email: EmailStr | None = None


class ClinicRead(BaseModel):
    """Public clinic location response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    address: str
    city: str
    phone: str
    email: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
