"""
Async SQLAlchemy 2.x database engine, session factory, and declarative base.

Provides:
- ``async_engine``  — the global async engine (created via ``init_db``).
- ``async_session_factory`` — a sessionmaker bound to the engine.
- ``Base`` — declarative base for all ORM models.
- ``TimestampMixin`` — adds created_at / updated_at columns.
- ``UUIDPrimaryKeyMixin`` — adds a UUID ``id`` column as the primary key.
- ``init_db`` / ``close_db`` — lifespan helpers called from ``main.py``.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, MetaData, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
)

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# ── Naming convention for constraints ────────────────────────────
# Keeps auto-generated constraint names deterministic & Alembic-friendly.
NAMING_CONVENTION: dict[str, str] = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Declarative Base
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class Base(DeclarativeBase):
    """Project-wide declarative base for all ORM models."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Mixins
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class UUIDPrimaryKeyMixin:
    """Mixin that provides a UUID v4 primary key column named ``id``."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        sort_order=-100,  # keep id first in DDL
    )


class TimestampMixin:
    """Mixin that adds ``created_at`` and ``updated_at`` columns."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        nullable=False,
        sort_order=900,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
        sort_order=901,
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Engine & Session
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async_engine: AsyncEngine | None = None
async_session_factory: async_sessionmaker[AsyncSession] | None = None


async def init_db() -> None:
    """Create the async engine and session factory.  Called on app startup."""
    global async_engine, async_session_factory  # noqa: PLW0603

    logger.info("Initialising database connection pool → %s", settings.DATABASE_URL)

    async_engine = create_async_engine(
        settings.DATABASE_URL,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_timeout=settings.DB_POOL_TIMEOUT,
        pool_recycle=settings.DB_POOL_RECYCLE,
        echo=settings.DB_ECHO,
    )

    async_session_factory = async_sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    logger.info("Database pool initialised (pool_size=%d)", settings.DB_POOL_SIZE)


async def close_db() -> None:
    """Dispose of the engine pool.  Called on app shutdown."""
    global async_engine, async_session_factory  # noqa: PLW0603

    if async_engine is not None:
        await async_engine.dispose()
        logger.info("Database pool disposed")
        async_engine = None
        async_session_factory = None


async def get_db_session() -> AsyncSession:
    """
    Yield an ``AsyncSession`` for use in a single request.

    This is the raw session provider.  The FastAPI dependency wrapper
    lives in ``shared/dependencies/database.py``.
    """
    if async_session_factory is None:
        raise RuntimeError("Database not initialised — call init_db() first")

    async with async_session_factory() as session:
        try:
            yield session  # type: ignore[misc]
            await session.commit()
        except Exception:
            await session.rollback()
            raise
