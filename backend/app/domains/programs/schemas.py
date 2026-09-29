"""
Pydantic schemas for Programs domain.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ── Module Schemas ───────────────────────────────────────────────
class ProgramModuleCreate(BaseModel):
    """Schema for creating a program sub-module."""

    name: str = Field(..., max_length=255)
    description: str | None = None
    order_index: int = Field(default=0, ge=0)


class ProgramModuleRead(BaseModel):
    """Schema for reading a program sub-module."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    program_id: uuid.UUID
    name: str
    description: str | None = None
    order_index: int
    created_at: datetime
    updated_at: datetime


# ── Program Schemas ──────────────────────────────────────────────
class ProgramCreate(BaseModel):
    """Schema for creating a new program."""

    name: str = Field(..., max_length=255)
    slug: str | None = Field(default=None, max_length=255, description="Auto-generated if empty")
    description: str
    category: str = Field(..., max_length=100)
    duration: str = Field(..., max_length=50, description="e.g. '6 Weeks'")
    price: float = Field(default=0.0, ge=0.0)
    thumbnail_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True
    modules: list[ProgramModuleCreate] = Field(default_factory=list)


class ProgramUpdate(BaseModel):
    """Schema for updating an existing program."""

    name: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    duration: str | None = Field(default=None, max_length=50)
    price: float | None = Field(default=None, ge=0.0)
    thumbnail_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None


class ProgramRead(BaseModel):
    """Public program schema including modules."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str
    description: str
    category: str
    duration: str
    price: float
    thumbnail_url: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    modules: list[ProgramModuleRead] = Field(default_factory=list)
