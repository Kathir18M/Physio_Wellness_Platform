"""
In-app notification provider implementation.
"""

from typing import Any, Dict, Optional
from app.core.logging import get_logger
from app.integrations.notifications.base import BaseNotificationProvider

logger = get_logger(__name__)


class InAppNotificationProvider(BaseNotificationProvider):
    """Provider responsible for formatting and preparing in-app notifications."""

    async def send(
        self,
        recipient: str,
        subject: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        logger.info(
            "InApp notification prepared for user %s: [%s] %s",
            recipient,
            subject,
            message,
        )
        # In-app notifications are stored directly in the database as Notification entities.
        return True
