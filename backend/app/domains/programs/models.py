"""
Program and ProgramModule ORM entities.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Program(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Program entity representing a structured rehabilitation protocol."""

    __tablename__ = "programs"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    duration: Mapped[str] = mapped_column(
        String(50),
        nullable=False,  # e.g., "6 Weeks"
    )
    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=0.0,
    )
    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )

    # Relationships
    modules: Mapped[list[ProgramModule]] = relationship(
        "ProgramModule",
        back_populates="program",
        cascade="all, delete-orphan",
        order_by="ProgramModule.order_index",
    )


class ProgramModule(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Sub-module or weekly milestone within a rehabilitation program."""

    __tablename__ = "program_modules"

    program_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("programs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    order_index: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    program: Mapped[Program] = relationship("Program", back_populates="modules")
