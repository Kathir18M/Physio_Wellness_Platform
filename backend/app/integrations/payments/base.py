"""
Abstract Base Class and Interfaces for Payment Providers.
Allows swapping between Mock, Stripe, Razorpay, or other gateways seamlessly.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class PaymentProviderABC(ABC):
    """Abstract payment provider interface."""

    @abstractmethod
    async def create_checkout_session(
        self,
        order_id: str,
        amount: float,
        currency: str,
        customer_email: str,
        description: str,
    ) -> dict[str, Any]:
        """Create a checkout session or transaction intent with payment gateway."""

    @abstractmethod
    async def verify_payment(self, provider_payment_id: str) -> dict[str, Any]:
        """Verify payment transaction status directly with the gateway API."""

    @abstractmethod
    async def verify_webhook_signature(
        self,
        raw_body: bytes,
        signature: str,
    ) -> dict[str, Any]:
        """Verify authenticity of webhook event signature."""

    @abstractmethod
    async def refund_payment(
        self,
        provider_payment_id: str,
        amount: float | None = None,
    ) -> dict[str, Any]:
        """Process partial or full refund for a transaction."""
