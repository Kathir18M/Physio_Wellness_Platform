"""
Mock Payment Provider implementation for development, staging, and automated unit testing.
"""

from __future__ import annotations

import uuid
from typing import Any

from app.integrations.payments.base import PaymentProviderABC


class MockPaymentProvider(PaymentProviderABC):
    """Mock payment provider simulating gateway checkouts and webhook verification."""

    async def create_checkout_session(
        self,
        order_id: str,
        amount: float,
        currency: str,
        customer_email: str,
        description: str,
    ) -> dict[str, Any]:
        session_id = f"cs_mock_{uuid.uuid4().hex[:12]}"
        payment_id = f"pay_mock_{uuid.uuid4().hex[:12]}"
        return {
            "provider": "MOCK",
            "checkout_session_id": session_id,
            "provider_payment_id": payment_id,
            "checkout_url": f"http://localhost:3000/checkout/mock?session_id={session_id}&order_id={order_id}",
            "amount": amount,
            "currency": currency,
            "status": "REQUIRES_PAYMENT",
        }

    async def verify_payment(self, provider_payment_id: str) -> dict[str, Any]:
        return {
            "provider": "MOCK",
            "provider_payment_id": provider_payment_id,
            "status": "SUCCESSFUL",
            "verified": True,
        }

    async def verify_webhook_signature(
        self,
        raw_body: bytes,
        signature: str,
    ) -> dict[str, Any]:
        # Simple signature validation simulation
        if not signature or signature == "invalid_sig":
            raise ValueError("Invalid webhook signature.")

        return {
            "event_type": "payment_intent.succeeded",
            "provider": "MOCK",
            "valid": True,
        }

    async def refund_payment(
        self,
        provider_payment_id: str,
        amount: float | None = None,
    ) -> dict[str, Any]:
        return {
            "provider": "MOCK",
            "refund_id": f"ref_mock_{uuid.uuid4().hex[:12]}",
            "provider_payment_id": provider_payment_id,
            "status": "REFUNDED",
        }
