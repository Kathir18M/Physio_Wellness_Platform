"""
Order service layer.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.orders.models import Order
from app.domains.orders.repository import OrderRepository
from app.domains.orders.schemas import OrderCreate
from app.domains.users.models import User
from app.shared.exceptions import NotFoundException


class OrderService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = OrderRepository(db)

    async def create_order(self, current_user: User, data: OrderCreate) -> Order:
        order = Order(
            patient_id=current_user.id,
            program_id=data.program_id,
            total_amount=data.amount,
            currency=data.currency,
            status="PENDING",
        )
        return await self.repository.create_order(order)

    async def get_my_orders(self, current_user: User) -> Sequence[Order]:
        return await self.repository.list_by_patient(current_user.id)

    async def get_order_by_id(self, order_id: uuid.UUID) -> Order:
        order = await self.repository.get_by_id(order_id)
        if not order:
            raise NotFoundException(f"Order '{order_id}' not found.")
        return order
