"""
Shared Pydantic response schemas used across all domains.

Every API response wraps its payload in a consistent envelope so the
frontend API client can rely on a uniform shape.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response body for GET /health."""

    status: str = Field(default="healthy", examples=["healthy"])
    app_name: str
    version: str
    environment: str
    timestamp: datetime
    database: str = Field(default="connected", examples=["connected", "disconnected"])



class ErrorDetail(BaseModel):
    """Machine-readable error detail."""

    code: str
    message: str


class ErrorResponse(BaseModel):
    """Standard error envelope."""

    success: bool = False
    error: ErrorDetail


class SuccessResponse(BaseModel):
    """Standard success envelope for mutations and simple confirmations."""

    success: bool = True
    message: str = "Operation completed successfully."
    data: Any | None = None
