"""
Subscription repository layer.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domains.subscriptions.models import Subscription


class SubscriptionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_subscription(self, subscription: Subscription) -> Subscription:
        self.db.add(subscription)
        await self.db.flush()
        return await self.get_by_id(subscription.id)

    async def get_by_id(self, subscription_id: uuid.UUID) -> Subscription | None:
        stmt = (
            select(Subscription)
            .options(selectinload(Subscription.patient), selectinload(Subscription.program))
            .where(Subscription.id == subscription_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_patient(self, patient_id: uuid.UUID) -> Sequence[Subscription]:
        stmt = (
            select(Subscription)
            .options(selectinload(Subscription.patient), selectinload(Subscription.program))
            .where(Subscription.patient_id == patient_id)
            .order_by(Subscription.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def cancel_subscription(self, subscription: Subscription) -> Subscription:
        subscription.status = "CANCELLED"
        subscription.cancelled_at = datetime.now(timezone.utc)
        await self.db.flush()
        return subscription
