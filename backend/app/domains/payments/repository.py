"""
Payment and PaymentEvent repository layer.
"""

from __future__ import annotations

import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.payments.models import Payment, PaymentEvent


class PaymentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_payment(self, payment: Payment) -> Payment:
        self.db.add(payment)
        await self.db.flush()
        return payment

    async def get_by_idempotency_key(self, idempotency_key: str) -> Payment | None:
        stmt = select(Payment).where(Payment.idempotency_key == idempotency_key)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_provider_id(self, provider_payment_id: str) -> Payment | None:
        stmt = select(Payment).where(Payment.provider_payment_id == provider_payment_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_patient(self, patient_id: uuid.UUID) -> Sequence[Payment]:
        stmt = (
            select(Payment)
            .where(Payment.patient_id == patient_id)
            .order_by(Payment.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def update_status(self, payment: Payment, status: str) -> Payment:
        payment.status = status
        await self.db.flush()
        return payment

    async def create_event(self, event: PaymentEvent) -> PaymentEvent:
        self.db.add(event)
        await self.db.flush()
        return event
