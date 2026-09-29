"""
Order repository layer.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.orders.models import Order


class OrderRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_order(self, order: Order) -> Order:
        self.db.add(order)
        await self.db.flush()
        return await self.get_by_id(order.id)

    async def get_by_id(self, order_id: uuid.UUID) -> Order | None:
        stmt = (
            select(Order)
            .options(selectinload(Order.patient), selectinload(Order.program))
            .where(Order.id == order_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_patient(self, patient_id: uuid.UUID) -> Sequence[Order]:
        stmt = (
            select(Order)
            .options(selectinload(Order.patient), selectinload(Order.program))
            .where(Order.patient_id == patient_id)
            .order_by(Order.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def update_status(self, order: Order, status: str) -> Order:
        order.status = status
        await self.db.flush()
        return order
