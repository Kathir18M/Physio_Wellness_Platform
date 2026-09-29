"""
Notification provider factory for resolving channel implementations.
"""

from app.core.config import settings
from app.integrations.email.mock_provider import MockEmailProvider
from app.integrations.notifications.base import BaseNotificationProvider
from app.integrations.notifications.in_app_provider import InAppNotificationProvider
from app.integrations.notifications.whatsapp_provider import WhatsAppNotificationProvider


def get_notification_provider(channel: str) -> BaseNotificationProvider:
    """
    Factory function to return the configured notification provider for a channel.
    """
    ch = channel.upper()
    if ch == "IN_APP":
        return InAppNotificationProvider()
    elif ch == "EMAIL":
        return MockEmailProvider()
    elif ch == "WHATSAPP":
        return WhatsAppNotificationProvider(api_key=settings.WHATSAPP_API_KEY)
    else:
        raise ValueError(f"Unsupported notification channel: {channel}")
