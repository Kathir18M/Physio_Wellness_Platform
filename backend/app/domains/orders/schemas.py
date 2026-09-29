"""
Pydantic schemas for Order domain.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.domains.programs.schemas import ProgramRead
from app.domains.users.schemas import UserRead


class OrderCreate(BaseModel):
    """Payload for creating a new purchase order."""

    program_id: uuid.UUID | None = Field(default=None)
    amount: float = Field(..., gt=0)
    currency: str = Field(default="USD", min_length=3, max_length=10)


class OrderRead(BaseModel):
    """Order response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    program_id: uuid.UUID | None = None
    total_amount: float
    currency: str
    status: str
    created_at: datetime
    updated_at: datetime

    patient: UserRead | None = None
    program: ProgramRead | None = None
