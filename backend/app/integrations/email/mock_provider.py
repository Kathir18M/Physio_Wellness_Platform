"""
Mock Email notification provider implementation.
"""

from typing import Any, Dict, Optional
from app.core.logging import get_logger
from app.integrations.email.base import BaseEmailProvider
from app.integrations.notifications.base import BaseNotificationProvider

logger = get_logger(__name__)


class MockEmailProvider(BaseEmailProvider, BaseNotificationProvider):
    """Mock Email Provider for testing and local development."""

    async def send_email(
        self,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        logger.info(
            "[Email Provider] Sent email to %s: [%s]\n%s",
            to_email,
            subject,
            body_text,
        )
        return True

    async def send(
        self,
        recipient: str,
        subject: str,
        message: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> bool:
        return await self.send_email(
            to_email=recipient,
            subject=subject,
            body_text=message,
            metadata=metadata,
        )
