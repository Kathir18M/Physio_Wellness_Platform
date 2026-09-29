"""
WhatsApp notification provider abstraction and mock implementation.
"""

from typing import Any, Dict, Optional
from app.core.logging import get_logger
from app.integrations.notifications.base import BaseNotificationProvider

logger = get_logger(__name__)


class WhatsAppNotificationProvider(BaseNotificationProvider):
    """Abstraction for WhatsApp message delivery (Twilio / Meta Graph API)."""

    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    async def send(
        self,
        recipient: str,
        subject: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        logger.info(
            "[WhatsApp Provider] Sending message to %s: %s - %s",
            recipient,
            subject,
            message,
        )
        # Mock delivery simulation (returns True)
        return True
