"""
Orders API router.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from fastapi import APIRouter, status

from app.domains.orders.schemas import OrderCreate, OrderRead
from app.domains.orders.service import OrderService
from app.shared.dependencies.auth import CurrentUser
from app.shared.dependencies.database import DbSession

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post(
    "",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create purchase order for program or consultation",
)
async def create_order(
    data: OrderCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> OrderRead:
    service = OrderService(db)
    order = await service.create_order(current_user, data)
    return OrderRead.model_validate(order)


@router.get(
    "/me",
    response_model=list[OrderRead],
    status_code=status.HTTP_200_OK,
    summary="List patient purchase orders",
)
async def get_my_orders(
    db: DbSession,
    current_user: CurrentUser,
) -> Sequence[OrderRead]:
    service = OrderService(db)
    orders = await service.get_my_orders(current_user)
    return [OrderRead.model_validate(o) for o in orders]
