"""
Pagination utilities.

Provides:
- ``PaginationParams`` — FastAPI dependency that extracts & validates
  ``page`` and ``page_size`` query parameters.
- ``paginate()`` — helper that applies LIMIT/OFFSET to a SQLAlchemy
  select statement and returns a ``PaginatedResponse``.
"""

from __future__ import annotations

from typing import Annotated, Any, Generic, Sequence, TypeVar

from fastapi import Depends, Query
from pydantic import BaseModel
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE

T = TypeVar("T")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Pagination parameters dependency
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class PaginationParams:
    """Extracts ``page`` and ``page_size`` from query string."""

    def __init__(
        self,
        page: int = Query(default=DEFAULT_PAGE, ge=1, description="Page number"),
        page_size: int = Query(
            default=DEFAULT_PAGE_SIZE,
            ge=1,
            le=MAX_PAGE_SIZE,
            description="Items per page",
        ),
    ) -> None:
        self.page = page
        self.page_size = page_size

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


Pagination = Annotated[PaginationParams, Depends()]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Paginated response schema
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class PaginatedResponse(BaseModel, Generic[T]):
    """Envelope for paginated list endpoints."""

    items: list[Any]  # Will be overridden by concrete T at call sites
    total: int
    page: int
    page_size: int
    total_pages: int

    @property
    def has_next(self) -> bool:
        return self.page < self.total_pages

    @property
    def has_prev(self) -> bool:
        return self.page > 1

    @classmethod
    def create(
        cls,
        items: list[Any],
        total: int,
        params: PaginationParams,
    ) -> PaginatedResponse[T]:
        total_pages = max(1, -(-total // params.page_size)) if params.page_size > 0 else 1
        return cls(
            items=items,
            total=total,
            page=params.page,
            page_size=params.page_size,
            total_pages=total_pages,
        )



# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Pagination helper
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


async def paginate(
    db: AsyncSession,
    query: Select,  # type: ignore[type-arg]
    params: PaginationParams,
) -> PaginatedResponse:
    """
    Apply pagination to a SQLAlchemy ``Select`` and return a
    ``PaginatedResponse`` containing the result rows plus metadata.

    The caller is responsible for serialising ``.items`` into Pydantic
    schemas if needed.
    """
    # Count total rows (sub-query wrap for correctness with JOINs)
    count_q = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_q)
    total: int = total_result.scalar_one()

    # Fetch the page
    paginated_q = query.offset(params.offset).limit(params.page_size)
    result = await db.execute(paginated_q)
    items: Sequence[Any] = result.scalars().all()

    total_pages = max(1, -(-total // params.page_size))  # ceil division

    return PaginatedResponse(
        items=list(items),
        total=total,
        page=params.page,
        page_size=params.page_size,
        total_pages=total_pages,
    )
