"""
Subscription service layer.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.orders.models import Order
from app.domains.subscriptions.models import Subscription
from app.domains.subscriptions.repository import SubscriptionRepository
from app.domains.users.models import User
from app.shared.exceptions import ForbiddenException, NotFoundException


class SubscriptionService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = SubscriptionRepository(db)

    async def activate_subscription_for_order(self, order: Order) -> Subscription:
        """Activate subscription and grant program access after payment verification."""
        now = datetime.now(timezone.utc)
        sub = Subscription(
            patient_id=order.patient_id,
            order_id=order.id,
            program_id=order.program_id,
            status="ACTIVE",
            current_period_start=now,
            current_period_end=now + timedelta(days=60),
        )
        return await self.repository.create_subscription(sub)

    async def get_my_subscriptions(self, current_user: User) -> Sequence[Subscription]:
        return await self.repository.list_by_patient(current_user.id)

    async def cancel_subscription(
        self,
        current_user: User,
        subscription_id: uuid.UUID | None = None,
    ) -> Subscription:
        subs = await self.repository.list_by_patient(current_user.id)
        if not subs:
            raise NotFoundException("No active subscriptions found for current user.")

        target = None
        if subscription_id:
            target = next((s for s in subs if s.id == subscription_id), None)
        else:
            target = next((s for s in subs if s.status == "ACTIVE"), subs[0])

        if not target:
            raise NotFoundException("Subscription not found.")

        if target.patient_id != current_user.id:
            raise ForbiddenException("Unauthorized to cancel this subscription.")

        return await self.repository.cancel_subscription(target)
