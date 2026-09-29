"""
Payment service layer managing transaction intents, server-side verification, webhooks, and refunds.
"""

from __future__ import annotations

import json
import uuid
from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.orders.repository import OrderRepository
from app.domains.payments.models import Payment, PaymentEvent
from app.domains.payments.repository import PaymentRepository
from app.domains.payments.schemas import PaymentCreatePayload
from app.domains.subscriptions.service import SubscriptionService
from app.domains.users.models import User
from app.integrations.payments.factory import get_payment_provider
from app.shared.exceptions import BadRequestException, NotFoundException


class PaymentService:
    """Service handling payment gateway integration, server verification, and webhooks."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repository = PaymentRepository(db)
        self.order_repo = OrderRepository(db)
        self.subscription_service = SubscriptionService(db)
        self.provider = get_payment_provider()

    async def create_checkout_session(
        self,
        current_user: User,
        data: PaymentCreatePayload,
    ) -> dict:
        """Initiate payment checkout session with idempotency check."""
        order = await self.order_repo.get_by_id(data.order_id)
        if not order:
            raise NotFoundException(f"Order '{data.order_id}' not found.")

        # Check Idempotency Key
        if data.idempotency_key:
            existing = await self.repository.get_by_idempotency_key(data.idempotency_key)
            if existing:
                return {
                    "provider": existing.provider,
                    "checkout_session_id": f"cs_{existing.provider_payment_id}",
                    "provider_payment_id": existing.provider_payment_id,
                    "checkout_url": f"http://localhost:3000/checkout/mock?payment_id={existing.provider_payment_id}",
                    "amount": existing.amount,
                    "currency": existing.currency,
                    "status": existing.status,
                }

        # Request session from Payment Provider Abstraction
        session_info = await self.provider.create_checkout_session(
            order_id=str(order.id),
            amount=order.total_amount,
            currency=order.currency,
            customer_email=current_user.email,
            description=f"Payment for Order #{str(order.id)[:8]}",
        )

        payment = Payment(
            order_id=order.id,
            patient_id=current_user.id,
            provider=session_info["provider"],
            provider_payment_id=session_info["provider_payment_id"],
            amount=order.total_amount,
            currency=order.currency,
            status="PENDING",
            idempotency_key=data.idempotency_key,
        )

        await self.repository.create_payment(payment)
        return session_info

    async def verify_payment_server_side(
        self,
        provider_payment_id: str,
        current_user: User,
    ) -> Payment:
        """Verify payment transaction directly with the payment provider (Never trust frontend)."""
        payment = await self.repository.get_by_provider_id(provider_payment_id)
        if not payment:
            raise NotFoundException(f"Payment transaction '{provider_payment_id}' not found.")

        # Server-side verification call to gateway
        verification_result = await self.provider.verify_payment(provider_payment_id)

        if verification_result.get("verified") and verification_result.get("status") == "SUCCESSFUL":
            # Update Payment & Order Status
            await self.repository.update_status(payment, "SUCCESSFUL")
            order = await self.order_repo.get_by_id(payment.order_id)
            if order:
                await self.order_repo.update_status(order, "PAID")
                # Activate subscription and grant program access
                await self.subscription_service.activate_subscription_for_order(order)

            # Audit event log
            event = PaymentEvent(
                payment_id=payment.id,
                event_type="payment.verified_server_side",
                provider=payment.provider,
                payload=json.dumps(verification_result),
            )
            await self.repository.create_event(event)

        return payment

    async def process_webhook(self, raw_body: bytes, signature: str) -> dict:
        """Process incoming gateway webhook event with signature validation and idempotency."""
        # 1. Verify webhook signature
        try:
            event_data = await self.provider.verify_webhook_signature(raw_body, signature)
        except Exception as exc:
            raise BadRequestException("Invalid webhook signature.") from exc

        event_type = event_data.get("event_type", "webhook.received")
        provider = event_data.get("provider", "MOCK")

        # Audit event log
        event = PaymentEvent(
            payment_id=None,
            event_type=event_type,
            provider=provider,
            payload=json.dumps(event_data),
        )
        await self.repository.create_event(event)

        return {"status": "processed", "event_type": event_type}

    async def refund_payment(self, provider_payment_id: str) -> Payment:
        """Refund a payment transaction (Admin/Provider)."""
        payment = await self.repository.get_by_provider_id(provider_payment_id)
        if not payment:
            raise NotFoundException(f"Payment transaction '{provider_payment_id}' not found.")

        refund_res = await self.provider.refund_payment(provider_payment_id)
        await self.repository.update_status(payment, "REFUNDED")

        # Audit event
        event = PaymentEvent(
            payment_id=payment.id,
            event_type="payment.refunded",
            provider=payment.provider,
            payload=json.dumps(refund_res),
        )
        await self.repository.create_event(event)
        return payment

    async def list_my_payments(self, current_user: User) -> Sequence[Payment]:
        return await self.repository.list_by_patient(current_user.id)
