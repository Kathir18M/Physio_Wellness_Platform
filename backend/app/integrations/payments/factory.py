"""
Payment Provider Factory.
Returns configured PaymentProvider instance based on environment settings.
"""

from __future__ import annotations

from app.core.config import settings
from app.integrations.payments.base import PaymentProviderABC
from app.integrations.payments.mock_provider import MockPaymentProvider


def get_payment_provider() -> PaymentProviderABC:
    """Return configured payment provider instance."""
    provider_type = getattr(settings, "PAYMENT_PROVIDER", "MOCK").upper()

    if provider_type == "MOCK":
        return MockPaymentProvider()

    # Fallback to MockPaymentProvider for safety
    return MockPaymentProvider()
