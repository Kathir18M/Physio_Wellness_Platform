"""
FastAPI dependency that provides an async database session per request.

Usage in any endpoint or router::

    from app.shared.dependencies.database import DbSession

    @router.get("/items")
    async def list_items(db: DbSession):
        ...
"""

from __future__ import annotations

from typing import Annotated, AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory


async def _get_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield a scoped async session, committing on success, rolling back on error."""
    if async_session_factory is None:
        raise RuntimeError("Database not initialised — call init_db() first")

    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# Re-usable annotated type — inject with ``db: DbSession``
DbSession = Annotated[AsyncSession, Depends(_get_session)]
